# 🧪 Backend API Testing Guide

## Prerequisites
- Backend running on `http://localhost:5000`
- MongoDB database connected
- Postman or similar API testing tool installed

---

## 🔧 Testing with cURL or Postman

### Step 1: User Registration
**Test Signup functionality**

```bash
curl -X POST http://localhost:5000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Expected Response (201):**
```json
{
  "message": "User created Successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "Test User",
    "email": "test@example.com"
  }
}
```

**Save the userId for next tests!**

---

### Step 2: User Login
**Test Login functionality**

```bash
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

---

### Step 3: Get All Books
**Test basic book retrieval**

```bash
curl -X GET http://localhost:5000/books
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "all books fetched successfully",
  "books": [...],
  "pagination": {
    "total": 5,
    "page": 1,
    "pages": 1
  }
}
```

---

### Step 4: Search Books with Filters
**Test advanced search functionality**

```bash
# Search by name
curl -X GET "http://localhost:5000/books?search=harry"

# Filter by genre and sort
curl -X GET "http://localhost:5000/books?genre=Fantasy&sortBy=rating"

# Complete search with pagination
curl -X GET "http://localhost:5000/books?search=fiction&sortBy=price-asc&page=1&limit=10"
```

---

### Step 5: Get Popular Books
**Test popular books endpoint**

```bash
curl -X GET "http://localhost:5000/books/popular?limit=5"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Popular books fetched successfully",
  "books": [...]
}
```

---

### Step 6: Get Books by Genre
**Test genre filtering**

```bash
curl -X GET "http://localhost:5000/books/genre/Fantasy"
```

---

### Step 7: Get Single Book Details
**Test single book retrieval**

```bash
# Replace with actual book ID from previous responses
curl -X GET "http://localhost:5000/books/507f1f77bcf86cd799439012"
```

---

### Step 8: Add to Cart
**Test cart functionality**

```bash
curl -X POST http://localhost:5000/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "bookId": "507f1f77bcf86cd799439012",
    "quantity": 2
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Book added to cart successfully",
  "cart": [
    {
      "bookId": "507f1f77bcf86cd799439012",
      "quantity": 2,
      "price": 299.99
    }
  ]
}
```

---

### Step 9: View Cart
**Test cart retrieval**

```bash
curl -X GET "http://localhost:5000/cart/507f1f77bcf86cd799439011"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "cart": [...],
  "total": 599.98
}
```

---

### Step 10: Update Cart Quantity
**Test cart quantity update**

```bash
curl -X PUT "http://localhost:5000/cart/507f1f77bcf86cd799439011/507f1f77bcf86cd799439012" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'
```

---

### Step 11: Add to Wishlist
**Test wishlist functionality**

```bash
curl -X POST http://localhost:5000/wishlist/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "bookId": "507f1f77bcf86cd799439012"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Book added to wishlist successfully",
  "wishlist": ["507f1f77bcf86cd799439012"]
}
```

---

### Step 12: Get Wishlist
**Test wishlist retrieval**

```bash
curl -X GET "http://localhost:5000/wishlist/507f1f77bcf86cd799439011"
```

---

### Step 13: Check if Book in Wishlist
**Test wishlist check**

```bash
curl -X GET "http://localhost:5000/wishlist/507f1f77bcf86cd799439011/507f1f77bcf86cd799439012/check"
```

**Expected Response (200):**
```json
{
  "success": true,
  "isInWishlist": true
}
```

---

### Step 14: Create Order
**Test order creation**

```bash
curl -X POST http://localhost:5000/orders/create \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "orderId": "ORD-1702123456789",
    "items": [...],
    "totalAmount": 599.98,
    "status": "pending",
    "createdAt": "2024-12-09T10:30:00.000Z"
  }
}
```

**Save the orderId for next tests!**

---

### Step 15: Get Order History
**Test order history retrieval**

```bash
curl -X GET "http://localhost:5000/orders/507f1f77bcf86cd799439011"
```

---

### Step 16: Get Order Details
**Test order details**

```bash
curl -X GET "http://localhost:5000/orders/507f1f77bcf86cd799439011/ORD-1702123456789"
```

---

### Step 17: Update Order Status
**Test order status update**

```bash
curl -X PUT "http://localhost:5000/orders/507f1f77bcf86cd799439011/ORD-1702123456789/status" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped"
  }'
```

**Valid status values:**
- `pending`
- `confirmed`
- `shipped`
- `delivered`
- `cancelled`

---

### Step 18: Add Book Review
**Test review functionality**

```bash
curl -X POST "http://localhost:5000/books/507f1f77bcf86cd799439012/reviews/add" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "rating": 5,
    "comment": "Excellent book! Highly recommended!"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Review added successfully",
  "book": {...}
}
```

---

### Step 19: Get Book Reviews
**Test reviews retrieval**

```bash
curl -X GET "http://localhost:5000/books/507f1f77bcf86cd799439012/reviews"
```

---

### Step 20: Get User Profile
**Test profile retrieval**

```bash
curl -X GET "http://localhost:5000/users/profile/507f1f77bcf86cd799439011"
```

---

### Step 21: Update User Profile
**Test profile update**

```bash
curl -X PUT "http://localhost:5000/users/profile/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Updated Name",
    "email": "newemail@example.com"
  }'
```

---

### Step 22: Change Password
**Test password change**

```bash
curl -X PUT "http://localhost:5000/users/change-password/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "test123456",
    "newPassword": "newpassword123"
  }'
```

---

## 🧪 Postman Collection Template

Create a Postman collection with these requests:

```json
{
  "info": {
    "name": "BookStore API",
    "description": "Complete BookStore Backend API"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "url": "http://localhost:5000/users/signup"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:5000/users/login"
          }
        }
      ]
    }
  ]
}
```

---

## ✅ Testing Checklist

### Authentication
- [ ] User can sign up
- [ ] User can login
- [ ] Login returns correct user data
- [ ] User can get profile
- [ ] User can update profile
- [ ] User can change password

### Books
- [ ] Get all books returns list
- [ ] Search books works
- [ ] Filter by genre works
- [ ] Sort functionality works
- [ ] Pagination works
- [ ] Get popular books works
- [ ] Get books by genre works
- [ ] Get single book works

### Reviews
- [ ] Can add review to book
- [ ] Reviews show on book
- [ ] Average rating updates
- [ ] Can get all reviews

### Cart
- [ ] Can add item to cart
- [ ] Can view cart
- [ ] Can update quantity
- [ ] Can remove item
- [ ] Cart shows correct total
- [ ] Can clear cart

### Wishlist
- [ ] Can add to wishlist
- [ ] Can view wishlist
- [ ] Can remove from wishlist
- [ ] Can check if in wishlist

### Orders
- [ ] Can create order
- [ ] Order ID is generated
- [ ] Cart clears after order
- [ ] Can view order history
- [ ] Can view order details
- [ ] Can update order status
- [ ] Can cancel order

---

## 🐛 Debugging Tips

### Common Issues

**1. MongoDB Connection Error**
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network access in MongoDB Atlas

**2. 404 Not Found**
- Verify the endpoint URL
- Check if ID exists in database
- Use correct HTTP method

**3. 400 Bad Request**
- Check required fields in body
- Verify data types
- Check JSON syntax

**4. 500 Internal Server Error**
- Check server console logs
- Verify database connection
- Check for typos in code

---

## 📊 Performance Testing

### Test High Volume Searches
```bash
# Search with many results
curl "http://localhost:5000/books?page=1&limit=100"
```

### Test Pagination
```bash
# Page 1
curl "http://localhost:5000/books?page=1&limit=10"

# Page 2
curl "http://localhost:5000/books?page=2&limit=10"

# Page 3
curl "http://localhost:5000/books?page=3&limit=10"
```

---

## 📝 Sample Test Data

### Test User
```json
{
  "fullname": "Test User",
  "email": "test@example.com",
  "password": "test123456"
}
```

### Test Book
```json
{
  "name": "Test Book",
  "authorName": "Test Author",
  "genre": ["Fiction"],
  "price": 299.99,
  "publishYear": "2024",
  "description": "A test book description",
  "language": "English",
  "inStock": true,
  "rating": 4.5
}
```

---

## ✨ Success Criteria

All tests pass when:
- ✅ Status codes are correct (200, 201, 400, 404, 500)
- ✅ Response format is consistent
- ✅ No unexpected errors
- ✅ Data is saved in database
- ✅ Relationships work correctly
- ✅ Calculations are accurate
- ✅ Edge cases are handled

---

**Happy Testing! 🎉**

Generated: December 9, 2025
