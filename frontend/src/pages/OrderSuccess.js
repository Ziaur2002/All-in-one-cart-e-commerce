import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryApi from '../common';
import displayBDTCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';

const OrderSuccess = () => {
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setError("No order ID provided.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${SummaryApi.getUserOrders.url}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const responseData = await response.json();

                if (responseData.success) {
                    const foundOrder = responseData.data.find(order => order._id === orderId);
                    if (foundOrder) {
                        setOrderData(foundOrder);
                    } else {
                        setError("Order not found.");
                    }
                } else {
                    setError(responseData.message || "Failed to fetch order details.");
                }
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("An error occurred while fetching order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]'>
                <div className='bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full'>
                    <h2 className='text-2xl font-bold text-blue-600'>Loading Order Details...</h2>
                    <p className='mt-2 text-slate-500'>Please wait while we retrieve your order information.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]'>
                <div className='bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full'>
                    <h2 className='text-2xl font-bold text-red-600'>Error</h2>
                    <p className='mt-2 text-slate-700'>{error}</p>
                    <Link to='/' className='mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'>
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]'>
                <div className='bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full'>
                    <h2 className='text-2xl font-bold text-orange-600'>Order Not Found</h2>
                    <p className='mt-2 text-slate-700'>The order you are looking for could not be found.</p>
                    <Link to='/' className='mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'>
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto'>
                <div className='text-center mb-6'>
                    <svg className="mx-auto h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h1 className='text-3xl font-bold text-green-600 mt-4'>Order Placed Successfully!</h1>
                    <p className='text-lg text-slate-700 mt-2'>Thank you for your purchase.</p>
                </div>

                <div className='border-t border-b border-slate-200 py-4 mb-6'>
                    <h2 className='text-2xl font-semibold mb-3'>Order Details</h2>
                    <p className='text-slate-600 mb-1'><strong>Order ID:</strong> {orderData._id}</p>
                    <p className='text-slate-600 mb-1'><strong>Order Date:</strong> {new Date(orderData.createdAt).toLocaleDateString()}</p>
                    <p className='text-slate-600 mb-1'><strong>Total Amount:</strong> {displayBDTCurrency(orderData.totalAmount)}</p>
                    <p className='text-slate-600 mb-1'><strong>Payment Method:</strong> {orderData.paymentDetails?.method || orderData.paymentMethod}</p>
                    <p className='text-slate-600 mb-1'><strong>Payment Status:</strong> <span className={`font-semibold ${orderData.paymentDetails?.paymentStatus === 'paid' ? 'text-green-600' : orderData.paymentDetails?.paymentStatus === 'pending' ? 'text-orange-600' : 'text-red-600'}`}>{orderData.paymentDetails?.paymentStatus || 'N/A'}</span></p>
                    <p className='text-slate-600 mb-1'><strong>Order Status:</strong> <span className={`font-semibold ${orderData.orderStatus === 'completed' ? 'text-green-600' : orderData.orderStatus === 'pending' ? 'text-orange-600' : 'text-red-600'}`}>{orderData.orderStatus}</span></p>
                    {orderData.paymentDetails?.transactionId && (
                        <p className='text-slate-600 mb-1'><strong>Transaction ID:</strong> {orderData.paymentDetails.transactionId}</p>
                    )}
                </div>

                <div className='mb-6'>
                    <h2 className='text-2xl font-semibold mb-3'>Products</h2>
                    {orderData.products.map((item, index) => (
                        <div key={index} className='flex items-center gap-4 py-2 border-b border-slate-100 last:border-b-0'>
                            <div className='w-16 h-16 bg-slate-100 p-1 rounded'>
                                <img src={item.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' alt={item.productId?.productName} />
                            </div>
                            <div className='flex-grow'>
                                <h3 className='text-lg font-medium line-clamp-1'>{item.productId?.productName}</h3>
                                <p className='text-slate-500'>Qty: {item.quantity}</p>
                                <p className='text-red-600 font-semibold'>{displayBDTCurrency(item.sellingPrice * item.quantity)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='mb-6'>
                    <h2 className='text-2xl font-semibold mb-3'>Shipping Address</h2>
                    <p className='text-slate-600'><strong>Name:</strong> {orderData.shippingAddress?.fullName}</p>
                    <p className='text-slate-600'><strong>Address:</strong> {orderData.shippingAddress?.address}, {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state}, {orderData.shippingAddress?.zipCode}</p>
                    <p className='text-slate-600'><strong>Country:</strong> {orderData.shippingAddress?.country}</p>
                    <p className='text-slate-600'><strong>Phone:</strong> {orderData.shippingAddress?.phoneNumber}</p>
                </div>

                <div className='text-center mt-8'>
                    <Link to='/orders' className='inline-block bg-green-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-green-700 transition-colors mr-4'>
                        View All Your Orders
                    </Link>
                    <Link to='/' className='inline-block bg-blue-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-blue-700 transition-colors'>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;