import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

function PostItems({
  postID,
  category,
  title,
  desc,
  creator,
  thumbnail,
  createdAt,
}) {
  return (
    <>
    <article className="border  border-gray-400 p-2 rounded-lg shadow-md max-w-3xl ml-10 mb-5 mt-2"
    // style={{width:'35rem'}}
    >
      <div className=" items-center mt-4 md:mt-0 ">
        <PostAuthor creator={creator} createdAt={createdAt} />
      </div>
      <div>
        <img
          src={`${"http://localhost:5000"}/uploads/${thumbnail}`}
          alt={title}
          className="h-30  p-2  rounded-sm"
          />
      </div>
      <div className="flex flex-col justify-between">
        <div className="mt-4 md:mt-0">
          <Link to={`/posts/${postID}`} className=" ">
            <h3
              className="text-lg md:text-xl font-semibold text-blue-600 hover:underline mt-2"
              style={{ display: "inline-block" }}
              >
              {title}
            </h3>
          </Link>
          <p className="text-sm text-wrap truncate mb-10">
            <span
              className="line-clamp-2"
              dangerouslySetInnerHTML={{ __html: desc }}
              ></span>
          </p>
        </div>

        <div className=" flex justify-end">
          <Link
            to={`/posts/categories/${category}`}
            className=" text-sm text-blue-600 hover:underline ml-auto text-right"
            >
            {category}
          </Link>
        </div>
      </div>
    </article>
            </>
  );
}

export default PostItems;
