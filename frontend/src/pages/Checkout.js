import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context'
import displayBDTCurrency from '../helpers/displayCurrency';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { user, fetchUserAddToCart, cartProduct } = useContext(Context);
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phoneNumber: user?.mobile || ''
    });

    const [customerEmail, setCustomerEmail] = useState(user?.email || '');

    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

    useEffect(() => {
        fetchUserAddToCart();
    }, []);

    useEffect(() => {
        if (user) {
            setShippingAddress(prev => ({
                ...prev,
                fullName: user.name || prev.fullName,
                phoneNumber: user.mobile || prev.phoneNumber
            }));
            setCustomerEmail(user.email || '');
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCustomerEmailChange = (e) => {
        setCustomerEmail(e.target.value);
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const totalQty = (cartProduct || []).reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
    const totalPrice = (cartProduct || []).reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if ((cartProduct || []).length === 0) {
            toast.error("Your cart is empty. Add products to place an order.");
            return;
        }

        const requiredFields = ['fullName', 'address', 'city', 'state', 'zipCode', 'country', 'phoneNumber'];
        for (const field of requiredFields) {
            if (!shippingAddress[field]) {
                toast.error(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return;
            }
        }

        try {
            const customerDetails = {
                name: shippingAddress.fullName,
                email: customerEmail,
                phone: shippingAddress.phoneNumber
            };

            if (paymentMethod === 'online_payment' && (!customerDetails.email || customerDetails.email.trim() === '')) {
                toast.error("Please provide your email address for online payment.");
                return;
            }

            const response = await fetch(SummaryApi.placeOrder.url, {
                method: SummaryApi.placeOrder.method,
                headers: {
                    "content-type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    shippingAddress,
                    paymentMethod,
                    customerDetails
                })
            });

            const responseData = await response.json();

            if (responseData.success) {
                toast.success(responseData.message);
                fetchUserAddToCart();

                if (paymentMethod === 'online_payment' && responseData.paymentUrl) {
                    window.location.href = responseData.paymentUrl;
                } else if (paymentMethod === 'cash_on_delivery') {
                    navigate(`/order-success/${responseData.data._id}`);
                }
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("An error occurred while placing the order.");
            console.error("Error placing order:", error);
        }
    };

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-3xl font-bold mb-6 text-center'>Checkout</h1>

            <div className='flex flex-col lg:flex-row gap-8'>
                {/* Order Summary */}
                <div className='w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-semibold mb-4'>Order Summary</h2>
                    {(cartProduct || []).length === 0 ? (
                        <p className='text-center text-slate-500'>Your cart is empty.</p>
                    ) : (
                        <div>
                            {(cartProduct || []).map((product) => (
                                <div key={product?._id} className='flex items-center gap-4 py-3 border-b border-slate-200'>
                                    <div className='w-20 h-20 bg-slate-100 p-1 rounded'>
                                        <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' alt={product?.productId?.productName} />
                                    </div>
                                    <div className='flex-grow'>
                                        <h3 className='text-lg font-medium line-clamp-1'>{product?.productId?.productName}</h3>
                                        <p className='text-slate-500'>Qty: {product?.quantity}</p>
                                        <p className='text-red-600 font-semibold'>{displayBDTCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                            <div className='flex justify-between items-center mt-4 pt-4 border-t-2 border-slate-300'>
                                <p className='text-xl font-bold'>Total Quantity:</p>
                                <p className='text-xl font-bold'>{totalQty}</p>
                            </div>
                            <div className='flex justify-between items-center mt-2'>
                                <p className='text-xl font-bold'>Total Price:</p>
                                <p className='text-xl font-bold text-red-600'>{displayBDTCurrency(totalPrice)}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Shipping and Payment Form */}
                <div className='w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-semibold mb-4'>Shipping Details</h2>
                    <form onSubmit={handlePlaceOrder}>
                        <div className='grid grid-cols-1 gap-4'>
                            <div>
                                <label htmlFor='fullName' className='block text-sm font-medium text-gray-700'>Full Name</label>
                                <input type='text' id='fullName' name='fullName' value={shippingAddress.fullName} onChange={handleChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500' required />
                            </div>
                            <div>
                                <label htmlFor='address' className='block text-sm font-medium text-gray-700'>Address</label>
                                <input type='text' id='address' name='address' value={shippingAddress.address} onChange={handleChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500' required />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label htmlFor='city' className='block text-sm font-medium text-gray-700'>City</label>
                                    <input type='text' id='city' name='city' value={shippingAddress.city} onChange={handleChange}
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500' required />
                                </div>
                                <div>
                                    <label htmlFor='state' className='block text-sm font-medium text-gray-700'>State/Province</label>
                                    <input type='text' id='state' name='state' value={shippingAddress.state} onChange={handleChange}
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500' required />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label htmlFor='zipCode' className='block text-sm font-medium text-gray-700'>Zip Code</label>
                                    <input type='text' id='zipCode' name='zipCode' value={shippingAddress.zipCode} onChange={handleChange}
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500' required />
                                </div>
                                <div>
                                    <label htmlFor='country' className='block text-sm font-medium text-gray-700'>Country</label>
                                    <input type='text' id='country' name='country' value={shippingAddress.country} onChange={handleChange}
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500' required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700'>Phone Number</label>
                                <input type='text' id='phoneNumber' name='phoneNumber' value={shippingAddress.phoneNumber} onChange={handleChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500' required />
                            </div>
                            {/* New Email Input Field */}
                            <div>
                                <label htmlFor='customerEmail' className='block text-sm font-medium text-gray-700'>Email Address</label>
                                <input type='email' id='customerEmail' name='customerEmail' value={customerEmail} onChange={handleCustomerEmailChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500' required={paymentMethod === 'online_payment'} />
                            </div>
                        </div>

                        <h2 className='text-2xl font-semibold mt-8 mb-4'>Payment Method</h2>
                        <div className='space-y-4'>
                            <div className='flex items-center'>
                                <input type='radio' id='cod' name='paymentMethod' value='cash_on_delivery' checked={paymentMethod === 'cash_on_delivery'} onChange={handlePaymentMethodChange}
                                    className='focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300' />
                                <label htmlFor='cod' className='ml-3 block text-base font-medium text-gray-700'>Cash on Delivery (COD)</label>
                            </div>
                            <div className='flex items-center'>
                                <input type='radio' id='online_payment' name='paymentMethod' value='online_payment' checked={paymentMethod === 'online_payment'} onChange={handlePaymentMethodChange}
                                    className='focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300' />
                                <label htmlFor='online_payment' className='ml-3 block text-base font-medium text-gray-700'>Online Payment (SSLCommerz)</label>
                            </div>
                        </div>

                        <button type='submit' className='bg-red-600 text-white w-full py-3 mt-6 rounded-md font-semibold text-lg hover:bg-red-700 transition-colors'>
                            {paymentMethod === 'online_payment' ? 'Proceed to Online Payment' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;