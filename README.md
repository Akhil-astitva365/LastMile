# LAST MILE - Delivery Tracker Platform

A modern, role-based last-mile logistics management platform featuring AI Autonomous Dispatch Agent Mode, Haversine Geodesic Distance-Based Pricing Engine, Nearest-Agent Auto-Assignment, Immutable Telemetry Tracking, and Failed Delivery Reschedule Recovery.

---

## Key Features

1. **AI Autonomous Dispatch Agent Mode**:
   - One-click natural language prompt processing (`POST /api/v1/ai/create-order`).
   - Extracts pickup/drop locations, dimensions, weight, B2B/B2C order types, and payment modes automatically.
   - Instantly calculates distance-based fare, creates the order, auto-assigns the nearest field agent, and dispatches multi-channel notifications.

2. **Haversine Geodesic Distance Pricing Engine**:
   - Geocodes pickup & drop addresses into real GPS latitude & longitude coordinates.
   - Computes exact trip distance in kilometers ($\text{d} = 2R \cdot \arcsin(\dots)$).
   - Calculates volumetric weight $\text{Volumetric} = \frac{L \times B \times H}{5000}$ and bills on $\max(\text{actual}, \text{volumetric})$.
   - Adds dynamic per-km distance fees (Intra-Zone & Inter-Zone) and Cash-On-Delivery surcharges.

3. **Role-Based Authentication & Access Control (RBAC)**:
   - **`CUSTOMER`**: Create orders, preview volumetric rate quotes, track live status timeline on 16:9 interactive Leaflet Google Maps, and reschedule failed deliveries.
   - **`DELIVERY_AGENT`**: Full delivery task queue access, one-click status transitions (`Accept & Dispatch` -> `Pick Up` -> `In Transit` -> `Out for Delivery` -> `Delivered`), and live GPS updates.
   - **`ADMIN`**: Platform telemetry, rate card & COD surcharge manager, zone manager, agent monitoring, order filtering, manual agent assignment, and auto-assign trigger.

4. **Proximity Auto-Assignment**:
   - Haversine distance proximity search matches available field agents (`John Agent (Bhopal)`) in the pickup zone and updates status to `DISPATCHED`.

5. **Immutable Telemetry Tracking History**:
   - Strict lifecycle transitions (`CREATED` -> `DISPATCHED` -> `PICKED_UP` -> `IN_TRANSIT` -> `OUT_FOR_DELIVERY` -> `DELIVERED` / `FAILED_DELIVERY` -> `RESCHEDULED`).
   - Immutable log recording timestamp, actor role, lat/long coordinates, and remarks.

6. **Failed Delivery Recovery & Rescheduling**:
   - Capture failure reasons (`CUSTOMER_UNAVAILABLE`, `WRONG_ADDRESS`, `WEATHER_ISSUE`, etc.) with `@JsonCreator` enum deserialization.
   - Customer picks new delivery date, system releases failed agent, and auto-reassigns a fresh agent for the rescheduled attempt.

7. **Glassmorphism UI & Clean Location Autocomplete**:
   - Google Font `Syne` logo header, borderless glass card system (`border: none !important`), and real-time Pan-India location search without `Custom Location` prefixes.

---

## Technology Stack

- **Backend**: Java 21 / Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, H2 Database (PostgreSQL mode), Lombok, Swagger OpenAPI.
- **Frontend**: React 18, TypeScript, Vite, Vanilla CSS + Glassmorphism, Google Font `Syne`, Lucide Icons, Leaflet / OpenStreetMap.

---

## Quick Start Instructions

### Prerequisites
- Java 17+ or Java 21+
- Node.js v18+ and npm

### 1. Run Backend (Spring Boot API)
```bash
cd backend
./mvnw spring-boot:run
```
Backend API starts at `http://localhost:8080`.
- Swagger API Docs: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:deliverydb`, User: `sa`, Password: empty)

### 2. Run Frontend (React SPA)
```bash
cd frontend
npm install
npm run dev
```
Frontend Web UI starts at `http://localhost:3000`.

---

## Demo Accounts

The database is automatically seeded with demo accounts on initial startup:

| Role | Email | Password | Assigned Region |
|---|---|---|---|
| **ADMIN** | `admin@demo.com` | `password` | System Administrator |
| **CUSTOMER** | `customer@demo.com` | `password` | Demo Customer (Alex Customer) |
| **DELIVERY AGENT** | `agent1@demo.com` | `password` | Agent AGT-101 (Bhopal Zone) |
| **DELIVERY AGENT** | `agent2@demo.com` | `password` | Agent AGT-102 (Indore Zone) |

---

## End-to-End Delivery Lifecycle Workflow

```text
PROMPT / FORM INPUT (Bhopal -> Indore, 50x40x30cm, 8kg, B2C, COD)
                     |
                     v
       DYNAMIC DISTANCE & RATE ENGINE
Distance: ~170 km | Volumetric Wt: 12kg | Billable Wt: 12kg
Weight Charge: RS 180 | Distance Charge: RS 425 | COD Surcharge: RS 30 -> Total: RS 635
                     |
                     v
      ORDER CREATED & AUTO-DISPATCHED
                     |
                     v
   AUTO-ASSIGN NEAREST AVAILABLE AGENT (AGT-101)
                     |
                     v
     AGENT MARKS: PICKED UP -> IN TRANSIT
                     |
                     v
         AGENT MARKS: DELIVERY FAILED
 (Reason: CUSTOMER_UNAVAILABLE) -> AGENT RELEASED
                     |
                     v
 CUSTOMER RECEIVES NOTIFICATION & RESCHEDULES DATE
                     |
                     v
NEW AVAILABLE AGENT REASSIGNED -> OUT FOR DELIVERY -> DELIVERED
                     |
                     v
     IMMUTABLE AUDIT TIMELINE PERSISTED
```

---

## Key API Endpoints

- `POST /api/v1/auth/login` - User authentication (returns JWT token)
- `POST /api/v1/auth/register` - Customer registration
- `POST /api/v1/ai/create-order` - AI Autonomous Order Creation & Dispatch
- `POST /api/v1/orders/quote` - Preview distance & volumetric rate quote
- `POST /api/v1/orders` - Create order & trigger auto-assignment
- `GET /api/v1/orders/my` - Get orders (sorted newest-first)
- `GET /api/v1/orders/{id}/tracking` - Get immutable event timeline
- `POST /api/v1/orders/{id}/reschedule` - Reschedule failed delivery
- `GET /api/v1/agent/orders` - Get agent's delivery task queue
- `PATCH /api/v1/orders/{id}/status` - Update delivery status
- `POST /api/v1/admin/orders/{id}/auto-assign` - Admin trigger auto-assignment
- `POST /api/v1/admin/orders/{id}/manual-assign` - Admin manual agent assignment
- `GET /api/v1/admin/rates` - Configurable rate cards & COD surcharges
