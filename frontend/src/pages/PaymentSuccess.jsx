import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

export default function PaymentSuccess(){

  const [params] = useSearchParams();

  useEffect(() => {

    const sessionId = params.get("session_id");

    api.post("payment/success", {sessionId});

    console.log("Payment success");
    

  },[])

  return <h1>Payment Successful</h1>
}