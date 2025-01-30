import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Verify = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetch(`http://localhost:10000/auth/verify/${token}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    setStatus('Verification successful! Redirecting to login...');
                    setTimeout(() => navigate('/login?verification=success'), 3000);
                } else {
                    setStatus('Invalid or expired verification link.');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('An error occurred during verification. Please try again.');
            }
        };

        verifyUser();
    }, [token, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-center bg-white p-6 rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
                <p>{status}</p>
            </div>
        </div>
    );
};

export default Verify;
