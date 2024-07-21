const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.signup = async (req, res) => {
  console.log("signup is running");
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ msg: "User already exists", success: true });
    }

    // Create a new user
    user = new User({
      name,
      email,
      password,
      verificationToken: crypto.randomBytes(20).toString("hex"),
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.isVerified = true;
    // Save the user
    await user.save();

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Account Verification Token",
      text: `Hello, \n\nPlease verify your account by clicking the link: \nhttp://${req.headers.host}/confirmation/${user.verificationToken}\n`,
    };

    // Send verification email
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("There was an error:", err);
        return res
          .status(500)
          .send(
            "Technical Issue! Please click on resend to verify your email."
          );
      }
      return res
        .status(200)
        .send(
          "A verification email has been sent to " +
            user.email +
            ". It will expire after one day. If you do not receive the verification email, click on resend token."
        );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// exports.signup = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     user = new User({
//       name,
//       email,
//       password,
//       verificationToken: crypto.randomBytes(20).toString("hex"),
//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // Send verification email
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: user.email,
//       subject: "Account Verification Token",
//       text: `Hello, \n\n Please verify your account by clicking the link: \nhttp:\/\/${req.headers.host}\/confirmation\/${user.verificationToken}\n`,
//     };

//     transporter.sendMail(mailOptions, (err, response) => {
//       if (err) {
//         console.error("There was an error: ", err);
//         return res
//           .status(500)
//           .send(
//             "Technical Issue!, Please click on resend for verify your Email."
//           );
//       }
//       return res
//         .status(200)
//         .send(
//           "A verification email has been sent to " +
//             user.email +
//             ". It will be expire after one day. If you not get verification Email click on resend token."
//         );
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Invalid Credentials", success: true });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Invalid Credentials", success: true });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: "Email not verified", success: true });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    console.log("token ", token);
    return res
      .status(200)
      .json({ message: "login successfully", success: true, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.confirmation = async (req, res) => {
  const { token } = req.params;

  try {
    // Find the user with the provided verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        msg: "We were unable to find a user for this token. Please sign up!",
      });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ msg: "This user has already been verified." });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res
      .status(200)
      .json({ msg: "The account has been verified. Please log in." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
