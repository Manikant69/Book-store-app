# Bookstore Web Application

This is a full-stack bookstore web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The app provides an intuitive interface for users to browse available books, with additional features such as login functionality to track unavailable books before account creation, and a dedicated course section showing books after login.

## Features

- **User Authentication**: Secure login and registration system for personalized user experience.
- **Book Availability Tracking**: Unauthenticated users can see books that are unavailable, while logged-in users can access the full list of available books.
- **Course Section**: Authenticated users have access to a dedicated course section where all available books are displayed.
- **Responsive Design**: Optimized for both desktop and mobile devices using React and Tailwind CSS.
- **MERN Stack**: Built with MongoDB, Express.js, React.js, and Node.js for a full-stack implementation.

## Demo

Provide a link to your live app or demo video if available.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/bookstore-web-app.git
    ```

2. Navigate to the project folder:

    ```bash
    cd bookstore-web-app
    ```

3. Install dependencies for both client and server:

    - In the root folder for server:

      ```bash
      npm install
      ```

    - In the client folder (usually `client`):

      ```bash
      cd client
      npm install
      ```

4. Create a `.env` file in the root directory for environment variables such as database credentials, JWT secret, etc. For example:

    ```bash
    MONGO_URI=your-mongodb-uri
    JWT_SECRET=your-jwt-secret
    ```

5. Start the development server:

    - For server (in root):

      ```bash
      npm start
      ```

    - For client (in client folder):

      ```bash
      npm start
      ```

6. Open the app at `http://localhost:4001`.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)


