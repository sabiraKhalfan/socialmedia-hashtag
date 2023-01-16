import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRouter.js";
import PostRoute from "./Routes/PostRoute.js";
import UploadRoute from "./Routes/UploadRoute.js";
import CommentRoute from "./Routes/CommentRoute.js";
import ChatRoute from "./Routes/ChatRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";
import { corsOptions } from "./config/cors.js";

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
connectDB();

app.use(express.static("public"));
app.use("/static", express.static("static"));
app.use("/images", express.static("images"));
app.use("/videos", express.static("videos"));

//Routes
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/upload", UploadRoute);
app.use("/comment", CommentRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [ "http://localhost:3000"]
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  //add new user
  socket.on("addNewUser", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("Connected users", activeUsers);
    io.emit("getUsers", activeUsers);
  });

  //send message
  socket.on("sendMessage", (data) => {
    const { receiverId } = data;
    const receiver = activeUsers.find((user) => user.userId === receiverId);
    console.log("sending from socket io: ", receiverId);
    console.log("Data", data);
    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("getUsers", activeUsers);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, console.log(`server up and running on ${PORT}`));
