const express = require('express')
const router = express.Router()

const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const {
    placeOrderController,
    getUserOrdersController,
    getAllOrdersController,
    updateOrderStatusController,
    paymentIPNController,
    paymentSuccessController,
    validatePaymentController
} = require('../controller/user/orderController')

//user
router.post("/signup", userSignUpController)
router.post("/signin", userSignInController)
router.get("/user-details", authToken, userDetailsController)
router.get("/userLogout", userLogout)

//Admin panel
router.get("/all-user", authToken, allUsers)
router.post("/update-user", authToken, updateUser)

//Product
router.post("/upload-product", authToken, UploadProductController)
router.get("/get-product", getProductController)
router.post("/update-product", authToken, updateProductController)
router.get("/get-categoryProduct", getCategoryProduct)
router.post("/category-product", getCategoryWiseProduct)
router.post("/product-details", getProductDetails)
router.get("/search", searchProduct)
router.post("/filter-product", filterProductController)

//User Add to cart
router.post("/addtocart", authToken, addToCartController)
router.get("/countAddToCartProduct", authToken, countAddToCartProduct)
router.get("/view-card-product", authToken, addToCartViewProduct)
router.post("/update-cart-product", authToken, updateAddToCartProduct)
router.post("/delete-cart-product", authToken, deleteAddToCartProduct)

// Order routes
router.post('/place-order', authToken, placeOrderController);
router.get('/user-orders', authToken, getUserOrdersController);
router.get('/all-orders', authToken, getAllOrdersController);
router.post('/update-order-status', authToken, updateOrderStatusController);

// Payment routes (ADD THESE - THEY WERE MISSING!)
router.post('/payment/ipn', paymentIPNController);
router.get('/payment/success/:orderId', paymentSuccessController);
router.get('/payment/fail/:orderId', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail/${req.params.orderId}`);
});
router.get('/payment/cancel/:orderId', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel/${req.params.orderId}`);
});
router.get('/payment/validate/:orderId', validatePaymentController);

module.exports = router