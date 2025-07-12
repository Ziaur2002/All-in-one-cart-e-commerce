const orderModel = require('../../models/orderModel');
const addToCartModel = require('../../models/cartProduct'); // Corrected variable name to match export
const productModel = require('../../models/productModel');

const placeOrderController = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                message: "User not authenticated",
                error: true,
                success: false
            });
        }

        // Use addToCartModel here
        const cartItems = await addToCartModel.find({ userId }).populate('productId');

        if (cartItems.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty. Please add products to place an order.",
                error: true,
                success: false
            });
        }

        let totalAmount = 0;
        const productsForOrder = cartItems.map(item => {
            // Add a check for item.productId to prevent errors if populate fails for some reason
            if (!item.productId) {
                console.error("Product ID not found for cart item:", item._id);
                // You might want to skip this item or throw a more specific error
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

        const { shippingAddress, paymentDetails } = req.body;
        if (!shippingAddress || !paymentDetails) {
            return res.status(400).json({
                message: "Shipping address and payment details are required.",
                error: true,
                success: false
            });
        }

        const newOrder = new orderModel({
            userId,
            products: productsForOrder,
            totalAmount,
            shippingAddress,
            paymentDetails
        });

        const savedOrder = await newOrder.save();

        // Use addToCartModel here
        await addToCartModel.deleteMany({ userId });

        res.json({
            message: "Order placed successfully!",
            success: true,
            error: false,
            data: savedOrder
        });

    } catch (err) {
        console.error("Error in placeOrderController:", err); // Log the full error on the server
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
    updateOrderStatusController
};