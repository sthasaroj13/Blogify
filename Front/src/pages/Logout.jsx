import React from 'react'
import { useEffect,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext.jsx'

function Logout() {
  const {setCurrentUser} = useContext(UserContext);
  const navigate = useNavigate()

  setCurrentUser(null)
  navigate('/login')
  return (
    <>
   
      
    </>
  )
}

export default Logout
