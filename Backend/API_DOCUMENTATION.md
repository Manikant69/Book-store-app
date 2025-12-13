# BookStore Backend API Documentation

## Overview
This is a comprehensive REST API for a bookstore application built with Express.js and MongoDB. It includes features for managing books, users, shopping carts, wishlists, orders, and reviews.

---

## Base URL
```
http://localhost:5000
```

---

## API Endpoints

### 1. BOOKS ENDPOINTS

#### Get All Books (with filtering, sorting & search)
```
GET /books
```
**Query Parameters:**
- `search` (string): Search by book name, author, or description
- `genre` (string): Filter by genre (comma-separated for multiple)
- `sortBy` (string): Sort by `price-asc`, `price-desc`, `rating`, or `newest`
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Example:**
```
GET /books?search=harry&sortBy=price-asc&page=1&limit=10
GET /books?genre=Fiction,Mystery&sortBy=rating
```

#### Get Popular Books
```
GET /books/popular?limit=10
```

#### Get Books by Genre
```
GET /books/genre/:genre
```

#### Get Single Book
```
GET /books/:bookId
```

#### Add New Book (Admin Only)
```
POST /books/add
Content-Type: multipart/form-data
```
**Body:**
```json
{
  "name": "Book Title",
  "authorName": "Author Name",
  "genre": ["Fiction", "Adventure"],
  "price": 299.99,
  "publishYear": "2024",
  "description": "Book description",
  "language": "English",
  "inStock": true,
  "rating": 4.5,
  "coverImage": <file>
}
```

#### Update Book
```
PUT /books/update/:bookId
Content-Type: multipart/form-data
```

#### Delete Book (Admin Only)
```
DELETE /books/delete/:bookId
```

#### Get Book Reviews
```
GET /books/:bookId/reviews
```

#### Add Book Review
```
POST /books/:bookId/reviews/add
```
**Body:**
```json
{
  "userId": "user_id",
  "rating": 4,
  "comment": "Great book!"
}
```

---

### 2. USER ENDPOINTS

#### Sign Up
```
POST /users/signup
```
**Body:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /users/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```
GET /users/profile/:userId
```

#### Update User Profile
```
PUT /users/profile/:userId
```
**Body:**
```json
{
  "fullname": "Jane Doe",
  "email": "jane@example.com"
}
```

#### Change Password
```
PUT /users/change-password/:userId
```
**Body:**
```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

---

### 3. CART ENDPOINTS

#### Add to Cart
```
POST /cart/add
```
**Body:**
```json
{
  "userId": "user_id",
  "bookId": "book_id",
  "quantity": 2
}
```

#### Get User Cart
```
GET /cart/:userId
```

#### Update Cart Item Quantity
```
PUT /cart/:userId/:bookId
```
**Body:**
```json
{
  "quantity": 3
}
```

#### Remove from Cart
```
DELETE /cart/:userId/:bookId
```

#### Clear Cart
```
DELETE /cart/:userId/clear
```

---

### 4. WISHLIST ENDPOINTS

#### Add to Wishlist
```
POST /wishlist/add
```
**Body:**
```json
{
  "userId": "user_id",
  "bookId": "book_id"
}
```

#### Get Wishlist
```
GET /wishlist/:userId
```

#### Check if Book is in Wishlist
```
GET /wishlist/:userId/:bookId/check
```

#### Remove from Wishlist
```
DELETE /wishlist/:userId/:bookId
```

---

### 5. ORDER ENDPOINTS

#### Create Order
```
POST /orders/create
```
**Body:**
```json
{
  "userId": "user_id",
  "items": [
    {
      "bookId": "book_id",
      "quantity": 2,
      "price": 299.99
    }
  ],
  "totalAmount": 599.98,
  "shippingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "COD"
}
```

#### Get User Orders
```
GET /orders/:userId
```

#### Get Order Details
```
GET /orders/:userId/:orderId
```

#### Cancel Order
```
DELETE /orders/:userId/:orderId/cancel
```

#### Update Order Status
```
PUT /orders/:userId/:orderId/status
```
**Body:**
```json
{
  "status": "shipped"
}
```
**Valid Status Values:** `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Data Models

### Book Model
```javascript
{
  name: String (unique),
  authorName: String,
  genre: [String],
  price: Number,
  publishYear: String,
  coverImage: String (URL),
  description: String,
  rating: Number (0-5),
  inStock: Boolean,
  language: String,
  reviews: [{
    userId: ObjectId,
    rating: Number (1-5),
    comment: String,
    createdAt: Date
  }],
  totalSold: Number,
  timestamps: true
}
```

### User Model
```javascript
{
  fullname: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ["user", "admin"]),
  cart: [{
    bookId: ObjectId,
    quantity: Number,
    price: Number
  }],
  wishlist: [ObjectId],
  orders: [{
    orderId: String,
    items: Array,
    totalAmount: Number,
    shippingAddress: String,
    paymentMethod: String,
    status: String,
    createdAt: Date,
    updatedAt: Date
  }],
  timestamps: true
}
```

---

## Features Implemented

### ✅ Book Management
- Get all books with advanced filtering, sorting, and pagination
- Search books by name, author, or description
- Get books by genre
- Get popular books sorted by rating
- Add, update, and delete books
- Book reviews system with automatic rating calculation

### ✅ User Management
- User registration (signup)
- User login
- Profile management (view and update)
- Password change functionality

### ✅ Shopping Cart
- Add books to cart
- View cart with total price
- Update item quantities
- Remove items from cart
- Clear entire cart

### ✅ Wishlist
- Add books to wishlist
- View saved wishlist
- Remove books from wishlist
- Check if book is in wishlist

### ✅ Orders
- Create orders from cart items
- View user order history
- Get detailed order information
- Cancel orders (if pending)
- Update order status (admin)
- Order status tracking: pending → confirmed → shipped → delivered

---

## Error Handling

Common HTTP Status Codes:
- `200`: OK - Request successful
- `201`: Created - Resource created successfully
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Authentication required
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server error

---

## Future Enhancements

- JWT authentication tokens
- Payment gateway integration
- Admin dashboard
- Email notifications
- Book recommendations based on purchase history
- Advanced analytics and reporting
- Category management
- Inventory management system
- Return and refund processing
- User ratings and recommendations

---

## Usage Example

### Complete Purchase Flow

1. **Search Books**
```bash
curl "http://localhost:5000/books?search=harry&genre=Fantasy&sortBy=rating"
```

2. **Add to Cart**
```bash
curl -X POST "http://localhost:5000/cart/add" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","bookId":"book456","quantity":2}'
```

3. **View Cart**
```bash
curl "http://localhost:5000/cart/user123"
```

4. **Create Order**
```bash
curl -X POST "http://localhost:5000/orders/create" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user123",
    "items":[{"bookId":"book456","quantity":2,"price":299.99}],
    "totalAmount":599.98,
    "shippingAddress":"123 Main St",
    "paymentMethod":"COD"
  }'
```

5. **View Orders**
```bash
curl "http://localhost:5000/orders/user123"
```
