const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                ref: 'product',
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            sellingPrice: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phoneNumber: String
    },
    paymentDetails: {
        method: String,
        transactionId: String,
        paymentStatus: {
            type: String,
            default: 'pending'
        }
    },
    orderStatus: {
        type: String,
        default: 'pending'
    },
}, {
    timestamps: true
});

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel;