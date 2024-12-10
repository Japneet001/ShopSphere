import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const [loading, setLoading] = useState(true); // Add a loading state

    const verifyPayment = async () => {
        if (!token || !success || !orderId) {
            toast.error("Invalid verification parameters.");
            navigate('/cart'); // Redirect to cart if parameters are missing
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/order/verifyStripe`,
                { success, orderId },
                { headers: { token } }
            );

            if (response.data.success) {
                setCartItems({});
                toast.success("Payment verified successfully!");
                navigate('/orders'); // Redirect to orders page
            } else {
                toast.error("Payment verification failed. Returning to cart.");
                navigate('/cart'); // Redirect to cart on failure
            }
        } catch (error) {
            console.error("Error during payment verification:", error);
            toast.error("An error occurred during verification. Please try again.");
            navigate('/cart'); // Redirect to cart on error
        } finally {
            setLoading(false); // Stop the loading state
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [token, success, orderId]); // Add dependencies to re-run when params change

    return (
        <div className="flex justify-center items-center min-h-screen">
            {loading ? (
                <div className="text-center">
                    <p className="text-lg">Verifying your payment...</p>
                    <div className="loader mt-4"></div>
                </div>
            ) : (
                <p className="text-center text-lg">Redirecting...</p>
            )}
        </div>
    );
};

export default Verify;
