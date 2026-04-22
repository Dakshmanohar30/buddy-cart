# Buddy-Cart 🛒

A real-time, in-store collaborative shopping platform designed to help physical shoppers combine their purchases, unlock bulk merchant discounts, and dynamically split the final bill. 

When shoppers are in the same physical store but don't individually meet the threshold for volume deals (e.g., "Buy 2 Get 1 Free" or "$50 Off Orders Over $200"), Buddy-Cart allows them to join a shared digital session. Users can collaboratively add items to a synchronized cart, apply custom merchant offers, and let the application calculate a fair, proportionate split of the discounted total based on exactly what each person contributed.

## 🚀 Key Features

* **Real-Time Cart Synchronization:** Multiple users can add, remove, or modify items simultaneously with zero-latency updates across all connected devices in the session.
* **Dynamic Bill Splitting:** An automated calculator that proportionally distributes savings and taxes based on individual item ownership within the shared cart.
* **In-Store Session Matching:** Live room creation for users currently shopping in the same physical location.
* **Live Social Chat:** Integrated websocket-based chat for users to coordinate within their shared session.
* **Modern UI/UX:** A highly responsive, dark-mode focused interface utilizing glassmorphism design patterns for a premium feel.

## 💻 Tech Stack

* **Frontend:** Next.js, React.js
* **Styling:** Tailwind CSS
* **Real-Time Communication:** Socket.io
* **Database:** MongoDB
* **Backend:** Node.js / Express 

## 🏗️ Architecture & Engineering Decisions

Building a real-time collaborative cart required solving several complex state management and synchronization challenges:

* **Solving Websocket Race Conditions:** Initially, the application utilized optimistic frontend UI updates, which caused race conditions and duplicated items when multiple users modified the cart at the exact same millisecond. To resolve this, I architected a strict **authoritative backend queue**. The frontend now only emits "intent" events, while the backend processes requests sequentially and broadcasts the finalized, single-source-of-truth state back to all clients.
* **Flexible Data Modeling with NoSQL:** I chose **MongoDB** to handle the application's data layer. Its document-based structure is ideal for managing highly nested, dynamic data objects like active room sessions, varying item ownership arrays, and custom merchant discount rules, which would require overly complex joins in a rigid relational database.
* **Optimized Frontend Rendering:** Leveraged **Next.js** to provide a performant foundation for the React components, ensuring that the rapid UI re-renders triggered by the Socket.io events remain smooth and efficient across mobile devices.

## 🛠️ Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/Dakshmanohar30/buddy-cart.git](https://github.com/Dakshmanohar30/buddy-cart.git)
cd buddy-cart

# Install frontend dependencies
npm install

# Install backend dependencies (if separated)
cd backend 
npm install

MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_SOCKET_URL=http://localhost:your_port

npm run dev
