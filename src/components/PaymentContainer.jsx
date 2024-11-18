import React, { useEffect, useState } from 'react'

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios';
import CheckoutForm from './CheckoutForm';

const PaymentContainer = (props) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [postId,setPostId] = useState(null);

  useEffect(()=>{
    axios.get("https://nnn-backend-4w8i.onrender.com/api/payment/config").then(async(res) =>{

      const {publishableKey} = res.data;
      console.log(publishableKey)
      setStripePromise(loadStripe(publishableKey))
    })
  },[])

  const uploadFile = async() =>{
    const data = new FormData();
    data.append("file", props.image)
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

  useEffect(()=>{

    const doThing = async() =>
    {let imgUrl = null;
    if(props.image)
      imgUrl = await uploadFile();

    axios.post("https://nnn-backend-4w8i.onrender.com/api/payment/create-payment-intent", {cost: props.cost, title: props.title, text: props.text, tier: props.tier, hasImage: (imgUrl ? true: false), imgUrl: imgUrl}).then(async(result) => {
      var {clientSecret} = result.data;

      console.log("sec: "+clientSecret)
      console.log("id: "+result.data.id)
      setPostId(result.data.id)
      setClientSecret(clientSecret);
    })}
    doThing();
  },[])

  return (
    <div className='border-2'>paymentContainer
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm id={postId} />
        </Elements>
      )}
    </div>
    
  )
}

export default PaymentContainer