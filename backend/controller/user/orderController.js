const orderModel = require('../../models/orderModel');
const addToCartModel = require('../../models/cartProduct');
const productModel = require('../../models/productModel');
const SSLCommerzPayment = require('sslcommerz-lts');

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = false;

const placeOrderController = async (req, res) => {
    try {
        const userId = req.userId;

        console.log("Place Order Request received for userId:", userId);
        console.log("Request Body:", JSON.stringify(req.body, null, 2));


        if (!userId) {
            return res.status(400).json({
                message: "User not authenticated",
                error: true,
                success: false
            });
        }

        const cartItems = await addToCartModel.find({ userId }).populate('productId');
        console.log("Cart Items fetched:", cartItems.length);


        if (cartItems.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty. Please add products to place an order.",
                error: true,
                success: false
            });
        }

        let totalAmount = 0;
        const productsForOrder = cartItems.map(item => {
            if (!item.productId) {
                console.error("Product ID not found for cart item:", item._id);
                throw new Error(`Product details not found for one or more items in cart.`);
            }
            const productSellingPrice = item.productId.sellingPrice;
            totalAmount += (productSellingPrice * item.quantity);
            return {
                productId: item.productId._id,
                quantity: item.quantity,
                sellingPrice: productSellingPrice
            };
        });
        console.log("Calculated Total Amount:", totalAmount);

        const { shippingAddress, paymentMethod, customerDetails } = req.body;

        if (!shippingAddress || !paymentMethod || !customerDetails) {
            console.error("Missing required fields in request body:", { shippingAddress: !!shippingAddress, paymentMethod: !!paymentMethod, customerDetails: !!customerDetails });
            return res.status(400).json({
                message: "Shipping address, payment method and customer details are required.",
                error: true,
                success: false
            });
        }
        if (paymentMethod === 'online_payment') {
            console.log("Payment Method: Online Payment");

            if (!customerDetails.email || customerDetails.email.trim() === '') {
                console.error("Validation Error: customerDetails.email is missing or empty for online payment.");
                return res.status(400).json({
                    message: "Customer email is required for online payment.",
                    error: true,
                    success: false
                });
            }

            const newOrder = new orderModel({
                userId,
                products: productsForOrder,
                totalAmount,
                shippingAddress,
                paymentMethod: 'online_payment',
                customerDetails,
                orderStatus: 'pending_payment'
            });

            const savedOrder = await newOrder.save();
            console.log("Temporary Order Saved with ID:", savedOrder._id);
            const transactionId = savedOrder._id.toString();

            const success_url = `${process.env.FRONTEND_URL}/payment/success/${transactionId}`;
            const fail_url = `${process.env.FRONTEND_URL}/payment/fail/${transactionId}`;
            const cancel_url = `${process.env.FRONTEND_URL}/payment/cancel/${transactionId}`;
            const ipn_url = `${process.env.BACKEND_URL}/api/payment/ipn`;

            console.log("SSLCommerz Config:", { store_id, store_passwd: store_passwd ? '******' : 'MISSING', is_live });
            console.log("SSLCommerz URLs:", { success_url, fail_url, cancel_url, ipn_url });

            const phoneNumber = customerDetails.phone ? customerDetails.phone.replace(/\D/g, '') : '';
            const formattedPhone = phoneNumber.startsWith('880') ? phoneNumber : `880${phoneNumber}`;

            const data = {
                total_amount: totalAmount,
                currency: 'BDT',
                tran_id: transactionId,
                success_url,
                fail_url,
                cancel_url,
                ipn_url,
                shipping_method: 'Courier',
                product_name: 'E-commerce Products',
                product_category: 'Electronic',
                product_profile: 'general',
                cus_name: customerDetails.name,
                cus_email: customerDetails.email,
                cus_add1: shippingAddress.address,
                cus_add2: shippingAddress.area || '',
                cus_city: shippingAddress.city,
                cus_state: shippingAddress.state || 'Dhaka',
                cus_postcode: shippingAddress.zipCode || '1000',
                cus_country: 'Bangladesh',
                cus_phone: formattedPhone,
                ship_name: customerDetails.name,
                ship_add1: shippingAddress.address,
                ship_add2: shippingAddress.area || '',
                ship_city: shippingAddress.city,
                ship_state: shippingAddress.state || 'Dhaka',
                ship_postcode: shippingAddress.zipCode || '1000',
                ship_country: 'Bangladesh'
            };
            console.log("SSLCommerz Data Payload:", JSON.stringify(data, null, 2));


            const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
            let apiResponse;
            try {
                apiResponse = await sslcz.init(data);
                console.log("SSLCommerz API Response:", JSON.stringify(apiResponse, null, 2));
            } catch (sslCommerzError) {
                console.error("SSLCommerz init error details (caught):", sslCommerzError.message, sslCommerzError.stack);
                await orderModel.findByIdAndDelete(savedOrder._id);
                return res.status(500).json({
                    message: `Failed to initialize payment with SSLCommerz: ${sslCommerzError.message}`,
                    error: true,
                    success: false
                });
            }

            if (apiResponse?.GatewayPageURL) {
                console.log("GatewayPageURL found:", apiResponse.GatewayPageURL);
                return res.json({
                    message: "Payment initiated",
                    success: true,
                    error: false,
                    paymentUrl: apiResponse.GatewayPageURL
                });
            } else {
                console.error("SSLCommerz init failed: No GatewayPageURL in API response.");
                await orderModel.findByIdAndDelete(savedOrder._id);
                return res.status(500).json({
                    message: `Failed to initialize payment with SSLCommerz. No GatewayPageURL. Response: ${JSON.stringify(apiResponse)}`,
                    error: true,
                    success: false
                });
            }
        } else if (paymentMethod === 'cash_on_delivery') {
            console.log("Payment Method: Cash on Delivery");
            const newOrder = new orderModel({
                userId,
                products: productsForOrder,
                totalAmount,
                shippingAddress,
                paymentMethod: 'cash_on_delivery',
                customerDetails,
                paymentDetails: {
                    method: 'Cash on Delivery',
                    paymentStatus: 'pending'
                },
                orderStatus: 'pending'
            });

            const savedOrder = await newOrder.save();
            await addToCartModel.deleteMany({ userId });

            res.json({
                message: "Order placed successfully (Cash on Delivery)!",
                success: true,
                error: false,
                data: savedOrder
            });
        } else {
            console.warn("Unsupported payment method received:", paymentMethod);
            return res.status(400).json({
                message: "Unsupported payment method.",
                error: true,
                success: false
            });
        }

    } catch (err) {
        console.error("Caught unhandled error in placeOrderController:", err.message, err.stack);
        res.status(500).json({
            message: err.message || "An internal server error occurred during order placement.",
            error: true,
            success: false
        });
    }
};

const paymentIPNController = async (req, res) => {
    try {
        console.log("IPN received:", req.body);
        const { val_id, tran_id, status } = req.body;

        if (!val_id || !tran_id || !status) {
            console.error("Invalid IPN data received.");
            return res.status(400).json({
                message: "Invalid IPN data",
                error: true,
                success: false
            });
        }

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const verificationResponse = await sslcz.validate({ val_id });

        if (verificationResponse.status !== 'VALID') {
            console.warn(`Payment verification failed for tran_id: ${tran_id}, val_id: ${val_id}. Status: ${verificationResponse.status}`);
            await orderModel.findByIdAndUpdate(tran_id, {
                orderStatus: 'failed',
                'paymentDetails.paymentStatus': 'failed',
                'paymentDetails.transactionId': val_id
            });
            return res.status(400).json({
                message: "Payment verification failed",
                error: true,
                success: false
            });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            tran_id,
            {
                orderStatus: 'completed',
                'paymentDetails.paymentStatus': 'paid',
                'paymentDetails.transactionId': val_id
            },
            { new: true }
        );

        if (!updatedOrder) {
            console.error("Order not found for IPN update:", tran_id);
            return res.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        await addToCartModel.deleteMany({ userId: updatedOrder.userId });
        console.log(`Cart cleared for user ${updatedOrder.userId} after IPN success.`);

        return res.status(200).json({
            message: "Payment verified and order completed",
            success: true,
            error: false,
            data: updatedOrder
        });

    } catch (err) {
        console.error("Error in paymentIPNController:", err.message, err.stack);
        return res.status(500).json({
            message: err.message || "An internal server error occurred.",
            error: true,
            success: false
        });
    }
};

const paymentSuccessController = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log("Payment success for order:", orderId);

        const order = await orderModel.findById(orderId);
        if (!order) {
            console.warn("Order not found in paymentSuccessController for ID:", orderId);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/fail/${orderId}`);
        }

        console.log("Redirecting to frontend order-success page:", `${process.env.FRONTEND_URL}/order-success/${orderId}`);
        return res.redirect(`${process.env.FRONTEND_URL}/order-success/${orderId}`);

    } catch (err) {
        console.error("Error in paymentSuccessController (redirect):", err.message, err.stack);
        console.log("Redirecting to frontend payment/fail page due to error:", `${process.env.FRONTEND_URL}/payment/fail/${req.params.orderId || 'unknown'}`);
        return res.redirect(`${process.env.FRONTEND_URL}/payment/fail/${req.params.orderId || 'unknown'}`);
    }
};

const validatePaymentController = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log("Validate Payment Controller hit for orderId:", orderId);


        const order = await orderModel.findById(orderId);
        if (!order) {
            console.warn("Order not found in validatePaymentController for ID:", orderId);
            return res.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        if (order.orderStatus === 'completed' || order.paymentMethod === 'cash_on_delivery') {
            console.log(`Order ${orderId} already finalized or COD. Status: ${order.orderStatus}, Method: ${order.paymentMethod}`);
            return res.json({
                message: "Order status is already finalized or is COD.",
                success: true,
                error: false,
                data: order
            });
        }

        if (order.paymentMethod === 'online_payment' && order.paymentDetails?.val_id) {
            console.log(`Attempting to validate online payment for order ${orderId} with val_id: ${order.paymentDetails.val_id}`);
            const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
            const verificationResponse = await sslcz.validate({ val_id: order.paymentDetails.val_id });
            console.log("SSLCommerz Validation Response from validatePaymentController:", JSON.stringify(verificationResponse, null, 2));


            if (verificationResponse.status === 'VALID') {
                console.log(`Payment for order ${orderId} is VALID. Updating order status.`);
                const updatedOrder = await orderModel.findByIdAndUpdate(
                    orderId,
                    {
                        orderStatus: 'completed',
                        'paymentDetails.paymentStatus': 'paid',
                        'paymentDetails.transactionId': order.paymentDetails.val_id
                    },
                    { new: true }
                );

                await addToCartModel.deleteMany({ userId: order.userId });
                console.log(`Cart cleared for user ${order.userId} after successful online payment validation.`);


                return res.json({
                    message: "Payment verified successfully",
                    success: true,
                    error: false,
                    data: updatedOrder
                });
            } else {
                console.warn(`Payment validation failed for order ${orderId}. Status: ${verificationResponse.status}`);
                await orderModel.findByIdAndUpdate(orderId, {
                    orderStatus: 'failed',
                    'paymentDetails.paymentStatus': 'failed',
                    'paymentDetails.transactionId': order.paymentDetails.val_id
                });
                return res.status(400).json({
                    message: "Payment verification failed",
                    error: true,
                    success: false
                });
            }
        } else {
            console.warn(`Payment details incomplete for online verification for order ${orderId}.`);
            return res.status(400).json({
                message: "Payment details incomplete for online verification.",
                error: true,
                success: false
            });
        }

    } catch (err) {
        console.error("Error in validatePaymentController:", err.message, err.stack);
        res.status(500).json({
            message: err.message || "An internal server error occurred.",
            error: true,
            success: false
        });
    }
};

const getUserOrdersController = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                message: "User not authenticated",
                error: true,
                success: false
            });
        }

        const orders = await orderModel.find({ userId }).populate('products.productId').sort({ createdAt: -1 });

        res.json({
            message: "User orders fetched successfully",
            success: true,
            error: false,
            data: orders
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find().populate('products.productId').sort({ createdAt: -1 });

        res.json({
            message: "All orders fetched successfully",
            success: true,
            error: false,
            data: orders
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

const updateOrderStatusController = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                message: "Order ID and status are required",
                error: true,
                success: false
            });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Order status updated successfully",
            success: true,
            error: false,
            data: updatedOrder
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = {
    placeOrderController,
    getUserOrdersController,
    getAllOrdersController,
    updateOrderStatusController,
    paymentIPNController,
    paymentSuccessController,
    validatePaymentController
};