import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const PaymentCancel = () => {
    const { orderId } = useParams();
    const [message, setMessage] = useState('Payment was cancelled by the user.');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const updateOrderStatusOnCancel = async () => {
            try {
                const response = await fetch(`${SummaryApi.validatePayment.url.replace(':orderId', orderId)}`, {
                    method: SummaryApi.validatePayment.method,
                    credentials: 'include'
                });
                const responseData = await response.json();

                if (responseData.success && responseData.data.orderStatus !== 'completed') {
                    setMessage(`Payment cancelled for Order ID: ${orderId}.`);
                    toast.info(`Payment cancelled for order ${orderId}.`);
                } else if (responseData.success && responseData.data.orderStatus === 'completed') {
                    setMessage(`Payment was successful for Order ID: ${orderId} despite being redirected to cancel page. Please check your orders.`);
                    toast.info(`Payment was successful for order ${orderId}.`);
                } else {
                    setMessage(`Payment cancelled for Order ID: ${orderId}. ${responseData.message || ''}`);
                    toast.info(`Payment cancelled for order ${orderId}.`);
                }
            } catch (error) {
                console.error("Error fetching order status on cancel page:", error);
                setMessage('An error occurred. Payment might have been cancelled.');
                toast.error('An error occurred during payment cancellation processing.');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            updateOrderStatusOnCancel();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    return (
        <div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]'>
            <div className='bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full'>
                {loading ? (
                    <div className='text-xl font-semibold text-blue-600'>
                        <p>Processing payment status...</p>
                        <p className='mt-2 animate-pulse'>Please wait...</p>
                    </div>
                ) : (
                    <div className='text-orange-600'>
                        <svg className="mx-auto h-16 w-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h2 className='text-3xl font-bold mt-4'>Payment Cancelled!</h2>
                        <p className='text-lg mt-2'>{message}</p>
                        <Link to='/cart' className='mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'>
                            Back to Cart
                        </Link>
                        <Link to='/checkout' className='mt-4 inline-block text-blue-600 hover:underline'>
                            Try Payment Again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentCancel;