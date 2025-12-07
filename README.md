## Project Name: Vehicle Rental System

Live URL: (https://vehicle-rental-system-hazel.vercel.app)

## Technology Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL** (database)
- **bcrypt** 
- **jsonwebtoken** 

---

### Features

- JWT-based Authentication & Role-Based Authorization (Admin & Customer).
- Secure password hashing with bcrypt.
- User Management with admin-level control and customer self-profile updates.
- Vehicle Management with real-time availability tracking.
- Public vehicle listing and detailed vehicle views.
- Booking system with automatic price calculation.
- Role-based booking access (Admin: all bookings, Customer: own bookings).
- Automatic vehicle status updates on booking and return.
- Validated booking dates with cancellation rules.
- PostgreSQL relational database .
- Modular backend architecture (Routes, Controllers, Services).
- Secure API with validation and protected endpoints.

 ### Setup & Usage Instructions

 At first clone the project using git :
 ```
git clone https://github.com/shakhawat-coder/vehicle-rental-system.git
```
 Move into the project using : 
 ```
 cd vehicle-rental-system
```

Install all dependencies :
```
npm install
```
Create a .env file and configure:
```
DATABASE_URL= Your neondb connection url
PORT = Listenign port
JWT_SECRET= "Your secret key"
```
Build the project (for TypeScript)
```
npm run build
```
Run the server:
```
npm run dev
```

API base URL:
```
http://localhost:5000/api/v1/
```
