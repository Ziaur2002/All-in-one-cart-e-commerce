import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home"
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import SignUp from "../pages/SignUp";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
import AllProducts from "../pages/AllProducts";
import CategoryProduct from "../pages/CategoryProduct";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import SearchProduct from '../pages/SearchProduct'
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import UserOrders from '../pages/UserOrders';
import AllOrders from '../pages/AllOrders';
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFail from "../pages/PaymentFail";
import PaymentCancel from "../pages/PaymentCancel";
import UserProfile from "../pages/UserProfile";
import EditProfile from "../pages/EditProfile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "sign-up",
                element: <SignUp />
            },
            {
                path: "product-category",
                element: <CategoryProduct />
            },
            {
                path: "product/:id",
                element: <ProductDetails />
            },
            {
                path: "cart",
                element: <Cart />
            },
            {
                path: "search",
                element: <SearchProduct />
            },
            {
                path: "admin-panel",
                element: <AdminPanel />,
                children: [
                    {
                        path: "all-users",
                        element: <AllUsers />
                    },
                    {
                        path: "all-products",
                        element: <AllProducts />
                    },
                    {
                        path: "all-orders",
                        element: <AllOrders />
                    }
                ]
            },
            {
                path: "checkout",
                element: <Checkout />
            },
            {
                path: "order-success/:orderId",
                element: <OrderSuccess />
            },
            {
                path: "user/profile",
                element: <UserProfile />
            },
            {
                path: "user/edit-profile",
                element: <EditProfile />
            },
            {
                path: "user/orders",
                element: <UserOrders />
            },
            {
                path: "payment/success/:orderId",
                element: <PaymentSuccess />
            },
            {
                path: "payment/fail/:orderId",
                element: <PaymentFail />
            },
            {
                path: "payment/cancel/:orderId",
                element: <PaymentCancel />
            }
        ]
    }
])

export default router;