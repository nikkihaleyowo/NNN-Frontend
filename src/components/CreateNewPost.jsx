import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const CreateNewPost = () => {
  const navigate = useNavigate();

  const [image,setImage] = useState({file: ""});
  const [loadedImage, setLoadedImage] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [error,setError] = useState("")

  async function createPost(){
    const data = {
      hasImage: loadedImage,
      image: image.file,
      title: title,
      text: text,
    }
    console.log(data)
      try{
        const td = await axios.post('/api/post/createPost', data)
        console.log(td.data._id)
        navigate(`/thread/${td.data._id}`)
        
      }catch(err){
        console.log(err.message)
        switch(err.status){
          case 413:
            setError("Image To Large");
            break;
          case 401:
            setError("Needs Title");
            break;
        }
        
      }
    
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    createPost()
    console.log("posted")
  }

  const handleFileUpload = async(e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file)
    setImage({...image, file: base64})
    setLoadedImage(true)
  }

  return (
    <div className="border-2 w-[50%] mt-6 m-auto">
      <h1 className=" text-center text-2xl">Create New Post</h1>
      <div className="flow-root">
        <div className="">
          {loadedImage && <img className='bg-neutral-200 m-auto mt-4' src={image.file} alt=''/>}
        </div>
        <form className="" onSubmit={handleSubmit}>
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
                <label className='text-center pl-10'>Title:</label>
                <textarea id="text-input" className="border-2 w-[80%] h-8 float-right" value={title} onChange={(e)=>{
                  setTitle(e.target.value)
                }}></textarea>
              </div>
              <div className="">
                <textarea id="text-input" className="border-2 w-[80%] h-48 float-right" value={text} onChange={(e)=>{
                  setText(e.target.value)
                }}></textarea>
              </div>
            </div>
            <button type='submit' className="border-1 border-neutral-400 px-4 rounded-lg bg-neutral-300 text-neutral-950 hover:bg-slate-300 mt-2 ml-2 mb-4">Submit</button>
            {error!=="" && <div className='text-red-800 text-center'>!{error}</div>}
          </form>
      </div>
    </div>
  )
}

export default CreateNewPost

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