import axios from 'axios';
import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import {colorArr,priceArr} from '../utils'

const Reply = (props) =>{
  const [large,setLarge] = useState(false)

  const [ref, inView] = useInView();

  function formatText(text) {
    console.log(text);
    const regex = /@\{(.*?)\}/g;
    const newText = text?.replace(regex, (match, p1) => {
      return `<span class="text-yellow-500">${p1.slice(-10)}>></span>`;
    });
    return newText;
  }

  return(
    
    <div className="border-2 w-[97%] ml-4 mb-2">
      <motion.div
          ref={ref}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="your-element-class"
        >
          <div className="flex justify-between">
            <h1 onClick={()=>{}} className="border-2 rounded-full pl-2 w-fit right-0 mr-5 px-2">{props.r.userId}</h1>
            {props.r._id && <h1 className="px-2 underline text-sm" onClick={()=>{navigator.clipboard.writeText(`@{${props.r._id}}`);}}>{props.r._id.slice(-10)}</h1>}
          </div>
          <div className="flow-root">
            {props.r.hasImage && <img className={ !large ? 'bg-neutral-200 mt-4 size-[30%] float-left mr-2 ml-1' : 'bg-neutral-200 mt-4 size-[80%] m-auto '} onClick={()=>{setLarge(!large)}} src={props.r.image} alt=''/>}
        
            <p dangerouslySetInnerHTML={{ __html: formatText(props.r.text) }} />
            {/*<p className="p-2">{formatText(props.r.text)}</p>*/}
          </div>
          <div className="px-2 pb-2 text-xs underline flex flex-wrap w-[100%]" >
            {props.r.replies && props.r.replies.map(reply=>(
              <h1 className="pr-2">{reply.replyId.slice(-10)}</h1>
            ))}
          </div>
      </motion.div>
    </div>
    
  );
}


const Thread = (props) => {
  const [large,setLarge] = useState(false)

  const [reply,setReply] = useState('')

  const [showReply,setShowReply] = useState(false)

  const [image,setImage] = useState({file: ""});
  const [loadedImage, setLoadedImage] = useState(false);

  const [data,setData] = useState(props.data);

  const [ref, inView] = useInView();

  useEffect(()=>{
    setData(props.data)
  },[props.data])

  const navigate = useNavigate();

  const [error,setError] = useState("")

  async function postReply(){
    const ndata = {
      hasImage: loadedImage,
      image: image.file,
      text: reply,
      id: props.data._id,
    }
    console.log(ndata)
    if(image.file!==""||reply!==""){
      try{
        const rep = await axios.post('/api/post/reply', ndata)
        console.log(rep)
        const tReplies = [...data.replies];
        tReplies.push(ndata)
        setData({...data, replies: tReplies});
        setShowReply(false);
        setReply("");
        setImage({file: ""});
        setLoadedImage(false);
        setError("")

      }catch(err){
        console.log(err.message)
        setError("Image To Large");
      }
    }else{
      setError("nothing to reply");
    }
    
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    postReply()

    

    console.log("posted")
  }

  const handleFileUpload = async(e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file)
    setImage({...image, file: base64})
    setLoadedImage(true)
  }

  return (
    <motion.div
          ref={ref}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="your-element-class"
        >
    <div className={"w-[60%] border-2 border-t-8 mx-auto mb-6 rounded-b-2xl border-r-4 bg-gradient-to-r " + (data.tier===-1 ? "" : colorArr[data.tier])}>
      {console.log("tier: ", data.tier)}
      <div className="flex justify-between">
        <div className="">
          {console.log(props.data)}
          <h1 className="px-2 underline">{props.data._id.slice(-10)}</h1>
          <h1 onClick={()=>{navigate(`/thread/${data._id}`);}} className="text-2xl pl-2 w-fit" >{data.title}</h1>
        </div>
        <h1 onClick={()=>{}} className="border-2 rounded-full text-lg pl-2 w-fit right-0 mr-5 px-2 h-fit">{data.userId}</h1>
      </div>
      <div className="flow-root">
        {data.hasImage && <img className={ !large ? 'bg-neutral-200 mt-4 size-[50%] float-left mr-2 ml-1' : 'bg-neutral-200 mt-4 size-[99%] m-auto '} onClick={()=>{setLarge(!large)}} src={data.image} alt=''/>}
        <p className="p-2">{data.text}</p>
      </div>
      <div className="border-b-4 border-dashed mb-2"></div>
      {data.replies.map(r=>(
        <Reply r={r} />
      ))}
      {
      showReply ?
      <form className="" onSubmit={handleSubmit}>
            {loadedImage && <img className='bg-neutral-200 m-auto mt-4' src={image.file} alt=''/>}
            <input 
            type="File" 
            lable="Image"
            name='myFile'
            accept='.jpeg, .png, jpg'
            onChange={(e) => handleFileUpload(e)}
            />
            <br/>
            <div className="right-0">
              
              <div className="">
                <textarea id="text-input" className="border-2 w-[98%] h-28" value={reply} onChange={(e)=>{
                  setReply(e.target.value)
                }}></textarea>
              </div>
            </div>
            <button type='submit' className="border-1 border-neutral-400 px-4 rounded-lg bg-neutral-300 text-neutral-950 hover:bg-slate-300 mt-2 ml-2 mb-4">Submit</button>
            {error!=="" && <div className='text-red-800 text-center'>!{error}</div>}
          </form> : <button onClick={()=>{setShowReply(!showReply)}} className='border-2 px-2 rounded-3xl ml-4 mb-2'>Add Reply</button>}
          
    </div>
    </motion.div>
  )
}

function convertToBase64(file){
  return new Promise((resolve, reject)=>{
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () =>{
      resolve(fileReader.result)
    };
    fileReader.onerror = (error) => {
      reject(error);
    }
  })
}

export default Thread