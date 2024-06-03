import React, { useState,useEffect } from 'react'

import PostItems from '../component/PostItems'
import Loader from "../component/Loader.jsx"
import { useParams } from 'react-router-dom';

function CategoryPosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {category} = useParams()
  
    useEffect(() => {
      const fetchPost = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/api/posts/categories/${category}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const responseData = await response.json();
            setPosts(responseData);
            // console.log(responseData)
          }
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false); // Make sure to set isLoading to false even in case of error
        }
      };
      fetchPost();
    }, [category]);
  
    if (isLoading) {
      return <Loader />; // Make sure to return the Loader component
    }
  
    return (
      <section className="flex  justify-center mt-20 ">
        <div className='max-w-lg w-full '>
          <h1 className=" text-center text-xl">Category:{category}</h1>

        {posts.length > 0 ? (
          posts.map(({ _id:id, thumbnail, category, title, description, creator ,createdAt}) => (
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
              <h2 className="text-red-500">no posts found</h2>
              )}
              </div>
      </section>
    );
  }

export default CategoryPosts
