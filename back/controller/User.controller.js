import HttpError from "../models/error.models.js";
import { User } from "../models/user.nodels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";

import { fileURLToPath } from "url";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//===================register A new user
//==== Post :api/user/register
//unprotected

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("fill in  all fields", 422));
    }
    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("user email already exists", 422));
    }
    if (password.trim().length < 6) {
      return next(
        new HttpError("password should be at least 6 characters ", 422)
      );
    }
    if (password != password2) {
      return next(new HttpError("password doesnot match", 422));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUSer = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });
    res.status(200).json(`New user ${newUSer.email} registered sucessfully `);
  } catch (error) {
    return next(new HttpError("user registration is failed ", 422));
  }
};
//===================login a registerd user
//==== Post :api/users/login
//unprotected

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("fill all the field", 422));
    }
    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Invalid credentials", 422));
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Invalid credentials", 422));
    }
    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      new HttpError("Login failed . please check your  credentials.", 422)
    );
  }
};

//===================user profile
//==== Post :api/users/:id
//unprotected

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("user is not found"), 404);
    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===================change user Avatar (profile picture)
//==== Post :api/user/change-avatar
//unprotected

const changeAvatar = async (req, res, next) => {
  try {
    // console.log("Received request to change avatar");
    if (!req.files.avatar) {
      return next(new HttpError("Please choose an image.", 422));
    }

    // Find user from the database
    const user = await User.findById(req.user.id);

    // Delete old avatar if exists
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }

    // Check the file size
    const avatar = req.files.avatar;
    if (avatar.size > 500000) {
      return next(
        new HttpError(
          "Profile picture is too big in size. Should be less than 500KB",
          422
        )
      );
    }

    // Generate a unique file name for the new avatar
    const fileName = avatar.name;
    const splittedFileName = fileName.split(".");
    const newFileName =
      splittedFileName[0] +
      uuidv4() +
      "." +
      splittedFileName[splittedFileName.length - 1];

    // Move the avatar to the uploads directory
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }

        // Update the user document with the new avatar file name
        const updateAvatar = await User.findByIdAndUpdate(
          req.user.id,
          { avatar: newFileName },
          { new: true }
        );

        if (!updateAvatar) {
          return next(new HttpError("Avatar could not be changed", 422));
        }

        res.status(200).json(updateAvatar);
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

//==================edit user details (from profile)
//==== Post :api/users/edit-user
//unprotected

const editUser = async (req, res, next) => {
  try {
    const { name, email, currentpassword, newpassword, confirmNewPassword } =
      req.body;
      if (!name || !email || !currentpassword || !newpassword) {
        return next(new HttpError("Fill in all fields", 422));
      }
      
    //get user from DB
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found ", 403));
    }
    //make sure that  new email doesn't already

    const emailExits = await User.findOne({ email });
    //we want to update other details with/without  changing the email (which is a unique id beacuse we use  it to login)
    if (emailExits && emailExits._id !== req.user.id) {
      return next(new HttpError("Email already exits.", 422));
    }
    //compare the password

    const validateUSerPassword = await bcrypt.compare(
      currentpassword,
      user.password
    );
    if (!validateUSerPassword) {
      return next(new HttpError("Invalid current password.", 422));
    }
    //compare new password
    if (newpassword !== confirmNewPassword) {
      return next(new HttpError(" New password doesnot match.", 422));
    }
    //hash new password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(newpassword, salt);

    // at last to update the user

    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password: hashPass },
      { new: true }
    );

    res.status(200).json(newInfo);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//==================GET AUTHER
//==== Post :api/user/authors
//unprotected

const getAuthors = async (req, res, next) => {
  try {
    const user = await User.find().select("-password");
    if (!user) {
      return next(new HttpError(" the user is not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError("errorrrrrr"));
  }
};

export { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors };
