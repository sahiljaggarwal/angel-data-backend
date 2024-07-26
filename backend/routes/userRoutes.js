const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");
const contactControlller = require("../controllers/contactController");
const signController = require("../controllers/signController");
const upload = require("../middleware/multerMiddleware");
// const auth = require("../middleware/authMiddleware");
// signup / login
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/confirmation/:token", authController.confirmation);
// task
router.post("/:userId/tasks", taskController.createTask);
router.get("/:userId/tasks", taskController.getTasks);
router.put("/:userId/tasks/:taskId", taskController.updateTask);
router.delete("/:userId/tasks/:taskId", taskController.deleteTask);
// user message
router.post("/contact", contactControlller.contactMessage);
// sign
console.log("upload ", upload);
router.post(
  "/:userId/sign",
  upload.single("file"),
  signController.signAggrement
);
router.get("/:id/sign", signController.getSign);
module.exports = router;
