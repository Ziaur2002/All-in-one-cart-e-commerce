    import React, { useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { useSelector, useDispatch } from 'react-redux';
    import { toast } from 'react-toastify';
    import SummaryApi from '../common';
    import { setUserDetails } from '../store/userSlice';

    const UserProfile = () => {
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
            if (user?._id) {
                fetchUserDetails();
            } else {
                fetchUserDetails();
            }
        }, [user?._id, dispatch]);

        if (!user) {
            return (
                <div className='container mx-auto p-4 text-center text-lg text-slate-500'>
                    Please log in to view your profile.
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
                <h1 className='text-3xl font-bold mb-6 text-center'>My Profile</h1>

                <div className='bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto'>
                    <div className='flex flex-col items-center mb-6'>
                        <div className='w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-4xl text-slate-600 font-bold mb-4'>
                            {user.name ? user.name[0].toUpperCase() : '?'}
                        </div>
                        <h2 className='text-2xl font-semibold text-gray-800'>{user.name}</h2>
                        <p className='text-slate-600'>{user.email}</p>
                    </div>

                    <div className='border-t border-b border-slate-200 py-6 mb-6'>
                        <h3 className='text-xl font-semibold mb-3'>Personal Information</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700'>
                            <p><strong>Full Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone Number:</strong> {user.mobile}</p>
                            {user.role && <p><strong>Role:</strong> {user.role}</p>}
                        </div>
                    </div>

                    <div className='flex flex-col sm:flex-row justify-center gap-4'>
                        <Link
                            to="/user/edit-profile"
                            className='bg-green-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-green-700 transition-colors text-center'
                        >
                            Edit Profile
                        </Link>
                        <Link
                            to="/user/orders"
                            className='bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors text-center'
                        >
                            My Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    export default UserProfile;