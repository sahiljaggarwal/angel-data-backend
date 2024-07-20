const contact = require("../models/contact");
const Contact = require("../models/contact");
const contactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newContact = new Contact({
      name,
      email,
      message,
    });
    await newContact.save();
    if (!newContact) {
      return res
        .status(404)
        .json("feedback not submitted, please try again later");
    }
    return res
      .status(201)
      .json({ message: "Feedback submitted successfully'" });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  contactMessage,
};
