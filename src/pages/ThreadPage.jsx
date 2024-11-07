import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Thread from '../components/Thread';
import axios from 'axios';

const ThreadPage = () => {
  let { id } = useParams();
  const [post,setPost] = useState({});
  const [loaded,setLoaded] = useState(false)

  useEffect(() => {
    const fetchData   
  = async () => {
        try {
          const response = await axios.get(`https://nnn-backend-4w8i.onrender.com/api/post/getPost/${id}`);
          setPost(response.data);
          setLoaded(true)
        } catch (error) {
          console.error('Error fetching posts:', error);
          // Handle error, e.g., display an error message
        }
      };

    fetchData();
  }, []);

  return (
    <>
    <div>ThreadPage</div>
    <div className="">Id: {id}</div>
    {loaded && <Thread data={post}/>}
    </>
  )
}

export default ThreadPage