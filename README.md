# Stream

Stream is a full-stack streaming web application built with a Next.js frontend and an Express.js + MongoDB backend. It allows users to browse movies and TV content, manage a watchlist, sign in securely, reset passwords, and access premium subscription features through Razorpay.

## Overview

This project combines a modern frontend experience with a lightweight backend API for media discovery, authentication, and payments. It is designed as a self-contained demo application for showcasing a streaming-style product architecture.

## Features

- Secure authentication with JWT-based sessions and cookie storage
- Signup, login, logout, OTP verification, and password reset flows
- Movie and TV browsing powered by TMDB APIs
- Watchlist support for saving favorite content
- Premium access flow integrated with Razorpay
- Responsive UI built with React, Tailwind CSS, and reusable UI components

## Tech Stack

### Frontend
- Next.js
- React
- Redux Toolkit
- Axios
- Tailwind CSS
- Shadcn UI components

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Nodemailer
- Razorpay
- TMDB API integration

## Project Structure

```text
backend/
  controllers/      API handlers
  models/           Mongoose models
  routes/           Express routes
  services/         TMDB, mail, and payment integrations
  config/           database configuration
  utils/            helpers

frontend/
  src/
    app/            Next.js app routes and pages
    components/     reusable UI components
    lib/            API helpers and common utilities
    providers/      auth and store providers
    redux/          Redux state setup
```

## Prerequisites

Before running the project, make sure you have:

- Node.js (recommended: LTS)
- npm
- A MongoDB instance or MongoDB Atlas connection

## Environment Variables

### Backend
Create a .env file in the backend folder:

```env
PORT=8080
NODE_ENV=development
DB_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret
```

### Frontend
Create a .env.local file in the frontend folder:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Running the Project

### Start the backend

```bash
cd backend
node server.js
```

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will typically run at http://localhost:3000 and the backend at http://localhost:8080.

## API Overview

The backend exposes REST endpoints under the /api namespace, including:

- /api/auth for authentication and password reset
- /api/user for profile and watchlist operations
- /api/discover for content discovery
- /api/movies for movie browsing and details
- /api/tv for TV show browsing and details
- /api/video for streaming-related endpoints
- /api/payment for Razorpay integration and premium access

## Notes

- The backend currently has CORS configured for a production frontend origin. If you are running locally or using a different domain, update the CORS origin in the backend server configuration.
- Some features depend on external services such as TMDB and Razorpay, so valid API credentials are required for full functionality.

## Contributing

Contributions are welcome. If you would like to improve the project, feel free to open an issue or submit a pull request.

## License

This project is currently unlicensed.
