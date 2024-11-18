import { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";

import { useNavigate } from 'react-router-dom';

export default function CheckoutForm(props) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!stripe || !elements)
      return;


    setIsProcessing(true)

    const {error, paymentIntent} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`
      },
      redirect: 'if_required'
    })

    if(error){
      setMessage(error.message)
    } else if(paymentIntent && paymentIntent.status === 'succeeded'){
      setMessage("payment satus:" + paymentIntent.status + "!!")
      navigate(`/thread/${props.id}`)
    } else {
      setMessage("unexpected state")
    }

    setIsProcessing(false)
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={isProcessing} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>

      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
