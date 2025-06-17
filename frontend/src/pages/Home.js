import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      <HorizontalCardProduct category={"airpods"} heading={"Top's Airpods"}/>
      <HorizontalCardProduct category={"camera"} heading={"Top's Cameras"}/>

      <VerticalCardProduct category={"mobiles"} heading={"Top's Mobiles"}/>

    </div>
  )
}

export default Home