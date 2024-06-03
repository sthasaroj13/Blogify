import { Post } from "../models/post.models.js";
import { User } from "../models/user.nodels.js";
import HttpError from "../models/error.models.js";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/////========Create post =======////////
//POST :api/posts
//PROTECTED
const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;
    // console.log(req.body);
    if (!title || !category || !description || !req.files) {
      return next(new HttpError("Fill in all fields  and thumbnail", 422));
    }

    const { thumbnail } = req.files;
    //   console.log(req.files);
    //check thefile size
    if (thumbnail.size > 2000000) {
      return next(
        new HttpError(
          " Thumbnail is too big . File should be less than 2MB",
          422
        )
      );
    }

    let FileName = thumbnail.name;
    let SplittedFileName = FileName.split(".");
    let newFileName =
      SplittedFileName[0] +
      uuidv4() +
      "." +
      SplittedFileName[SplittedFileName.length - 1];

    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        } else {
          const newPost = await Post.create({
            title,
            description,
            category,
            thumbnail: newFileName,
            creator: req.user.id,
          });
          if (!newPost) {
            return next(new HttpError("post couldnot be created", 422));
          }

          //find user and increate     post  count by 1
          const currentUser = await User.findById(req.user.id);
          const userPostCount = currentUser.posts + 1;
          await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
          res.status(200).json(newPost);
        }
      }
    );
  } catch (error) {
    return next(new HttpError("error happen"));
  }
};

/////========Get posts =======////////
//POST :api/posts
//PROTECTED
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/////========get single  post =======////////
//get :api/posts/:id
//UNPROTECTED
const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError(" Post doesnot found", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/////======== get post by category =======////////
//get :api/posts/categories/:category
//UNPROTECTED
const getCatPost = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ updatedAt: -1 });
    if (!catPosts) {
      return next(new HttpError(" Category is not found"));
    }
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};
/////======== get post by author =======////////
//get :api/posts/users/:id
//UNPROTECTED

const getUserPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    if (!posts) {
      return next(new HttpError("No post is found for user"));
    }

    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/////======== edit post =======////////
//patch:api/posts/:id
//PROTECTED

const eidtPost = async (req, res, next) => {
  try {
    let fileName;
    let newFileName;
    let updatedPost;
    //req from db
    const postId = req.params.id;
    let { title, description, category } = req.body;
    //checked
    if (!title || !description || !category) {
      return next(new HttpError("Fill in all Field", 422));
    }
    //if no files are attached it updates the post data only (title, description, category).
    if (!req.files)
      updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { title, category, description },
        { new: true }
      );
    //if the is file attached than
    else {
      //get old post frpm database
      const oldPost = await Post.findById(postId);
      if (!oldPost) {
        return next(new HttpError("Post not found", 404));
      }

      //delete old post from updated
      fs.unlink(
        path.join(__dirname, "..", "uploads", oldPost.thumbnail),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );

      //upload new thumbnail
      const { thumbnail } = req.files;
      if (thumbnail.size > 2000000) {
        return next(
          new HttpError("Thumbnail is too big .Should be less than 2MB")
        );
      }
      // making image unique
      fileName = thumbnail.name;
      let SplittedFileName = fileName.split(".");
      newFileName =
        SplittedFileName[0] +
        uuidv4() +
        "." +
        SplittedFileName[SplittedFileName.length - 1];

      thumbnail.mv(
        path.join(__dirname, "..", "/uploads", newFileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );
      //updated the new update post
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, description, category, thumbnail: newFileName },
        { new: true }
      );
    }
    if (!updatedPost) {
      return next(new HttpError("Couldn't update post", 400));
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

/////======== delete post =======////////
//delete:api/posts/:id
//PROTECTED
const deletePost = async (req, res, next) => {
  try {
    // extracts the post ID from the request parameters.
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post Unavilable", 400));
    }
    //find the post from DB
    const post = await Post.findById(postId);
    // if post is exits it reclaim the thumnail from DB
    const fileName = post?.thumbnail;
    // it check if the user making the request is the creator of post
    if (req.user.id == post.creator) {
      //delete thumbnail from uplaad folder
      fs.unlink(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          } else {
            await Post.findByIdAndDelete(postId);
            //find user and reduce post count by 1
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
          }
        }
      );
    } else {
      return next(new HttpError("post couldn't be deleted", 403));
    }

    res.status(200).json(`Post ${postId} delete Sucessfully !!!`);
  } catch (error) {
    return next(new HttpError(error));
  }
};
export {
  createPost,
  getPosts,
  getPost,
  getCatPost,
  getUserPost,
  eidtPost,
  deletePost,
};
