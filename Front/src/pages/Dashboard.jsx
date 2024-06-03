import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../component/Loader.jsx";
import DeletePost from './DeletePost.jsx'

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const token = currentUser?.token;

  //redirect to login page for any user who is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/posts/users/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
      
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="container mx-auto px-4 mt-16">
      <h1 className="text-2xl font-bold mb-4 text-center mt-3 ">
        My Dashboard
      </h1>
      <section className="flex flex-col -mx-4">
        {posts.length > 0 ? (
          posts.map((post, id) => (
            <div key={id} className=" mt-5">
              <article className="border p-4 bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 mb-6">
                <div className="mb-2">
                  <img
                    src={`${"http://localhost:5000"}/uploads/${post.thumbnail}`}
                    alt=""
                    className="w-20 rounded-lg"
                  />
                </div>
                <div>
                  <h5 className="text-xl font-semibold">{post.title}</h5>
                </div>
                <div className="flex justify-end gap-11 mt-4">
                  <Link to={`/posts/${post._id}`} className="btn">
                    View
                  </Link>
                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="btn bg-blue-400 p-1 text-white rounded-lg"
                  >
                    Edit
                  </Link>
                 <DeletePost postId={post._id}/>
                </div>
              </article>
            </div>
          ))
        ) : (
          <h2 className="text-lg text-red-500 mb-9">
            You have no posts yet!!!
          </h2>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
