// Dependencies
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const connectDB = require("./db/connect");
const { clientURL } = require("./URI");

// Routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");

// Middlewares
const errorHandlerMiddleware = require("./middleware/error-handler");
const authorizationMiddleware = require("./middleware/authorization");
const notFoundMiddleware = require("./middleware/not-found");

const app = express();
const server = http.createServer(app);

// Socket.IO initialization
const io = new Server(server, {
  cors: { origin: "https://deft-bubblegum-623f97.netlify.app" },
});

const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(xss());
app.use(helmet());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// Middleware to handle CORS
app.use(
  cors({
    origin: "https://deft-bubblegum-623f97.netlify.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome" });
});

io.on("connection", (socket) => {
  // Socket.IO event handlers
  // ...
  // Rest of your socket.io logic
  // ...
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/chats", authorizationMiddleware, chatRouter);
app.use("/api/v1/messages", authorizationMiddleware, messageRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}`)
    );
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

start();
