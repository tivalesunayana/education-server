const express = require("express");
const router = express.Router();
const studentAuthController = require("../../controllers/student/studentAuthController")

const { protect } = require("../../controllers/student/studentAuthController");

router
    .route("/")
    .post(studentAuthController.studentRegistration)

router
    .route("/login")
    .post(protect, studentAuthController.studentLogin)

router
    .route("/createStudent")
    .post(studentAuthController.createStudent)

module.exports = router;
