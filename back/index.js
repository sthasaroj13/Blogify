import express from "express";
import cors from "cors";
import { connect } from "mongoose";

import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
import upload from "express-fileupload";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// app.use(cors({credentials:true ,origin:"http://localhost:3000"}))

app.use(
  cors({
    origin: "*", // Allow requests from this origin
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

//set up file uploads
app.use(upload());
//serve upload file statically
app.use("/uploads", express.static(__dirname + "/uploads"));

//define routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
//error handling middlewares
app.use(notFound);
app.use(errorHandler);

//connect to MongoDB  and start server
connect(process.env.MOOGOSE_URL)
  .then(() => {
    console.log("Database is connected successfully");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
