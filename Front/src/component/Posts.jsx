import React, { useEffect, useState } from "react";
import PostItems from "./PostItems.jsx";
import Loader from "./Loader.jsx";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setPosts(responseData);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchPost();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center mt-20 ">
      <div className="max-w-lg w-full">
        <div className="p-4">
          {posts.length > 0 ? (
            posts.map(({ _id: id, thumbnail, category, title, description, creator, createdAt }) => (
              <PostItems
                key={id}
                postID={id}
                thumbnail={thumbnail}
                category={category}
                title={title}
                desc={description}
                creator={creator}
                createdAt={createdAt}
              />
            ))
          ) : (
            <h2 className="text-red-500">No posts found</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Posts;
