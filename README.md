# Stream

Stream is a full-stack streaming web application built with a Next.js frontend and an Express.js + MongoDB backend. It allows users to browse movies and TV content, manage a watchlist, sign in securely, reset passwords, access premium subscription features through Razorpay, and watch content together in real time.

## Overview

The project combines a streaming catalog with authentication, payments, video delivery, comments, and real-time watch rooms. The application currently contains both TMDB-powered movie/TV discovery and a `Stream+` catalog backed by Cloudflare R2.

## Features

- Secure authentication with JWT-based sessions and cookie storage
- Signup, login, logout, OTP verification, and password reset flows
- Movie and TV browsing powered by TMDB APIs
- `Stream+` catalog with categorized video listings, thumbnails, and playback
- Cloudflare R2 integration for video storage and signed media access
- Watchlist support for saving favorite content
- Premium access flow integrated with Razorpay
- Watch parties with authenticated Socket.IO rooms, synchronized host playback, participant presence, and room chat
- Comments for `Stream+` video pages
- Responsive UI built with React, Tailwind CSS, reusable UI components, carousels, and animated loading states

## Tech Stack

### Frontend
- Next.js 16
- React 19
- Redux Toolkit
- Axios
- Tailwind CSS
- Shadcn/Base UI components
- Socket.IO client
- Video.js

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Brevo email delivery
- Razorpay
- TMDB API integration
- Socket.IO
- AWS SDK for Cloudflare R2
- Jest and Socket.IO client tests

## Project Structure

```text
backend/
  controllers/      API handlers
  models/           Mongoose models
  routes/           Express routes
  services/         TMDB and mail integrations
  config/           database configuration
  tests/            backend tests
  utils/            helpers

frontend/
  src/
    app/            Next.js app routes and pages
    components/     reusable UI components
    lib/            API helpers and common utilities
    providers/      auth and store providers
    redux/          Redux state setup
    app/watch-room/ real-time watch party experience
    components/
      comment-section/
                    Stream+ comments UI
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
FRONTEND_URL=http://localhost:3000
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_r2_bucket_name
KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret
SENDER_EMAIL=your_sender_email
BREVO_API_KEY=your_brevo_api_key
BREVO_EMAIL=your_brevo_email
BREVO_SMTP_KEY=your_brevo_smtp_key
```

TMDB access is required for movie and TV discovery. Configure the TMDB credential used by the backend service before enabling those features.

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

### Run backend tests

```bash
cd backend
npm test
```

## API Overview

The backend exposes REST endpoints under the /api namespace, including:

- /api/auth for authentication and password reset
- /api/user for profile and watchlist operations
- /api/discover for content discovery
- /api/rooms for watch-party room creation and management
- /api/movies for movie browsing and details
- /api/tv for TV show browsing and details
- /api/video for the `Stream+` catalog, thumbnails, and video streaming
- /api/comments for `Stream+` comments
- /api/payment for Razorpay integration and premium access

Socket.IO is served by the backend and requires an authenticated JWT session. Watch-room clients use it for room presence, synchronized host playback, and chat.

## Notes

- The backend accepts `FRONTEND_URL` and `http://localhost:3000` as CORS origins.
- Video playback requires a configured Cloudflare R2 bucket and credentials.
- Some features depend on external services such as TMDB, Brevo, Cloudflare R2, and Razorpay, so valid credentials are required for full functionality.
- The application is still under active development; production deployment, media access policies, and operational configuration may require additional hardening.

## Contributing

Contributions are welcome. If you would like to improve the project, feel free to open an issue or submit a pull request.

## License

This project is currently unlicensed.
