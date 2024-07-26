const User = require("../models/user");
const jwt = require("jsonwebtoken");
const path = require("path");

exports.signAggrement = async (req, res) => {
  try {
    const file = req.file;
    const id = req.params.userId;
    console.log("id ", id);
    console.log("file path ", file.path);
    const isExistingUser = await User.findById(id);
    if (!isExistingUser) {
      return res.status(404).json({ message: "user not found", success: true });
    }
    isExistingUser.userSignedAggrementUrl = file.path;
    isExistingUser.isAgree = true;
    isExistingUser.save();
    const payload = {
      user: {
        id: isExistingUser.id,
        email: isExistingUser.email,
        isAgree: isExistingUser.isAgree,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    return res.status(200).json({
      message: "sign saved successfully ",
      user: isExistingUser,
      token: token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error", success: false });
  }
};

exports.getSign = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const isExistingUser = await User.findById(id);
    if (!isExistingUser) {
      return res.status(404).json({ message: "user not found", success: true });
    }
    const filePath = isExistingUser.userSignedAggrementUrl;
    if (filePath) {
      return res.status(200).sendFile(path.resolve(filePath));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "internal server error", success: false });
  }
};
