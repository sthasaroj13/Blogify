import React, { useState,useContext, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';


export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const {currentUser} = useContext(UserContext)
  const navigate = useNavigate()
  const token = currentUser?.token

  //redirect to login page for any user who is not logged in
   useEffect(()=>{
    if (!token) {
      navigate('/login')
      
    }
   },[])

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image'
  ];

  const postCategories = ['Agriculture', 'Business', 'Education', 'Entertainment', 'Art', 'Investment', 'Uncategorized', 'Weather'];


  const createPost = async(e)=>{
    e.preventDefault()
    const postData = new FormData()
    postData.append('title', title);
    postData.append('category', category);
    postData.append('description', description);
    postData.append('thumbnail', thumbnail);
    // console.log(title,thumbnail,category,description);
    try {
       const response = await fetch(`http://localhost:5000/api/posts`,{
        method: "POST",
        body:postData,
        withCredentials:true,
        headers: {
          Authorization :`Bearer ${token}`
        },


      })
      if (response.status===200) {
        return navigate('/')
        
      }
      else{
        const errMsg = await response.json()
        setError(errMsg.message)
      }
      
    } catch (error) {
      setError(error.message)
      
    }





  }
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h2 className="text-2xl font-semibold mb-4">Create Post</h2>
      <div className="bg-white rounded-lg shadow-lg p-6 mt-2">
        {
          error &&
          
            <p className=' bg-red-500 p-1 text-white'> {error} </p>
          
        }

        <form className="space-y-4" onSubmit={createPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            autoFocus
          />
          <select
            name="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border rounded p-2 bg-gray-100"
          >
            {postCategories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
            className="h-64 border rounded p-1 mb-5"
          /> <br /> <br />
          <div className="flex items-center space-x-4 ">
            <label htmlFor="thumbnail">Thumbnail:</label>
            <input
              type="file"
              id="thumbnail"
              onChange={e => setThumbnail(e.target.files[0])}
              accept="image/png, image/jpeg, image/jpg"
              className="border rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
