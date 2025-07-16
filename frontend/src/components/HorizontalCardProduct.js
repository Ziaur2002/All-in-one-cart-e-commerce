import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayBDTCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const HorizontalCardProduct = ({ category, heading }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)

    const [scroll, setScroll] = useState(0)
    const scrollElement = useRef()

    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    const fetchData = async () => {
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)
        setData(categoryProduct?.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const scrollRight = () => {
        scrollElement.current.scrollLeft += 300
    }
    const scrollLeft = () => {
        scrollElement.current.scrollLeft -= 300
    }

    return (
        <div className='container mx-auto px-4 my-6 relative'>
            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

            <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all' ref={scrollElement}>
                <button className='bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block' onClick={scrollLeft}>
                    <FaAngleLeft />
                </button>
                <button className='bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block' onClick={scrollRight}>
                    <FaAngleRight />
                </button>

                {loading ? (
                    loadingList.map((_, index) => (
                        <div key={index} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] min-h-[220px] bg-white rounded-sm shadow flex'>
                            <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse'></div>
                            <div className='p-4 grid w-full gap-2'>
                                <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full'></h2>
                                <p className='capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full'></p>
                                <div className='flex gap-3 w-full'>
                                    <p className='text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                                    <p className='text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                                </div>
                                <button className='text-sm text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse'></button>
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product, index) => (
                        <Link
                            key={product?._id || index}
                            to={'product/' + product?._id}
                            className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow flex flex-col overflow-hidden min-h-[330px]'
                        >
                            {/* Image Section */}
                            <div className='h-[160px] bg-slate-100 flex items-center justify-center'>
                                <img
                                    src={product.productImage?.[0]}
                                    alt={product?.productName}
                                    className='h-full object-contain transition-transform duration-300 hover:scale-110'
                                />
                            </div>

                            {/* Info Section */}
                            <div className='flex flex-col justify-between p-4 flex-1'>
                                <div>
                                    <h2 className='font-medium text-base md:text-lg text-black line-clamp-2'>
                                        {product?.productName || 'Unnamed Product'}
                                    </h2>
                                    <p className='capitalize text-sm text-slate-500 mt-1'>
                                        {product?.category || 'Uncategorized'}
                                    </p>
                                </div>

                                <div className='mt-3'>
                                    <div className='flex gap-3 mb-2'>
                                        <p className='text-red-600 font-semibold'>
                                            {displayBDTCurrency(product?.sellingPrice)}
                                        </p>
                                        <p className='text-slate-500 line-through'>
                                            {displayBDTCurrency(product?.price)}
                                        </p>
                                    </div>

                                    <button
                                        className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full w-full'
                                        onClick={(e) => handleAddToCart(e, product?._id)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default HorizontalCardProduct