🎨 Paras Arts
Where Every Frame Remembers

Paras Arts is a full-stack digital art portfolio and custom sketch ordering platform built for showcasing artwork, managing commissions, and providing customers with a simple way to explore services and place sketch orders online.

The project combines a modern artist portfolio with a functional order-management system, allowing customers to browse artworks and services, submit custom sketch requests, make advance payments, and track their order status.

> Live Website: paras-arts.vercel.app
> Repository:

---

📌 About the Project

Paras Arts was developed as a real-world portfolio and business platform for a digital artist.

Instead of being only a static portfolio, the system provides functionality for both **customers and administrators**.

Customers can:

* Explore the artist's portfolio
* View available art services
* Check pricing information
* Submit custom sketch orders
* Upload reference images
* Provide order requirements
* Make the required advance payment
* Receive an order tracking ID
* Track the progress of their order
* Contact the artist
* Subscribe to updates

The administrator can manage the website's content and customer orders through the admin panel.


✨ Key Features

🎨 Portfolio

* Browse artwork collections
* Artwork categories and details
* Featured artwork management
* Artwork image management
* Responsive gallery interface
* Detailed artwork information

🛍️ Custom Sketch Ordering

Customers can submit custom sketch requests with information such as:

* Customer name
* Email
* Phone number
* WhatsApp number
* Address
* Country
* Sketch type
* Paper size
* Budget
* Reference image
* Additional notes
* Preferred delivery date

After submitting an order, the customer receives a **Track ID** that can be used to monitor the order.

📦 Order Tracking

Orders move through defined stages:


Pending
   ↓
Accepted
   ↓
In Progress
   ↓
Completed

The system also supports cancelled orders where applicable.

Payment information is maintained separately from the order status:

text
Payment Pending
Payment Paid
Payment Verified


---

💰 Art Services

The platform currently supports services such as:

| Service                  |     Starting Price |
| ------------------------ | -----------------: |
| Custom Portrait – A4     |            ₹1,000+ |
| Couple Portrait          |            ₹3,000+ |
| Family Portrait          |            ₹5,000+ |
| Pet Portrait             |            ₹2,000+ |
| Car / Motorsports Sketch |            ₹4,000+ |
| A3 / A2 Artwork          | Additional ₹2,000+ |

> Final pricing depends on artwork complexity, requirements, paper size, and other project-specific factors.

---

👨‍💼 Admin Panel

Paras Arts includes an administrative dashboard for managing website data and customer interactions.

The admin panel provides management for:

* 🎨 Artworks
* 📦 Orders
* 💳 Payments
* 🛠️ Services
* ❓ FAQs
* ⭐ Testimonials
* 📩 Customer Messages
* 📧 Newsletter Subscribers

Administrators can also update relevant order and website information without directly modifying the database.

---

🌐 Website Sections

The website includes:

* Home
* About
* Portfolio
* Artwork Details
* Services
* Order Sketch
* Testimonials
* Track Order
* FAQ
* Contact
* Admin Panel

Additional functionality includes:

* Responsive navigation
* Multilingual interface
* Newsletter subscription
* Customer messaging
* Social media integration
* WhatsApp integration
* Email integration
* Back-to-top functionality
* Responsive design for desktop, tablet, and mobile

---

🌍 Multilingual Support

The website provides language options for:

* 🇬🇧 English
* 🇮🇳 Marathi
* 🇮🇳 Hindi

This allows the platform to be more accessible to a wider audience.

---

🖼️ Image Management

Artwork images and uploaded assets are handled through **Cloudinary**.

The backend uses controlled image uploads with file-size validation before storing artwork assets.

---

🏗️ System Architecture

The project follows a full-stack architecture:

```text
                    ┌─────────────────────┐
                    │     Customer        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      (Vite)         │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │       Node.js       │
                    └──────┬───────┬──────┘
                           │       │
              ┌────────────┘       └─────────────┐
              ▼                                  ▼
      ┌─────────────────┐                ┌───────────────┐
      │ MongoDB Atlas   │                │   Cloudinary  │
      │                 │                │               │
      │ Orders          │                │ Artwork       │
      │ Artworks        │                │ Images        │
      │ Services        │                │ Uploads       │
      │ FAQs            │                └───────────────┘
      │ Testimonials    │
      │ Messages        │
      │ Newsletter      │
      └─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* React 19
* Vite
* TanStack Router
* JavaScript
* HTML5
* CSS

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB Atlas

### Image Storage

* Cloudinary
* Multer

### Development

* Visual Studio Code
* Git
* GitHub

### Deployment

* Vercel – Frontend
* Render – Backend
* MongoDB Atlas – Database
* Cloudinary – Image Storage

---

## 📂 Project Structure

The project is organized into separate frontend and backend components.

```text
Paras_arts/
│
├── client/
│   ├── src/
│   ├── public/
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
├── README.md
└── ...
```

> Update this structure if your current repository uses a different folder organization.

---

## 🔌 Backend API

The backend provides API routes for major website functionality, including:

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

These APIs connect the frontend interface with the database and other backend services.

---

## 🔄 Order Workflow

The custom sketch ordering process follows this general workflow:

```text
Customer
   │
   ▼
Select Sketch Service
   │
   ▼
Submit Order + Reference Image
   │
   ▼
Advance Payment
   │
   ▼
Order Created
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

This workflow allows the website to function as an actual commission-ordering platform rather than only an online portfolio.

---

## 🔐 Environment Variables

Create a `.env` file according to the environment variables required by the project.

Example:

```env
MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

PORT=5000
```

> Never commit real API keys, database credentials, passwords, or other secrets to GitHub.

GitHub recommends using security features such as secret scanning and push protection to help prevent credentials from being committed accidentally.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to the project

```bash
cd Paras_arts
```

### 3. Install dependencies

```bash
npm install
```

If the frontend and backend use separate package files, install dependencies in their respective directories:

```bash
cd client
npm install

cd ../server
npm install
```

### 4. Configure environment variables

Create the required `.env` files and add your MongoDB, Cloudinary, and other configuration values.

### 5. Start the development server

```bash
npm run dev
```

If the frontend and backend run separately, start each application according to its package configuration.

---

## 📸 Screenshots

Add screenshots of the actual implemented website here.

### Home Page

![Paras Arts Home Page](./screenshots/home.png)

### Portfolio

![Paras Arts Portfolio](./screenshots/portfolio.png)

### Order Sketch

![Paras Arts Order Sketch](./screenshots/order-sketch.png)

### Admin Panel

![Paras Arts Admin Panel](./screenshots/admin.png)

> Replace the image paths above with the screenshots available in your repository.

---

## 🎯 Project Goals

The main goals of Paras Arts are to:

* Build a professional digital presence for an artist
* Showcase artwork in an organized portfolio
* Provide a structured custom-order workflow
* Reduce manual order-management work
* Allow customers to track their commissions
* Provide centralized administration of website content
* Create a scalable foundation for future features

---

## 🔮 Future Improvements

Possible future improvements include:

* Enhanced AI-powered customer assistance
* More advanced artwork search
* Improved analytics dashboard
* Automated customer notifications
* Online payment gateway integration
* Advanced order analytics
* Better recommendation systems
* Improved image processing
* More detailed customer order history

---

## 🤖 Related Project: Paras Arts AI Data Agent

A separate AI-powered data agent is being developed alongside the Paras Arts platform.

The agent is designed to interact with approved website data and assist with tasks such as:

* Order analysis
* Payment analysis
* Artwork analysis
* Service analysis
* FAQ analysis
* Business summaries
* Controlled data updates

The AI agent is being developed as an extension of the Paras Arts ecosystem and is currently undergoing testing and improvement.

---

## 👨‍💻 Developer

**Paras Kosambe**

B.Sc. Computer Science Student
Aspiring Data Scientist | AI/ML | Python | SQL | Web Development

Paras Arts was developed as a practical full-stack project combining **creative design, web development, database management, and real-world business functionality**.

---

## 📄 License

This project is currently intended for personal portfolio and educational purposes.

All artwork, branding, logos, and original creative assets associated with Paras Arts belong to the respective creator.

---

## ⭐ Acknowledgements

This project was developed and iteratively improved using modern web development tools and technologies.

The project may have used AI-assisted development tools during the development process, but the application has been customized, integrated, tested, and developed around the specific requirements of the Paras Arts platform.

---

### © 2026 Paras Arts — Where Every Frame Remembers
