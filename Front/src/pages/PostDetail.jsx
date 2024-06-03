import React, { useContext, useEffect, useState } from "react";
import PostAuthor from "../component/PostAuthor";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import Loader from "../component/Loader.jsx";
import DeletePost from "./DeletePost.jsx";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPost(data);
          
        } else {
          setError("internal server error");
        }
        setIsLoading(false);
      } catch (error) {
        setError("something went wrong ");
      }
    };
    getPost();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex justify-center mt-16">
        <section className="mb-11 ml-3 bg-white rounded-lg shadow-lg p-6">
          {error && <p>{error} </p>}
          {post && (
            <div className="flex flex-col" style={{ justifyItems: "center" }}>
              <div className="flex items-center justify-between mb-4 " style={{borderBottom:'1.5px solid grey'}}>
                <div>

                <PostAuthor creator={post.creator} createdAt={post.createdAt} />
                </div>
                {currentUser?.id == post?.creator && (
                  <div className="flex gap-6 justify-end">
                    <Link
                      to={`/posts/${post?._id}/edit`}
                      className="bg-indigo-500 px-1 py-0.5 text-white rounded-md mb-5"
                    >
                      Edit
                    </Link>
                    <DeletePost postId={id} />
                  </div>
                )}
              </div>
              <h1> {post.title}</h1>
              <div>
                <img
                  src={`${"http://localhost:5000"}/uploads/${post.thumbnail}`}
                  alt=""
                  className="h-72 w-full object-cover"
                />
              </div>
              <div className="text-left" style={{ maxWidth: "34rem" }}>
                <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default PostDetail;
