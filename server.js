require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = socketIO(server);
const cors = require('cors')

const logger = require("morgan");
const DBUrl = process.env.DATABASE;
const port = process.env.PORT || 9090;
const globalErrorHandler = require("./controllers/errorController");
const notFoundError = require("./utils/notFoundError");

const { connectDataBase } = require("./utils/connectDataBase");


const adminStudentRouter = require("./routers/student/adminStudentRouter");

connectDataBase(DBUrl); // connect data base
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1024MB" }));
app.use(express.static(path.join(__dirname, "build")));

app.use(cors())
app.use("/api/v1/student", adminStudentRouter);


// Import necessary dependencies
const router = express.Router();

// Define a simple GET endpoint
router.get('/api/test', (req, res) => {
    res.json({ message: 'Server is connected!' });
});

// Export the router
module.exports = router;


app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.use(globalErrorHandler); // global error handler
app.use("/", notFoundError); // Not found error handler

server.listen(port, () =>
    console.log(`Sunayana server is listening on port ${port}!`)
);
