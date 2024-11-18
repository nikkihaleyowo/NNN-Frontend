import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import PaymentContainer from './PaymentContainer';

import {colorArr,priceArr} from '../utils'

const CreateNewPost = () => {
  const navigate = useNavigate();

  //const [image,setImage] = useState({file: ""});
  const [image,setImage] = useState(null);
  //const [imgUrl,setImgUrl] = useState(null);
  //const [loadedImage, setLoadedImage] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [large,setLarge] = useState(false)

  const [needsToPay,setNeedsToPay] = useState(false)

  const [error,setError] = useState("")

  const [superSelected,setSuperSelected] = useState(-1)
  const maxSuperState = colorArr.length;
  //const colorArr = ["from-cyan-400 to-blue-200", "from-stone-400 to-green-200", "from-orange-400 to-red-200", "from-red-400 to-slare-200", "from-yellow-400 to-slare-200"]
  //const priceArr = [.99, 1.99, 2.99, 4.99, 9.99];

  async function createPost(imgUrl){
    console.log("tt: "+ imgUrl)
    const loadedImage = image ? true : false;
    const data = {
      hasImage: loadedImage,
      image: imgUrl,
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

  const uploadFile = async() =>{
    const data = new FormData();
    data.append("file", image)
    data.append("upload_preset",'images_preset')

    try {
      let cloudName = "dcpgloqew";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

      const res = await axios.post(api,data);
      const {secure_url} = res.data;
      console.log(secure_url)
      return secure_url
    } catch (error) {
      console.error(error)
    }
    

  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    let imgUrl = null;

    if(superSelected===-1){
      if(image){
        console.log("owo")
        imgUrl = await uploadFile()
        //await setImgUrl(tempUrl)
        //await setLoadedImage(true);
      }
      
      createPost(imgUrl)
      
    }else{
      setNeedsToPay(true)
      console.log("addd")
    }
    console.log("posted")
  }

  const handleFileUpload = async(e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file)
    setImage({...image, file: base64})
    setLoadedImage(true)
  }

  const handleSuperSelect = (index) =>{
    if(superSelected===index){
      setSuperSelected(-1)
    }else{
      setSuperSelected(index)
    }
  }

  return (
    <div className={(superSelected===-1) ? "border-2 w-[50%] mt-6 m-auto" : ("border-2 w-[50%] mt-6 m-auto bg-gradient-to-r "+colorArr[superSelected])}>
      <h1 className=" text-center text-2xl">Create New Post</h1>
      <div className="flow-root">
        {/*<div className="">
          {loadedImage && <img className={'bg-neutral-200 m-auto mt-4'+(large ? " size-[100%]": " size-[50%]")} src={image.file} alt='' onClick={()=>{setLarge(!large)}}/>}
        </div>*/}
        <form className="" onSubmit={handleSubmit}>
            <input 
            type="File" 
            lable="Image"
            accept='image/*'
            id='img'
            onChange={(e) => setImage((prev) => e.target.files[0])}
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
      <div className="flex mt-2 gap-1 ml-[20%] mb-2">
        {colorArr.map((c,index) => (
          <button className={"border-2 border-black border-opacity-30 bg-gradient-to-r rounded-full px-3 font-semibold "+c + ((index===superSelected) ? " brightness-150" : " ") }
          onClick={()=>{handleSuperSelect(index)}} >{priceArr[index]}</button>
        ))}
        
      </div>
      {needsToPay && <PaymentContainer cost={priceArr[superSelected]} title={title} text={text} image={image} tier={superSelected}/>}
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