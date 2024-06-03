import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import Loader from "../component/Loader";
import unknown from "../images/unknown.jpg";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthor = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAuthors(data);
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    getAuthor();
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 py-6 mt-16">
      {authors.length > 0 ? (
        authors.map(({ _id: id, avatar, name, posts }) => (
          <Link key={id} to={`/posts/users/${id}`}>
            <div className="flex items-center p-2 bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
              {avatar ? (
                <img
                  src={`${"http://localhost:5000"}/uploads/${avatar}`}
                  alt="Avatar"
                  className="h-20 w-20 object-cover rounded-full"
                />
              ) : (
                <img
                  src={unknown}
                  alt="Avatar"
                  className="h-20 w-20 object-cover rounded-full"
                />
              )}

              <div className="flex flex-col justify-center ml-14">
                <h3 className="text-base font-semibold text-gray-800">
                  {name}
                </h3>
                <p className="text-xs text-gray-600">{posts} Posts</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <h1 className="text-center  text-red-500">Error: No Authors found</h1>
      )}
    </section>
  );
}

export default Authors;
