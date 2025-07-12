import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
    return (
        <div className='container mx-auto p-4 text-center min-h-[calc(100vh-120px)] flex flex-col justify-center items-center'>
            <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
                <h1 className='text-4xl font-bold text-green-600 mb-4'>Order Placed Successfully!</h1>
                <p className='text-lg text-gray-700 mb-6'>Thank you for your purchase.</p>
                <div className='flex flex-col gap-4'>
                    <Link to='/orders' className='bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors text-lg'>
                        View Your Orders
                    </Link>
                    <Link to='/' className='border border-blue-600 text-blue-600 py-3 px-6 rounded-md hover:bg-blue-100 transition-colors text-lg'>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;