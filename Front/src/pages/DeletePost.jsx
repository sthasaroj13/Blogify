import React from "react";
import { useContext, useEffect ,useState} from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import Loader from "../component/Loader.jsx";

function DeletePost({postId:id}) {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const loaction = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const token = currentUser?.token;

  //redirect to login page for any user who is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const removePost = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "DELETE",
        withCredentials:true,
        headers: {
          Authorization :`Bearer ${token}`
        },
      });
      if (response.status== 200) {
        if (loaction.pathname ==`/myposts/${currentUser.id}`) {
          navigate(0)
          
        }
        else{
          navigate('/')
        }
        
      }
    } catch (error) {
      console.log(error);
     
    }
    setIsLoading(false)
  };
  if (isLoading) {
    return <Loader/>
    
  }
  return (
    <div>
      <Link
        className="bg-red-500 p-1 text-white rounded-md "
        onClick={() => removePost(id)}
      >
        Delete
      </Link>
    </div>
  );
}

export default DeletePost;
