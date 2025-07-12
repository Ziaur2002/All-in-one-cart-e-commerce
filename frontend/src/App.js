import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch()
  const [cartProductCount, setCartProductCount] = useState(0)
  const [cartProduct, setCartProduct] = useState([])
  const [loadingCartProduct, setLoadingCartProduct] = useState(false)

  const fetchUserDetails = async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: 'include'
    })

    const dataApi = await dataResponse.json()

    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data))
    }
  }

  const fetchUserAddToCartCount = async () => {
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
      method: SummaryApi.addToCartProductCount.method,
      credentials: 'include'
    })

    const dataApi = await dataResponse.json()
    setCartProductCount(dataApi?.data?.count)
  }

  const fetchCartProductDetails = async () => {
    setLoadingCartProduct(true)
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: 'include',
        headers: {
          "content-type": 'application/json'
        },
      })
      const responseData = await response.json()

      if (responseData.success) {
        setCartProduct(responseData.data)
      } else {
        setCartProduct([])
        console.error("Error fetching cart product details:", responseData.message)
      }
    } catch (error) {
      setCartProduct([])
      console.error("Network error fetching cart product details:", error)
    } finally {
      setLoadingCartProduct(false)
    }
  }

  useEffect(() => {
    fetchUserDetails()
    fetchUserAddToCartCount()
    fetchCartProductDetails()
  }, [])

  const fetchAllCartData = async () => {
    await fetchUserAddToCartCount();
    await fetchCartProductDetails();
  }

  return (
    <>
      <Context.Provider value={{
        fetchUserDetails,
        fetchUserAddToCart: fetchAllCartData,
        cartProductCount,
        cartProduct,
        loadingCartProduct
      }}>
        <ToastContainer
          position='top-center'
        />
        <Header />
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;