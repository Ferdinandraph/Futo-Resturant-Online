import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageModal from "../components/MessageModal";
import { useNavigate } from "react-router-dom";

const PaymentStatus = () => {
    const [status, setStatus] = useState("Verifying payment...");
    const searchParams = new URLSearchParams(window.location.search);
    const reference = searchParams.get("reference");
    const [message, setMessage] = useState("")
    const navigate = useNavigate()
  
    useEffect(() => {
        const verifyPayment = async () => {
            if (!reference) {
                setStatus("Invalid payment reference.");
                return;
            }
        
            try {
                const token = localStorage.getItem("token"); // Assuming you store the auth token in localStorage
                const { data } = await axios.get(
                    `http://0.0.0.0:1000/api/paystack/verify/${reference}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                        },
                    }
                );
                console.log(data.data.status)

                if (data.data.status=="success") {
                    setMessage("Order has been successfully confirmed")
                }
                else {
                    setMessage("Order confirmation unsuccessful please try again")
                }

                setTimeout(() => {
                    navigate('/');
                }, 4000);

            } catch (error) {
                console.error("Error verifying payment:", error);
                if (error.response?.status === 401) {
                    setStatus("Unauthorized: Please log in to verify your payment.");
                } else {
                    setStatus("An error occurred during payment verification.");
                }
            }
        };
        
      verifyPayment();
    }, [reference]);
  
    return (<div>
        {/**message modal */}
      {message && (
            <MessageModal message={message} onClose={() => setMessage("")} />
          )}
    </div>
    );
  };
  

export default PaymentStatus;
