# 🎨 Paras Arts

### Where Every Frame Remembers

**Paras Arts** is a full-stack digital art portfolio and custom sketch ordering platform developed for showcasing artwork, managing art services, and handling custom sketch commissions online.

The platform combines a professional artist portfolio with a functional business workflow that allows customers to explore artwork, view services, submit custom sketch requests, upload reference images, make advance payments, and track their orders.

---

## 🌐 Project Overview

Paras Arts was built as a real-world full-stack web application for an artist and creative business.

Instead of functioning only as a static portfolio, the platform provides functionality for both **customers and administrators**.

### Customers can:

* Explore the artist's portfolio
* View artwork details
* Browse available art services
* View starting prices
* Submit custom sketch orders
* Upload reference images
* Provide project requirements
* Make an advance payment
* Receive a unique tracking ID
* Track order progress
* Contact the artist
* Subscribe to updates

### Administrators can:

* Manage artworks
* Manage customer orders
* Verify payments
* Manage services and pricing
* Manage FAQs
* Manage testimonials
* View customer messages
* Manage newsletter subscribers

---

## ✨ Key Features

### 🎨 Digital Art Portfolio

The portfolio section provides a structured way to showcase the artist's work.

Features include:

* Artwork gallery
* Artwork categories
* Artwork details
* Featured artworks
* Artwork descriptions
* Medium information
* Responsive gallery
* Detailed artwork viewing

---

### 🛒 Custom Sketch Ordering

Customers can submit custom sketch requests directly through the website.

The order form supports:

* Name
* Email
* Phone
* WhatsApp
* Address
* Country
* Sketch type
* Paper size
* Budget
* Reference image
* Additional notes
* Preferred delivery date

After an order is successfully submitted, the customer receives a **Track ID** for monitoring the order.

---

## 📦 Order Management

Orders follow a structured workflow:

```text
Pending
   ↓
Accepted
   ↓
In Progress
   ↓
Completed
```

Orders can also be cancelled where applicable.

Payment status is managed separately:

```text
Pending
   ↓
Paid
   ↓
Verified
```

This separation allows order progress and payment verification to be managed independently.

---

## 🔎 Order Tracking

Customers can use their **Track ID** to check the current status of their custom sketch order.

The tracking workflow allows customers to see the progress of their commission without requiring direct database access or administrator involvement for every status check.

---

## 💰 Art Services

The platform currently includes services such as:

| Service                  | Starting Price |
| ------------------------ | -------------: |
| Custom Portrait – A4     |        ₹1,000+ |
| Couple Portrait          |        ₹3,000+ |
| Family Portrait          |        ₹5,000+ |
| Pet Portrait             |        ₹2,000+ |
| Car / Motorsports Sketch |        ₹4,000+ |
| A3 / A2 Artwork          |        +₹2,000 |

> Final pricing depends on artwork complexity, requirements, paper size, and other project-specific factors.

---

## 👨‍💼 Admin Panel

Paras Arts includes an administrative panel for managing website content and customer activity.

The admin system provides management for:

* 🎨 Artworks
* 📦 Orders
* 💳 Payments
* 🛠️ Services
* ❓ FAQs
* ⭐ Testimonials
* 📩 Customer Messages
* 📧 Newsletter Subscribers

Administrators can update relevant website and order information through the application instead of directly modifying database records.

---

## 🌍 Multilingual Support

The website supports multiple languages:

* 🇬🇧 English
* 🇮🇳 Marathi
* 🇮🇳 Hindi

The language selector allows visitors to switch between supported languages.

---

## 📱 Responsive Design

The website is designed for:

* 💻 Desktop
* 📱 Mobile
* 📲 Tablet

The interface adapts its layout and navigation according to screen size.

---

## 🔗 Communication & Engagement

The platform includes several ways for customers to interact with the artist:

* WhatsApp
* Email
* Instagram
* Contact form
* Newsletter subscription
* Website chatbot

The website also includes navigation utilities such as:

* Back-to-top button
* Responsive navigation
* Smooth page interactions

---

# 🏗️ System Architecture

```text
                       ┌───────────────────┐
                       │     Customer      │
                       └─────────┬─────────┘
                                 │
                                 ▼
                       ┌───────────────────┐
                       │  React Frontend   │
                       │      Vite         │
                       └─────────┬─────────┘
                                 │
                              REST API
                                 │
                                 ▼
                       ┌───────────────────┐
                       │  Express Backend  │
                       │     Node.js       │
                       └───────┬─────┬─────┘
                               │     │
                 ┌─────────────┘     └──────────────┐
                 ▼                                  ▼
        ┌─────────────────┐                ┌─────────────────┐
        │  MongoDB Atlas  │                │    Cloudinary   │
        │                 │                │                 │
        │ Orders          │                │ Artwork Images  │
        │ Artworks        │                │ Reference Files │
        │ Services        │                │                 │
        │ FAQs            │                └─────────────────┘
        │ Testimonials    │
        │ Messages        │
        │ Newsletter      │
        └─────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React 19
* Vite
* TanStack Router
* JavaScript
* HTML5
* CSS

## Backend

* Node.js
* Express.js
* REST APIs

## Database

* MongoDB Atlas

## Image & File Management

* Cloudinary
* Multer

## Development Tools

* Visual Studio Code
* Git
* GitHub

## Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database
* Cloudinary — Image storage

---

# 📂 Project Structure

The project is organized into frontend and backend components.

```text
Paras_arts/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── utils/
│   └── ...
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── ...
│
├── package.json
├── .gitignore
├── README.md
└── ...
```

> Update the structure above if your current repository differs.

---

# 🔌 Backend API

The backend provides REST API routes for the major application features.

Current route areas include:

```text
/api/auth
/api/artworks
/api/orders
/api/messages
/api/testimonials
/api/services
/api/faqs
/api/newsletter
/api/chat
/api/health
```

These APIs connect the frontend application with MongoDB and other backend services.

---

# 🗄️ Database

Paras Arts uses **MongoDB Atlas** for storing application data.

Major collections include:

```text
artworks
orders
services
faqs
testimonials
messages
newsletters
admins
```

The database stores structured information required by the portfolio, ordering system, administration panel, and customer communication features.

---

# 🖼️ Cloudinary Integration

Cloudinary is used for managing artwork and uploaded image assets.

The application supports image uploads through the backend and stores artwork assets in Cloudinary.

Artwork assets are organized under the project-specific Cloudinary structure.

---

# 🔄 Custom Order Workflow

The complete customer workflow can be represented as:

```text
Visit Paras Arts
       │
       ▼
Explore Services
       │
       ▼
Choose Sketch Type
       │
       ▼
Submit Order
       │
       ├── Reference Image
       ├── Customer Details
       ├── Sketch Requirements
       └── Additional Notes
       │
       ▼
Advance Payment
       │
       ▼
Track ID Generated
       │
       ▼
Admin Reviews Order
       │
       ▼
Accepted
       │
       ▼
In Progress
       │
       ▼
Completed
```

---

# 💳 Payment Workflow

The platform supports an advance-payment workflow for custom sketch orders.

The customer can make the required advance payment and provide the relevant payment information.

The administrator can then review and verify the payment from the admin panel.

```text
Order Submitted
      ↓
Payment Pending
      ↓
Payment Made
      ↓
Payment Verification
      ↓
Payment Verified
```

---

# 🤖 Related AI Project

The Paras Arts platform is also being extended with a separate **AI-powered data agent**.

The AI agent connects with approved Paras Arts business data and provides natural-language analysis and controlled data operations.

### Paras Arts AI Data Agent

The agent can assist with:

* Order analysis
* Payment analysis
* Sketch-type analysis
* Budget analysis
* Artwork analysis
* Service analysis
* FAQ analysis
* Business summaries
* Controlled data updates

### Technology

```text
Python
FastAPI
MongoDB
Gemini
Generative AI
Tool-based Agent Architecture
```

👉 **AI Agent Repository:**
[View Paras Arts AI Data Agent](YOUR_AI_AGENT_REPOSITORY_URL)

---

# 🖥️ Screenshots

Add screenshots of the actual application here.

## Home Page

![Paras Arts Home](./screenshots/home.png)

## Portfolio

![Paras Arts Portfolio](./screenshots/portfolio.png)

## Order Sketch

![Paras Arts Order Sketch](./screenshots/order-sketch.png)

## Track Order

![Paras Arts Track Order](./screenshots/track-order.png)

## Admin Panel

![Paras Arts Admin Panel](./screenshots/admin-panel.png)

> Replace the paths above with the actual screenshot locations in your repository.

GitHub supports relative image paths in README files, so keeping project screenshots inside the repository makes the README portable when the repository is cloned.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB Atlas account
* Cloudinary account

---

## 1. Clone the Repository

```bash
git clone YOUR_PARAS_ARTS_REPOSITORY_URL
```

## 2. Navigate to the Project

```bash
cd paras-arts
```

## 3. Install Dependencies

```bash
npm install
```

If the frontend and backend have separate dependency configurations, install the required dependencies in their respective directories.

---

# 🔐 Environment Variables

Create the required `.env` files locally.

Example frontend configuration:

```env
VITE_API_URL=your_backend_api_url
```

Example backend configuration:

```env
MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

PORT=5000
```

> **Never commit real API keys, database credentials, passwords, or other secrets to GitHub.**

For a public repository, GitHub recommends security features such as secret scanning, push protection, Dependabot alerts, and code scanning where applicable.

---

# ▶️ Run Locally

Start the backend:

```bash
npm run server
```

Start the frontend:

```bash
npm run dev
```

The exact commands may vary depending on the scripts defined in the current `package.json`.

---

# 🎯 Project Goals

The main goals of Paras Arts are to:

* Build a professional digital presence for an artist
* Showcase artwork through a structured portfolio
* Provide an online custom sketch ordering workflow
* Allow customers to submit reference images
* Provide order tracking
* Centralize order and website management
* Reduce manual business-management work
* Provide a foundation for future AI-powered features

---

# 🧠 What I Worked On

This project provided practical experience with:

* Full-stack web development
* React application development
* REST API development
* MongoDB database integration
* Cloudinary image management
* Authentication and admin functionality
* Form handling
* File uploads
* Order-management workflows
* Payment-status management
* Responsive UI development
* API integration
* Deployment
* Debugging frontend/backend integration issues

The project was developed iteratively, with features being tested and refined based on the requirements of the actual Paras Arts platform.

---

# 🔮 Future Improvements

Potential improvements include:

* More advanced business analytics
* Improved customer notifications
* Online payment gateway integration
* Enhanced AI-powered assistance
* Advanced artwork search
* Personalized artwork recommendations
* Customer order history
* More detailed admin analytics
* Improved image processing
* Additional automation

---

# 📌 Project Status

**Status:** 🟢 Active / Maintained

Paras Arts is an evolving project, with additional improvements and AI-powered functionality being developed as part of the broader Paras Arts ecosystem.

---

# 👨‍💻 Developer

## Paras Kosambe

**B.Sc. Computer Science Student**

Aspiring Data Scientist | AI/ML | Python | SQL | Web Development

Paras Arts is a practical full-stack project developed to combine **creative work with software engineering and real-world business functionality**.

---

# 🔗 Related Projects

### 🎨 Paras Arts Website

This repository.

A full-stack digital art portfolio and custom sketch ordering platform.

### 🤖 Paras Arts AI Data Agent

AI-powered data analysis and business intelligence agent developed as an extension of the Paras Arts platform.

👉 [View AI Agent Repository](https://github.com/paraskosambe-web/paras-arts-ai-agent.git)

---

# 📄 License

This project is currently intended for personal portfolio, educational, and demonstration purposes.

The **Paras Arts** brand, artwork, logo, and original creative assets belong to the respective creator.

---

## ⭐ Acknowledgements

The project was developed using modern web-development technologies and AI-assisted development tools during the development process.

AI-assisted tools were used as part of the development workflow, while the application was customized, integrated, tested, debugged, and developed around the specific requirements of the Paras Arts platform.

---

### 🎨 Paras Arts

**Where Every Frame Remembers.**

© 2026 Paras Arts
