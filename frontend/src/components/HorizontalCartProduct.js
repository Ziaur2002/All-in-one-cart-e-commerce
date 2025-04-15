import React, { useEffect, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setloading] = useState(false)
  const loadingList = new Array(13).fill(null)

  const fetchData = async () => {
    setloading(true)
    const categoryProduct = await fetchCategoryWiseProduct(category)
    setloading(false)

    setData(categoryProduct?.data)
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='container mx-auto px-4 py-6 my-6'>

      <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

      <div className='flex items-center gap-4 md:gap-6'>
        {
          data.map((product, index) => {
            return (
              <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'>
                <div className='bg-slate-200 h-full p-2 min-w-[120px] md:min-w-[145px]'>
                  <img src={product.productImage[0]} className='object-scale-down h-full' />
                </div>
                <div>

                </div>
              </div>
            )
          })
        }
      </div>

    </div>
  )
}

export default HorizontalCardProduct