const Student = require("./../../models/student/studentModel")
const jwt = require("jsonwebtoken"); // Import JSON Web Token library
const nodemailer = require("nodemailer"); // Import Nodemailer for sending emails
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const StudentRegistation = require("../../models/student/studentRegistration");
const StudentRegistration = require("../../models/student/studentRegistration");

// exports.protect = async (req, res, next) => {
//     try {
//         let token;
//         if (req.headers.cookie) {
//             const value = req.headers.cookie.split("bearerTokenAdmin=")[1];
//             token = value.split(";")[0];
//             console.log(`token :${token}`)
//             if (!token) {
//                 // Unauthorized if token is missing
//                 res.status(401).json({
//                     status: "unauthorized",
//                     message: "You are not logged in! Please log in to get access",
//                 });
//             } else {
//                 const decoded = jwt.verify(token, process.env.JWT_SECRET);
//                 currentStudent = await Student.findById(decoded.id);
//                 if (!currentAdmin) {
//                     // Unauthorized if user not found
//                     res.status(404).json({
//                         status: "not found",
//                         message: "User not found",
//                     });
//                 } else {
//                     req.admin = currentAdmin;
//                     next();
//                 }
//             }
//         } else {
//             res.status(404).json({
//                 status: "not found",
//                 message: "User not found",
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         // Unauthorized if token verification fails
//         res.status(401).json({
//             status: "unauthorized",
//             message: "You are not logged in! Please log in to get access",
//         });
//     }
// };


exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.cookie) {
            const value = req.headers.cookie.split("bearerTokenAdmin=")[1];
            token = value.split(";")[0];
            console.log(`token :${token}`)
            if (!token) {
                // Unauthorized if token is missing
                res.status(401).json({
                    status: "unauthorized",
                    message: "You are not logged in! Please log in to get access",
                });
            } else {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                currentStudent = await Student.findById(decoded.id);
                if (!currentStudent) {
                    // Unauthorized if user not found
                    res.status(404).json({
                        status: "not found",
                        message: "User not found",
                    });
                } else {
                    req.student = currentStudent;
                    next();
                }
            }
        } else {
            res.status(404).json({
                status: "not found",
                message: "User not found",
            });
        }
    } catch (error) {
        console.log(error);
        // Unauthorized if token verification fails
        res.status(401).json({
            status: "unauthorized",
            message: "You are not logged in! Please log in to get access",
        });
    }
};

exports.socketProtect = async (socket, next) => {
    if (socket.request.headers.cookie) {
        const value = socket.request.headers.cookie.split("bearerTokenAdmin=")[1];
        const token = value.split(";")[0];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            currentAdmin = await Student.findById(decoded.id);
            if (currentAdmin) {
                socket.admin = currentAdmin;
                next();
            }
        }
    }
};


exports.studentRegistration = async (req, res, next) => {
    try {
        const { name, email, mobile, password, role } = req.body;

        // const existingUser = role === 'student' ? await Student.findOne({ email }) : await Counselor.findOne({ email });

        const checkUser = await Student.findOne({ email });
        if (!checkUser) {
            const user = await Student.create({
                name, email, mobile, password,
            });

            // Generate JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1h' // Token expires in 1 hour
            });

            user.password = undefined;
            res.status(200).json({
                status: "success",
                message: "Student User Created",
                data: {
                    user,
                    token // Send the token in the response
                },
            });
        } else {
            res.status(409).json({
                status: "conflict",
                message: "Email already exists"
            });
        }
    } catch (error) {
        console.log("Error with signup", error)
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};


// exports.studentLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             // Missing email or password
//             res.status(404).json({
//                 status: "not found",
//                 message: "Enter Email and Password",
//             });
//         } else {
//             const admin = await Student.findOne({ email }).select("+password");
//             if (!admin || !(await admin.correctPassword(password, admin.password))) {
//                 // Invalid credentials
//                 res.status(403).json({
//                     status: "unauthorized",
//                     message: "Invalid Username or Password",
//                 });
//             } else {
//                 // Successful login
//                 createSendToken(admin, 200, res);
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         // Internal server error
//         res.status(500).json({
//             status: "error",
//             message: "Internal server error",
//         });
//     }
// };

exports.createStudent = async (req, res, next) => {
    try {
        const {


            fullName,
            dateOfBirth,
            gender,
            address,
            phoneNumber,
            email,
            programOfInterest,
            consent,
            previousEducation,
            country,
            state,
            city,
            languageProficiency






        } = req.body;

        const checkUser = await StudentRegistration.findOne({ email });
        if (!checkUser) {
            const student = await StudentRegistration.create({
                fullName,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                address,
                phoneNumber,
                email,
                programOfInterest,
                previousEducation,
                languageProficiency,
                consent,
                country,
                state,
                city,

            });

            await student.save();
            res.status(201).json({ success: true, data: student });
        } else {
            res.status(400).json({ success: false, error: "User already exists" });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.studentLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide email and password",
            });
        }

        // Check if user exists in the database
        const user = await Student.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
            });
        }

        // Check if the provided password matches the hashed password in the database
        const isPasswordCorrect = await user.correctPassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expires in 1 hour
        });

        res.status(200).json({
            status: "success",
            message: "Login successful",
            data: {
                user,

            },
        });
    } catch (error) {
        console.log("Error with login", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
const createSendToken = (admin, statusCode, res) => {
    const token = signToken(admin._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 62 * 62 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    admin.password = undefined;
    res.cookie("bearerTokenAdmin", token, cookieOptions);
    res.status(statusCode).json({
        status: "success",
        message: "Login Successfully",
        data: {
            admin,
            token,
        },
    });
};
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};