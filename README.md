# 🚚 Last-Mile Delivery Tracker System

A complete role-based logistics order management platform featuring dynamic rate card engines, nearest available agent auto-assignment, immutable tracking history, and failed delivery recovery workflows.

---

## 🌟 Key Features

1. **Role-Based Authentication & Access Control (RBAC)**:
   - `CUSTOMER`: Create orders, preview rate quotes, track live status timeline, reschedule failed deliveries.
   - `DELIVERY_AGENT`: View assigned tasks, update location coordinates, update delivery status, report failures.
   - `ADMIN`: Platform telemetry, rate card engine manager, zone & area manager, agent monitoring, order filtering & manual override.

2. **⭐ Dynamic Rate Calculation Engine**:
   - **Pickup / Drop Zone Detection**: Maps addresses/pincodes to Zones (`ZONE_BHOPAL`, `ZONE_INDORE`).
   - **Zone Type**: `INTRA_ZONE` (same zone) vs `INTER_ZONE` (different zones).
   - **Volumetric Weight**: Formula `(Length × Breadth × Height) / 5000`.
   - **Billable Weight**: Formula `MAX(actualWeight, volumetricWeight)`.
   - **Rate Card Lookup**: Matches database rate cards by Order Type (`B2B` vs `B2C`), Zone Type, and Weight Slab.
   - **COD Surcharge**: Configurable Cash-On-Delivery surcharge rules.

3. **⭐ Intelligent Agent Assignment**:
   - Haversine distance formula to auto-assign nearest `AVAILABLE` agent in pickup zone.
   - Admin manual assignment override.

4. **⭐ Immutable Tracking History & State Machine**:
   - Strict transition rules (`CREATED` ➔ `ASSIGNED` ➔ `PICKED_UP` ➔ `IN_TRANSIT` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` / `FAILED` ➔ `RESCHEDULED`).
   - Immutable log of all events recording timestamp, actor, role, lat/long, and remarks.

5. **⭐ Failed Delivery & Rescheduling Workflow**:
   - Failure reporting with mandatory reason (`CUSTOMER_UNAVAILABLE`, `WRONG_ADDRESS`, etc.).
   - Agent unassigned, customer alerted, customer chooses new date, automatic reassignment to a new agent.

---

## 🛠️ Technology Stack

- **Backend**: Java 21+ / Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, H2 Database (PostgreSQL mode) / PostgreSQL, Lombok, OpenAPI / Swagger.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Leaflet / OpenStreetMap.

---

## 🚀 Quick Start Instructions

### Prerequisites
- Java 17+ or Java 21+
- Node.js v18+ and npm

### 1. Run Backend (Spring Boot API)
```bash
cd backend
# Build and run with embedded H2 PostgreSQL mode
./mvnw spring-boot:run
```
Backend API will start at `http://localhost:8080`.
- Swagger API Documentation: `http://localhost:8080/swagger-ui.html`
- H2 Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:deliverydb`, User: `sa`, Password: empty)

### 2. Run Frontend (React SPA)
```bash
cd frontend
npm install
npm run dev
```
Frontend Web UI will start at `http://localhost:3000`.

---

## 🔑 Demo Accounts

The system automatically seeds the database with the following demo accounts on initial startup:

| Role | Email | Password | Details |
|---|---|---|---|
| **ADMIN** | `admin@demo.com` | `password` | System Administrator |
| **CUSTOMER** | `customer@demo.com` | `password` | Demo Customer (Acme Retail) |
| **DELIVERY AGENT (Bhopal)** | `agent1@demo.com` | `password` | Agent AGT-101 (Bhopal Zone) |
| **DELIVERY AGENT (Indore)** | `agent2@demo.com` | `password` | Agent AGT-102 (Indore Zone) |

*(You can also use the **Quick Demo Switcher** buttons on the login screen or top navbar to seamlessly switch roles!)*

---

## 📊 End-to-End Delivery Lifecycle Workflow

```text
CUSTOMER CREATES ORDER (Bhopal ➔ Indore, 50x40x30cm, 8kg, B2C, COD)
                     │
                     ▼
       RATE ENGINE CALCULATES QUOTE
Volumetric Wt: (50×40×30)/5000 = 12kg
Billable Wt: MAX(8kg, 12kg) = 12kg
Base Freight: ₹180 | COD Surcharge: ₹30 ➔ Total: ₹210
                     │
                     ▼
     CUSTOMER CONFIRMS ➔ ORDER CREATED
                     │
                     ▼
  AUTO-ASSIGN NEAREST AVAILABLE AGENT (AGT-101)
                     │
                     ▼
     AGENT MARKS: PICKED UP ➔ IN TRANSIT
                     │
                     ▼
         AGENT MARKS: DELIVERY FAILED
 (Reason: CUSTOMER_UNAVAILABLE) ➔ AGENT RELEASED
                     │
                     ▼
 CUSTOMER RECEIVES NOTIFICATION & RESCHEDULES DATE
                     │
                     ▼
NEW AVAILABLE AGENT REASSIGNED ➔ PICKED UP ➔ DELIVERED
                     │
                     ▼
     IMMUTABLE AUDIT TIMELINE PERSISTED
```

---

## 📝 API Endpoints Summary

- `POST /api/v1/auth/login` - User Login (returns JWT token)
- `POST /api/v1/auth/register` - User Registration
- `POST /api/v1/orders/quote` - Preview volumetric rate quote
- `POST /api/v1/orders` - Create order & trigger auto-assignment
- `GET /api/v1/orders/my` - Get customer's orders
- `GET /api/v1/orders/{id}/tracking` - Get immutable event timeline
- `POST /api/v1/orders/{id}/reschedule` - Reschedule failed delivery
- `GET /api/v1/agent/orders` - Get agent's assigned delivery tasks
- `PATCH /api/v1/agent/location` - Update agent GPS & availability
- `PATCH /api/v1/orders/{id}/status` - Update delivery status
- `POST /api/v1/orders/{id}/fail` - Report delivery failure
- `GET /api/v1/admin/orders` - Admin order search & filters
- `POST /api/v1/admin/orders/{id}/assign` - Admin manual agent assignment
- `GET /api/v1/admin/rates` - Configurable rate cards
