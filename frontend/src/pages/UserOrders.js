import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import displayBDTCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state?.user?.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(SummaryApi.current_user.url, {
                    method: SummaryApi.current_user.method,
                    credentials: 'include'
                });
                const responseData = await response.json();

                if (responseData.success) {
                    dispatch(setUserDetails(responseData.data));
                } else {
                    toast.error(responseData.message || "Failed to fetch user details.");
                    dispatch(setUserDetails(null));
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                toast.error("An error occurred while fetching user details.");
                dispatch(setUserDetails(null));
            }
        };

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await fetch(SummaryApi.getUserOrders.url, {
                    method: SummaryApi.getUserOrders.method,
                    credentials: 'include'
                });
                const responseData = await response.json();

                if (responseData.success) {
                    setOrders(responseData.data);
                } else {
                    toast.error(responseData.message || "Failed to fetch orders.");
                }
            } catch (error) {
                console.error("Error fetching user orders:", error);
                toast.error("An error occurred while fetching orders.");
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchOrders();
        } else {
            fetchUserDetails().then(() => {
                if (user?._id) {
                    fetchOrders();
                } else {
                    setLoading(false);
                }
            });
        }
    }, [user, dispatch]);

    if (loading) {
        return (
            <div className='container mx-auto p-4 text-center text-lg text-blue-600'>
                Loading your orders...
            </div>
        );
    }

    if (!user) {
        return (
            <div className='container mx-auto p-4 text-center text-lg text-slate-500'>
                Please log in to view your orders.
                <div className='mt-4'>
                    <Link to="/login" className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'>
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-3xl font-bold mb-6 text-center'>Your Orders</h1>

            {orders.length === 0 ? (
                <div className='text-center text-lg text-slate-500 bg-white p-5 rounded-lg shadow-md'>
                    <p>You haven't placed any orders yet.</p>
                    <Link to='/' className='mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-1 gap-6'>
                    {orders.map((order) => (
                        <div key={order._id} className='bg-white p-6 rounded-lg shadow-md border border-slate-200'>
                            <div className='flex justify-between items-center mb-4 border-b pb-3'>
                                <h2 className='text-xl font-semibold'>Order ID: {order._id}</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.orderStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                                    order.orderStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
                                </span>
                            </div>

                            <div className='mb-4'>
                                <p className='text-slate-700'><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className='text-slate-700'><strong>Total Amount:</strong> {displayBDTCurrency(order.totalAmount)}</p>
                                <p className='text-slate-700'><strong>Payment Method:</strong> {order.paymentDetails?.method || order.paymentMethod}</p>
                                <p className='text-slate-700'><strong>Payment Status:</strong> <span className={`font-semibold ${order.paymentDetails?.paymentStatus === 'paid' ? 'text-green-600' : order.paymentDetails?.paymentStatus === 'pending' ? 'text-orange-600' : 'text-red-600'}`}>{order.paymentDetails?.paymentStatus || 'N/A'}</span></p>
                                {order.paymentDetails?.transactionId && (
                                    <p className='text-slate-700'><strong>Transaction ID:</strong> {order.paymentDetails.transactionId}</p>
                                )}
                            </div>

                            <div className='mb-4'>
                                <h3 className='text-lg font-medium mb-2'>Products:</h3>
                                {order.products.map((item, idx) => (
                                    <div key={idx} className='flex items-center gap-3 py-2 border-t border-slate-100 first:border-t-0'>
                                        <div className='w-12 h-12 bg-slate-100 rounded overflow-hidden'>
                                            <img src={item.productId?.productImage[0]} alt={item.productId?.productName} className='w-full h-full object-cover' />
                                        </div>
                                        <div>
                                            <p className='font-medium line-clamp-1'>{item.productId?.productName}</p>
                                            <p className='text-sm text-slate-500'>Qty: {item.quantity} | Price: {displayBDTCurrency(item.sellingPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 className='text-lg font-medium mb-2'>Shipping Address:</h3>
                                <p className='text-slate-700'>{order.shippingAddress?.fullName}</p>
                                <p className='text-slate-700'>{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state}, {order.shippingAddress?.zipCode}</p>
                                <p className='text-slate-700'>{order.shippingAddress?.country}</p>
                                <p className='text-slate-700'>Phone: {order.shippingAddress?.phoneNumber}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserOrders;