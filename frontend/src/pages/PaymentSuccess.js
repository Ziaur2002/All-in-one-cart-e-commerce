import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryApi from '../common';
import Context from '../context';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
    const { orderId } = useParams();
    const [paymentStatus, setPaymentStatus] = useState('Verifying payment...');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { fetchUserAddToCart } = useContext(Context);

    useEffect(() => {
        const validatePayment = async () => {
            try {
                const response = await fetch(`${SummaryApi.validatePayment.url.replace(':orderId', orderId)}`, {
                    method: SummaryApi.validatePayment.method,
                    credentials: 'include'
                });
                const responseData = await response.json();

                if (responseData.success) {
                    setPaymentStatus('Payment successful!');
                    setOrderData(responseData.data);
                    fetchUserAddToCart();
                    toast.success("Payment successful and order confirmed!");
                } else {
                    setPaymentStatus(`Payment verification failed: ${responseData.message}`);
                    toast.error(`Payment failed: ${responseData.message}`);
                }
            } catch (error) {
                console.error("Error validating payment:", error);
                setPaymentStatus('An error occurred during payment verification.');
                toast.error("An error occurred during payment verification.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            validatePayment();
        } else {
            setPaymentStatus('No order ID found for payment verification.');
            setLoading(false);
        }
    }, [orderId, fetchUserAddToCart]);

    return (
        <div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]'>
            <div className='bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full'>
                {loading ? (
                    <div className='text-xl font-semibold text-blue-600'>
                        <p>Processing your payment...</p>
                        <p className='mt-2 animate-pulse'>{paymentStatus}</p>
                    </div>
                ) : (
                    <>
                        {paymentStatus.includes('successful') ? (
                            <div className='text-green-600'>
                                <svg className="mx-auto h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <h2 className='text-3xl font-bold mt-4'>Payment Successful!</h2>
                                <p className='text-lg mt-2'>{paymentStatus}</p>
                                {orderData && (
                                    <p className='text-md text-slate-700 mt-1'>Order ID: {orderData._id}</p>
                                )}
                                <Link to={`/order-success/${orderId}`} className='mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'>
                                    View Order Details
                                </Link>
                            </div>
                        ) : (
                            <div className='text-red-600'>
                                <svg className="mx-auto h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <h2 className='text-3xl font-bold mt-4'>Payment Failed!</h2>
                                <p className='text-lg mt-2'>{paymentStatus}</p>
                                <Link to='/cart' className='mt-6 inline-block bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors'>
                                    Back to Cart
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;