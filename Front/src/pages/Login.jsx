import React, { useState,useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';

import { UserContext } from '../context/UserContext.jsx';

function Login() {
  const [userdata, setUserdata] = useState({
    
    email: '',
    password: '',
   
  });
const [error ,setError] = useState('')
const navigate = useNavigate()
const{setCurrentUser} =useContext(UserContext)



  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmit = async(e)=>{
    e.preventDefault()
    // console.log(userdata);
    setError('')
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userdata)
      });
      if (response.ok) {
        const currentUser= await response.json()
        console.log("your email and password is correct");
        
        if (!currentUser) {
          setError("User couldn't find try again")
          
        }
        setCurrentUser(currentUser)
        navigate('/')
      }
      else{
      const errorResponse = await response.json()
      setError(errorResponse.message)

      }
    } catch (error) {
      setError('user can not login')
    }
  }

  return (
    <>
      <div className="min-h-screen flex justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign In</h2>
          </div>
          <form className="mt-8 space-y-6 " action="#" method="POST"
          onSubmit={handleSubmit}
          
          >
            {
              error &&
                <p className=' bg-red-500  p-1 text-white rounded-sm'>{error}</p>
              }
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px p-1">
              
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={userdata.email}
                  onChange={handleChange}
                  autoFocus
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={userdata.password}
                  onChange={handleChange}
                />
              </div>
              
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                
              >
                Login
              </button>
            </div>
          </form>
          <div className="text-sm text-center">
            <p>
              Don't have account ?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
