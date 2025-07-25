import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayBDTCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const { fetchUserAddToCart, cartProduct } = useContext(Context)
    const loadingCart = new Array(4).fill(null)
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserAddToCart();
    }, [])

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify(
                {
                    _id: id,
                    quantity: qty + 1
                }
            )
        })

        const responseData = await response.json()

        if (responseData.success) {
            toast.success(responseData.message);
            fetchUserAddToCart()
        } else {
            toast.error(responseData.message);
        }
    }


    const decraseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(
                    {
                        _id: id,
                        quantity: qty - 1
                    }
                )
            })

            const responseData = await response.json()

            if (responseData.success) {
                toast.success(responseData.message);
                fetchUserAddToCart()
            } else {
                toast.error(responseData.message);
            }
        }
    }

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify(
                {
                    _id: id,
                }
            )
        })

        const responseData = await response.json()

        if (responseData.success) {
            fetchUserAddToCart()
            toast.success(responseData.message);
        } else {
            toast.error(responseData.message);
        }
    }

    // Ensure cartProduct is an array before calling reduce
    const totalQty = (cartProduct || []).reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = (cartProduct || []).reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0)

    return (
        <div className='container mx-auto'>

            <div className='text-center text-lg my-3'>
                {
                    // Use cartProduct for length check
                    (cartProduct && cartProduct.length === 0) && !loading && (
                        <p className='bg-white py-5'>No items in cart</p>
                    )
                }
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                {/***view product */}
                <div className='w-full max-w-3xl'>
                    {
                        loading ? (
                            loadingCart?.map((el, index) => {
                                return (
                                    <div key={el + "Add To Cart Loading" + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                )
                            })

                        ) : (
                            // Ensure cartProduct is an array before mapping
                            (cartProduct || []).map((product, index) => {
                                return (
                                    <div key={product?._id} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                                        <div className='w-32 h-32 bg-slate-200'>
                                            <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                        </div>
                                        <div className='px-4 py-2 relative'>
                                            {/**delete product */}
                                            <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product?._id)}>
                                                <MdDelete />
                                            </div>

                                            <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                            <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-red-600 font-medium text-lg'>{displayBDTCurrency(product?.productId?.sellingPrice)}</p>
                                                <p className='text-slate-600 font-semibold text-lg'>{displayBDTCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                            </div>
                                            <div className='flex items-center gap-3 mt-1'>
                                                <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={() => decraseQty(product?._id, product?.quantity)}>-</button>
                                                <span>{product?.quantity}</span>
                                                <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>


                {/***summary  */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                    {
                        loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'>

                            </div>
                        ) : (
                            <div className='h-auto bg-white p-4 rounded shadow'>
                                <h2 className='text-white bg-red-600 px-4 py-1 rounded-t'>Summary</h2>
                                <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600 py-2'>
                                    <p>Quantity</p>
                                    <p>{totalQty}</p>
                                </div>

                                <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600 py-2'>
                                    <p>Total Price</p>
                                    <p>{displayBDTCurrency(totalPrice)}</p>
                                </div>
                                {
                                    (cartProduct && cartProduct.length > 0) && (
                                        <Link to='/checkout' className='bg-blue-600 p-2 text-white w-full mt-2 block text-center rounded hover:bg-blue-700'>
                                            Proceed to Checkout
                                        </Link>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Cart;