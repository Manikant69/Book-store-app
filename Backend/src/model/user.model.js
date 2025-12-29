import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        require: true,
        default: "user"
    },
    cart: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number
        }
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }]
}, { timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User;
