import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import bo from "../images/unknown.jpg";
import { GrUpdate } from "react-icons/gr";
import { UserContext } from "../context/UserContext";
function UserProfile() {
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentpassword, setCurrentpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

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
    const getUser = async () => {
      const response = await fetch(
        `http://localhost:5000/api/users/${currentUser.id}`,
        {
          method: "GET",
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEmail(data.email);
        setName(data.name);
        setAvatar(data.avatar);
      }
    };
    getUser();
  }, []);

  const updatedUserDetails = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();
      userData.append("name", name);
      userData.append("email", email);
      userData.append("currentpassword", currentpassword);
      userData.append("newpassword", newpassword);
      userData.append("confirmNewPassword", confirmNewPassword);
      // console.log(userData.append);
      const response = await fetch(`http://localhost:5000/api/users/editUser`, {
        method: "PATCH",
        body: userData,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // User details updated successfully, log user out
        navigate("/logout");
      } else if (response.status === 422) {
        // Handle the specific error for Unprocessable Entity
        const errorData = await response.json();
        setError(errorData.message); // Assuming your API returns error message in a JSON format
      } else {
        // Handle other error responses
        setError("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Server Error");
    }
  };
  //for profile avatar
  const inputref = useRef(null);

  const handleAvatar = () => {
    inputref.current.click();
  };
   const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      // No file selected, handle the case (e.g., clear preview)
      return;
    }

    // Option 1: Preview image locally using FileReader
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setAvatar(event.target.result); // Update state with data URL
    };

    // Option 2 (if server-side already handles preview):
    // setAvatar(URL.createObjectURL(file));

    // Disable the file input to prevent multiple selections (optional)
    event.target.value = null;
  };
  const handleSubmit= async(e)=>{
    e.preventDefault()
// console.log('hello');
try {
  const postData = new FormData();
  postData.append('avatar',avatar);
  const response = await fetch(`http://localhost:5000/api/users/changeAvatar`,{
    method: "GET",
    body: userData,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },

  })
  if (response.ok) {
    const data = await response.json();
    setAvatar(data)
    
  }
} catch (error) {
  setError(' Sorry Fail to upload profile picture ')
  
}

  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 mt-16">
        <section>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 text-center">
              <Link
                to={`/myposts/${currentUser.id}`}
                className="  btn bg-slate-100 hover:bg-slate-300 text-gray rounded-lg px-3 py-1.5"
              >
                My Posts
              </Link>
            </div>
            <div className="p-4 ">
              <div className="flex items-center justify-center">
                <div className="avatar"></div>

                  
                    <form className="flex items-center" onSubmit={handleSubmit}>
                      <div className="">

                    <img src={`http://localhost:5000/uploads/${avatar}`} alt="" className="h-40 rounded-full " onClick={handleAvatar} />
                    <input
                      type="file"
                      name="avatar"
                      id="avatar"
                      accept="png, jpg, jpeg"
                      onChange={handleAvatarChange}
                      className="hidden absolute inset-0 w-full h-full opacity-0"
                      ref={inputref}
                      />
                      </div>
                  <GrUpdate type="submit" className="text-blue-500 text-2xl cursor-pointer mt-20 transform -translate-x-1/2 -translate-y-2/2" />
                </form>
              </div>
              <h1 className="text-2xl font-bold text-center mt-4">
                {currentUser.name}
              </h1>
              <form onSubmit={updatedUserDetails}>
                {error && (
                  <p className=" bg-red-500  p-1 text-white rounded-sm">
                    {error}
                  </p>
                )}

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="FullName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  id="password"
                  name="currentpassword"
                  type="password"
                  autoComplete="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Current Password"
                  value={currentpassword}
                  onChange={(e) => setCurrentpassword(e.target.value)}
                />

                <input
                  id="newPassword"
                  name="newpassword"
                  type="password"
                  autoComplete="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="NewPassword"
                  value={newpassword}
                  onChange={(e) => setNewpassword(e.target.value)}
                />
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  autoComplete="confirmNewPassword"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default UserProfile;
