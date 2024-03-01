const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");

const StudentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            minlength: 8,
            select: false,
        },
        mobile: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
StudentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

StudentSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const Student = mongoose.model("Student", StudentSchema)
module.exports = Student