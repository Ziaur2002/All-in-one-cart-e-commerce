import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import displayBDTCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'; // <--- ADDED THIS IMPORT

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getUserOrders.url, {
                method: SummaryApi.getUserOrders.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                }
            });

            const responseData = await response.json();

            if (responseData.success) {
                setOrders(responseData.data);
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("Error fetching orders.");
            console.error("Error fetching user orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserOrders();
    }, []);

    if (loading) {
        return (
            <div className='container mx-auto p-4 min-h-[calc(100vh-120px)]'>
                <h1 className='text-3xl font-bold mb-6 text-center'>Your Orders</h1>
                <div className='text-center text-xl text-slate-500'>Loading orders...</div>
                {/* Add a skeleton loader for better UX */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
                    {Array(3).fill(null).map((_, index) => (
                        <div key={index} className='bg-white p-6 rounded-lg shadow-md animate-pulse'>
                            <div className='h-6 bg-slate-200 rounded w-3/4 mb-4'></div>
                            <div className='h-4 bg-slate-200 rounded w-1/2 mb-2'></div>
                            <div className='h-4 bg-slate-200 rounded w-full mb-2'></div>
                            <div className='h-4 bg-slate-200 rounded w-2/3 mb-4'></div>
                            <div className='h-20 bg-slate-100 rounded mb-4'></div>
                            <div className='h-4 bg-slate-200 rounded w-1/4'></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (orders.length === 0 && !loading) {
        return (
            <div className='container mx-auto p-4 min-h-[calc(100vh-120px)] text-center'>
                <h1 className='text-3xl font-bold mb-6'>Your Orders</h1>
                <p className='text-xl text-slate-500'>You haven't placed any orders yet.</p>
                <Link to='/' className='mt-6 inline-block bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors text-lg'>
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4 min-h-[calc(100vh-120px)]'>
            <h1 className='text-3xl font-bold mb-6 text-center'>Your Orders</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {orders.map((order) => (
                    <div key={order._id} className='bg-white p-6 rounded-lg shadow-md'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Order ID: <span className='text-slate-600 text-base font-normal'>{order._id}</span></h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {order.orderStatus}
                            </span>
                        </div>
                        <p className='text-slate-600 mb-2'>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className='text-slate-600 mb-4'>Total Amount: <span className='font-bold text-red-600'>{displayBDTCurrency(order.totalAmount)}</span></p>

                        <div className='mb-4'>
                            <h3 className='font-semibold text-lg mb-2'>Shipping Address:</h3>
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                            <p>{order.shippingAddress.state}, {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                            <p>Phone: {order.shippingAddress.phoneNumber}</p>
                        </div>

                        <div className='mb-4'>
                            <h3 className='font-semibold text-lg mb-2'>Payment Details:</h3>
                            <p>Method: {order.paymentDetails.method}</p>
                            <p>Status: {order.paymentDetails.paymentStatus}</p>
                            {order.paymentDetails.transactionId && <p>Transaction ID: {order.paymentDetails.transactionId}</p>}
                        </div>

                        <h3 className='font-semibold text-lg mb-2'>Products:</h3>
                        <div className='space-y-3'>
                            {order.products.map((item) => (
                                <div key={item._id} className='flex items-center gap-4 bg-slate-50 p-3 rounded'>
                                    <div className='w-16 h-16 bg-slate-100 p-1 rounded'>
                                        <img src={item.productId?.productImage?.[0]} className='w-full h-full object-scale-down mix-blend-multiply' alt={item.productId?.productName} />
                                    </div>
                                    <div>
                                        <p className='font-medium line-clamp-1'>{item.productId?.productName || 'Product not found'}</p>
                                        <p className='text-sm text-slate-500'>Qty: {item.quantity}</p>
                                        <p className='text-sm text-red-500'>{displayBDTCurrency(item.sellingPrice)} each</p>
                                        <p className='text-sm font-semibold text-red-600'>Subtotal: {displayBDTCurrency(item.quantity * item.sellingPrice)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrders;