import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateNewPost from '../components/CreateNewPost';
import Thread from '../components/Thread';

import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

import { useLocation } from 'react-router-dom';

import { motion } from 'framer-motion';

const HomePage = () => {
  

  let { page } = useParams();

  const location = useLocation();
  
  //console.log("page: "+ page)

  if(!page){
    page=0;
  }

  const [p,setP] = useState(page);

  const [posts, setPosts] = useState([]);
  const [createPost,setCreatePost] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Optional for smooth scrolling
    });
  }, [location]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/post/getPosts/${p}`);
        console.log("new data")
        console.log(response.data)
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Handle error, e.g., display an error message
      }
    };
    console.log("fetch")
    fetchData();
  }, [p]);

  useEffect(()=>{
    console.log('post data changed')
    console.log(posts)
  },[posts])

  function goto(num){
    setP(num)
    navigate(`/${num}`)
    //fetchData();
  }

  return (
    <>
    <div className="w-fit m-auto mt-10">
      <button onClick={()=>{setCreatePost(!createPost)}} className="border-2 border-neutral-950 px-2">Create Post</button>
    </div>
    {createPost && (
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100, transition: { duration: 0.3 } }}
        transition={{ duration: 0.5 }}
        className="your-element-class"
      >
        <CreateNewPost />
      </motion.div>
    )}
        <div className='mt-6'>
      {posts.map(p=>(
        
          <Thread data={p} />
        
      ))}
    </div>
    <div className="m-auto w-fit">
      {console.log('pp: '+p)}
      <button className={p===0 ? 'underline px-1' : 'px-1'} onClick={()=>{goto(0)}}>0</button>
      <button className={p===1 ? 'underline px-1' : 'px-1'} onClick={()=>{goto(1)}}>1</button>
      <button className={p===2 ? 'underline px-1' : 'px-1'} onClick={()=>{goto(2)}}>2</button>
      <button className={p===3 ? 'underline px-1' : 'px-1'} onClick={()=>{goto(3)}}>3</button>
    </div>
    </>
  );
};
export default HomePage;