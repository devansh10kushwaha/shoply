# Shoply — Dual-Role Mobile Commerce Platform

Shoply is a dual-role mobile commerce application developed using React Native and Expo. It provides separate experiences for customers and suppliers, with features including product browsing, cart management, order management, supplier inventory, analytics, and real-time customer support chat.

## APK

Download and install the Android APK:

[Download Shoply APK](https://expo.dev/accounts/sarcastic_here/projects/dual-role-commerce/builds/5d1e5d03-1aa8-488b-9599-56dcf3f1fce3)

youtube link - (https://youtube.com/shorts/kbEzp7Qc9CY?si=-R8g2rnjILB_9_yZ)

> Android APK built using Expo Application Services (EAS).

## Features

### Customer Module

- Customer authentication
- Product browsing
- Product details
- Add products to cart
- Increase/decrease product quantity
- Swipe-to-delete cart items
- Cart total calculation
- Order management
- Customer profile
- Real-time customer support chat
- Android keyboard and safe-area support

### Supplier Module

- Supplier dashboard
- Inventory management
- Product management
- Sales and inventory analytics
- Supplier-side chat
- Separate supplier workflow

### Real-Time Chat

Shoply uses Socket.IO for real-time customer-support communication.

- Real-time messaging
- Customer-support chat room
- Message history
- Customer and supplier communication
- WebSocket-based communication
- Node.js Socket.IO server

## Technology Stack

### Frontend

- React Native
- Expo
- TypeScript
- Expo Router
- React Native Gesture Handler
- Ionicons

### Backend

- Node.js
- Socket.IO
- HTTP Server
- JSON-based message persistence

### Tools

- npm
- Git
- GitHub
- Expo EAS
- Android APK

## Project Structure

```text
shoply/
│
├── assets/
│
├── server/
│   ├── data/
│   │   └── messages.json
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── app/
│   │   ├── auth/
│   │   ├── customer/
│   │   │   ├── product/
│   │   │   ├── cart.tsx
│   │   │   ├── chat.tsx
│   │   │   ├── index.tsx
│   │   │   ├── orders.tsx
│   │   │   └── profile.tsx
│   │   │
│   │   ├── supplier/
│   │   │   ├── analytics.tsx
│   │   │   ├── chat.tsx
│   │   │   ├── index.tsx
│   │   │   └── inventory.tsx
│   │   │
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   │
│   ├── data/
│   ├── services/
│   │   └── socket.ts
│   ├── store/
│   │   ├── cartStore.tsx
│   │   ├── chatStore.tsx
│   │   ├── productStore.tsx
│   │   └── sessionStore.tsx
│   │
│   └── types/
│
├── app.json
├── eas.json

## Application Architecture

                         SHOPLY
                           │
             ┌─────────────┴─────────────┐
             │                           │
        CUSTOMER                     SUPPLIER
             │                           │
     ┌───────┼────────┐          ┌───────┼────────┐
     │       │        │          │       │        │
 Products   Cart    Orders   Inventory Analytics Chat
     │       │        │          │       │        │
     └───────┴────────┘          └───────┴────────┘
             │                           │
             └─────────────┬─────────────┘
                           │
                       Socket.IO
                           │
                           ▼
                    Node.js Server
                           │
                           ▼
                     messages.json
├── package.json
└── README.md
