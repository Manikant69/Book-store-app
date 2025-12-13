import mongoose from "mongoose";


const bookSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    authorName:{
        type:String,
        required:true
    },
    genre:[{
        type:String,
        required:true
    }],
    price:{
        type:Number,
        required:true
    },
    publishYear:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        defalut:0,
    },
    inStock:{
        type:Boolean,
        default:true
    },
    language:{
        type:String,
        required:true
    },
    isbn:{
        type:String,
        default:''
    },
    pageCount:{
        type:Number,
        default:0
    },
    publisher:{
        type:String,
        default:''
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalSold: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Book = mongoose.model("Book", bookSchema);

export default Book;