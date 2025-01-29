import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const PaymentStatus = () => {
    const [status, setStatus] = useState("Verifying payment...");
    const searchParams = new URLSearchParams(window.location.search);
    const reference = searchParams.get("reference");
  
    useEffect(() => {
        const verifyPayment = async () => {
            if (!reference) {
                setStatus("Invalid payment reference.");
                return;
            }
        
            try {
                const token = localStorage.getItem("token"); // Assuming you store the auth token in localStorage
                const { data } = await axios.get(
                    `http://localhost:3300/api/paystack/verify/${reference}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                        },
                    }
                );
                setStatus(data.success ? "Payment verified successfully!" : "Payment verification failed.");
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
  
    return <div>{status}</div>;
  };
  

export default PaymentStatus;
