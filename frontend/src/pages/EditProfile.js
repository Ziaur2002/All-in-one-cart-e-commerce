import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const EditProfile = () => {
    const user = useSelector(state => state?.user?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetailsAndSetForm = async () => {
            try {
                const response = await fetch(SummaryApi.current_user.url, {
                    method: SummaryApi.current_user.method,
                    credentials: 'include'
                });
                const responseData = await response.json();

                if (responseData.success) {
                    dispatch(setUserDetails(responseData.data));
                    setFormData({
                        name: responseData.data.name || '',
                        email: responseData.data.email || '',
                        mobile: responseData.data.mobile || '',
                    });
                } else {
                    toast.error(responseData.message || "Failed to fetch user details for editing.");
                    dispatch(setUserDetails(null));
                }
            } catch (error) {
                console.error("Error fetching user details for editing:", error);
                toast.error("An error occurred while fetching user details.");
                dispatch(setUserDetails(null));
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                mobile: user.mobile || '',
            });
            setLoading(false);
        } else {
            fetchUserDetailsAndSetForm();
        }
    }, [user, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(SummaryApi.updateUser.url, {
                method: SummaryApi.updateUser.method,
                headers: {
                    "content-type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();

            if (responseData.success) {
                toast.success(responseData.message || "Profile updated successfully!");
                const updatedUserResponse = await fetch(SummaryApi.current_user.url, {
                    method: SummaryApi.current_user.method,
                    credentials: 'include'
                });
                const updatedUserData = await updatedUserResponse.json();
                if (updatedUserData.success) {
                    dispatch(setUserDetails(updatedUserData.data));
                } else {
                    console.error("Failed to re-fetch user details after update:", updatedUserData.message);
                }
                navigate('/user/profile');
            } else {
                toast.error(responseData.message || "Failed to update profile.");
            }
        } catch (error) {
            toast.error("An error occurred while updating profile.");
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='container mx-auto p-4 text-center text-lg text-blue-600'>
                Loading profile data...
            </div>
        );
    }

    if (!user) {
        return (
            <div className='container mx-auto p-4 text-center text-lg text-slate-500'>
                Please log in to edit your profile.
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
            <h1 className='text-3xl font-bold mb-6 text-center'>Edit Profile</h1>

            <div className='bg-white p-8 rounded-lg shadow-md max-w-xl mx-auto'>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 gap-4 mb-6'>
                        <div>
                            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Full Name</label>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email Address</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100 cursor-not-allowed'
                                readOnly
                                disabled
                            />
                            <p className='text-sm text-gray-500 mt-1'>Email address is usually not editable.</p>
                        </div>
                        <div>
                            <label htmlFor='mobile' className='block text-sm font-medium text-gray-700'>Phone Number</label>
                            <input
                                type='text'
                                id='mobile'
                                name='mobile'
                                value={formData.mobile}
                                onChange={handleChange}
                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                            />
                        </div>
                    </div>

                    <div className='flex justify-end gap-4'>
                        <button
                            type='button'
                            onClick={() => navigate('/user/profile')}
                            className='bg-gray-300 text-gray-800 py-2 px-6 rounded-md font-semibold hover:bg-gray-400 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors'
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;