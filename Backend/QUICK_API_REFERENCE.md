# 🚀 BookStore Backend - Quick API Reference

## 📚 BOOKS API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | Get all books (with search, filter, sort, pagination) |
| GET | `/books/popular` | Get popular books by rating |
| GET | `/books/genre/:genre` | Get books by genre |
| GET | `/books/:bookId` | Get single book details |
| POST | `/books/add` | Add new book (multipart/form-data) |
| PUT | `/books/update/:bookId` | Update book details (multipart/form-data) |
| DELETE | `/books/delete/:bookId` | Delete book |
| GET | `/books/:bookId/reviews` | Get book reviews |
| POST | `/books/:bookId/reviews/add` | Add review to book |

---

## 👤 USER API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/signup` | User registration |
| POST | `/users/login` | User login |
| GET | `/users/profile/:userId` | Get user profile |
| PUT | `/users/profile/:userId` | Update user profile |
| PUT | `/users/change-password/:userId` | Change password |

---

## 🛒 CART API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cart/add` | Add book to cart |
| GET | `/cart/:userId` | Get user cart |
| PUT | `/cart/:userId/:bookId` | Update item quantity |
| DELETE | `/cart/:userId/:bookId` | Remove item from cart |
| DELETE | `/cart/:userId/clear` | Clear entire cart |

---

## ❤️ WISHLIST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/wishlist/add` | Add book to wishlist |
| GET | `/wishlist/:userId` | Get user wishlist |
| DELETE | `/wishlist/:userId/:bookId` | Remove from wishlist |
| GET | `/wishlist/:userId/:bookId/check` | Check if in wishlist |

---

## 📦 ORDERS API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders/create` | Create new order |
| GET | `/orders/:userId` | Get user orders |
| GET | `/orders/:userId/:orderId` | Get order details |
| DELETE | `/orders/:userId/:orderId/cancel` | Cancel order |
| PUT | `/orders/:userId/:orderId/status` | Update order status |

---

## 🔍 QUERY PARAMETERS

### Search Books
```
GET /books?search=harry&sortBy=rating&genre=Fantasy&page=1&limit=10
```

**Parameters:**
- `search` - Search term (book name, author, description)
- `sortBy` - `price-asc`, `price-desc`, `rating`, `newest`
- `genre` - Comma-separated genres
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

---

## 📝 SAMPLE REQUESTS

### 1. Sign Up
```bash
POST /users/signup
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Search Books
```bash
GET /books?search=harry&sortBy=price-asc&limit=20
```

### 4. Add Book to Cart
```bash
POST /cart/add
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "bookId": "507f1f77bcf86cd799439012",
  "quantity": 2
}
```

### 5. Add to Wishlist
```bash
POST /wishlist/add
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "bookId": "507f1f77bcf86cd799439012"
}
```

### 6. Create Order
```bash
POST /orders/create
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "bookId": "507f1f77bcf86cd799439012",
      "quantity": 2,
      "price": 299.99
    }
  ],
  "totalAmount": 599.98,
  "shippingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "COD"
}
```

### 7. Add Book Review
```bash
POST /books/507f1f77bcf86cd799439012/reviews/add
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Excellent book, highly recommended!"
}
```

### 8. Add New Book (Admin)
```bash
POST /books/add
Content-Type: multipart/form-data

Form Data:
- name: "The Great Gatsby"
- authorName: "F. Scott Fitzgerald"
- genre: ["Fiction", "Classic"]
- price: 299.99
- publishYear: "2023"
- description: "A classic novel..."
- language: "English"
- inStock: true
- rating: 4.5
- coverImage: <image_file>
```

---

## ✅ RESPONSE STATUS CODES

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 404 | Not Found - Resource not found |
| 500 | Server Error |

---

## 🎯 ORDER STATUS FLOW

```
pending → confirmed → shipped → delivered
                   ↓
                cancelled
```

**Status Update Example:**
```bash
PUT /orders/507f1f77bcf86cd799439011/ORD-1702123456/status
Content-Type: application/json

{
  "status": "shipped"
}
```

---

## 📊 POPULAR QUERIES

### Get Top 10 Rated Books
```
GET /books/popular?limit=10
```

### Search Fantasy Books by Price
```
GET /books?genre=Fantasy&sortBy=price-asc&limit=20
```

### Get User Cart with Total
```
GET /cart/507f1f77bcf86cd799439011
```

### Get Order History
```
GET /orders/507f1f77bcf86cd799439011
```

### Add to Wishlist
```bash
POST /wishlist/add
{
  "userId": "507f1f77bcf86cd799439011",
  "bookId": "507f1f77bcf86cd799439012"
}
```

---

## 🔐 AUTHENTICATION

Currently, the API uses direct user ID for most operations. Future enhancement will include JWT tokens:

```bash
Authorization: Bearer <token>
```

---

## 💡 TIPS

1. **Search Multiple Genres:**
   ```
   GET /books?genre=Fiction,Mystery,Adventure
   ```

2. **Combine Filters:**
   ```
   GET /books?search=harry&genre=Fantasy&sortBy=rating
   ```

3. **Paginate Results:**
   ```
   GET /books?page=2&limit=15
   ```

4. **Check If Book in Wishlist:**
   ```
   GET /wishlist/userId/bookId/check
   ```

---

## 🚨 COMMON ERRORS

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request | Missing required fields | Check request body |
| 404 Not Found | Resource doesn't exist | Verify IDs |
| 500 Server Error | Internal error | Check server logs |
| Invalid password | Wrong credentials | Verify password |
| Email already exists | User already registered | Use different email |

---

## 📚 Features Supported

✅ Book Search with Full-Text Search  
✅ Advanced Filtering & Sorting  
✅ Pagination  
✅ Shopping Cart Management  
✅ Wishlist/Save for Later  
✅ User Reviews & Ratings  
✅ Order Management  
✅ Order Status Tracking  
✅ User Profiles  
✅ Password Management  

---

**Last Updated:** December 9, 2025
**API Version:** 1.0
**Backend Framework:** Express.js
**Database:** MongoDB
