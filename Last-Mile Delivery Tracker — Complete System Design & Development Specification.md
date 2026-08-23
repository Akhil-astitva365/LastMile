 # 🚚 Last-Mile Delivery Tracker

## 1. Project Overview

The **Last-Mile Delivery Tracker** is a role-based delivery management platform designed to automate the complete lifecycle of a logistics order.

The platform allows:

- Customers to create delivery orders.
- Admins to create orders on behalf of customers.
- Automatic pickup/drop-zone detection.
- Automatic calculation of billable weight.
- Dynamic B2B/B2C pricing.
- COD surcharge calculation.
- Intelligent delivery-agent assignment.
- Real-time order status tracking.
- Immutable delivery tracking history.
- Failed-delivery and rescheduling workflows.
- Email/SMS notifications.
- Administrative monitoring and overrides.

The original problem requires pickup/drop addresses, package dimensions, actual weight, B2B/B2C order type and Prepaid/COD payment type as order inputs, with an automatically calculated charge, agent assignment, tracking status and notifications as outputs.

---

# 2. Recommended Technology Stack

## Backend

**Java 21 + Spring Boot 3.x**

### Core dependencies

- Spring Web
- Spring Data JPA
- Spring Security
- Spring Validation
- Spring Mail
- PostgreSQL Driver
- JWT
- Lombok
- MapStruct
- Flyway
- OpenAPI / Swagger
- Actuator

### Optional

- Redis
- WebSocket
- Spring Scheduler
- Docker

---

# 3. Frontend

## Recommended

**React + TypeScript + Vite**

### Libraries

- React Router
- Axios
- TanStack Query
- Tailwind CSS
- React Hook Form
- Zod
- Recharts
- Leaflet / Google Maps
- Lucide Icons

---

# 4. Database

## PostgreSQL

PostgreSQL is recommended because the application has:

- Relational entities.
- Complex relationships.
- Transaction-sensitive order creation.
- Immutable tracking records.
- Configurable rate cards.
- Role-based relationships.
- Strong consistency requirements.

---

# 5. External Services

| Service | Purpose |
|---|---|
| Geocoding API | Convert addresses into coordinates/zones |
| Email provider | Status notifications |
| SMS provider | Optional SMS notifications |
| Maps API | Agent distance calculation |
| PostgreSQL | Main database |
| Redis | Optional caching |
| Cloud storage | Optional document storage |

For a hackathon/MVP, external integrations can use free tiers.

---

# 6. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │     CUSTOMER        │
                         │  Web / Mobile UI    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      FRONTEND       │
                         │ React + TypeScript  │
                         └──────────┬──────────┘
                                    │ REST / WS
                                    ▼
┌────────────────────────────────────────────────────────────────┐
│                       API GATEWAY / BACKEND                     │
│                         Spring Boot                             │
│                                                                │
│ ┌─────────────┐ ┌─────────────┐ ┌───────────────────────────┐ │
│ │ Auth Module │ │ Order       │ │ Rate Calculation Engine   │ │
│ │             │ │ Module      │ │                           │ │
│ └─────────────┘ └─────────────┘ └───────────────────────────┘ │
│                                                                │
│ ┌─────────────┐ ┌─────────────┐ ┌───────────────────────────┐ │
│ │ Zone Module │ │ Assignment  │ │ Tracking Module            │ │
│ │             │ │ Engine      │ │                           │ │
│ └─────────────┘ └─────────────┘ └───────────────────────────┘ │
│                                                                │
│ ┌─────────────┐ ┌─────────────┐ ┌───────────────────────────┐ │
│ │ Notification│ │ Admin       │ │ Rescheduling Module        │ │
│ │ Service     │ │ Module      │ │                           │ │
│ └─────────────┘ └─────────────┘ └───────────────────────────┘ │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │     PostgreSQL     │
                  │      Database      │
                  └────────────────────┘
                            │
             ┌──────────────┼───────────────┐
             ▼              ▼               ▼
        Email Service   SMS Service    Maps/Geo API
```

---

# 7. User Roles

The system contains three primary roles.

## CUSTOMER

Capabilities:

- Register
- Login
- Create order
- Preview shipping charge
- Confirm order
- View own orders
- Track orders
- View tracking timeline
- Receive notifications
- Reschedule failed delivery

---

## DELIVERY_AGENT

Capabilities:

- Login
- View assigned orders
- View pickup/drop information
- Update current location
- Change delivery status
- Mark delivery failed
- View delivery history

---

## ADMIN

Capabilities:

- Login
- Create orders for customers
- Manage customers
- Manage delivery agents
- Manage zones
- Assign areas to zones
- Configure rate cards
- Configure COD surcharge
- Manually assign agents
- Trigger automatic assignment
- View all orders
- Filter orders
- Override order status
- View tracking history
- Monitor agents

The specification explicitly requires role-based authentication for customer, delivery agent and admin.

---

# 8. Core Modules

```text
src/main/java/com/deliverytracker

├── auth
├── user
├── customer
├── agent
├── order
├── tracking
├── zone
├── pricing
├── assignment
├── notification
├── reschedule
├── admin
├── common
└── config
```

---

# 9. Backend Package Architecture

```text
com.deliverytracker
│
├── config
│   ├── SecurityConfig
│   ├── JwtConfig
│   ├── MailConfig
│   └── OpenApiConfig
│
├── auth
│   ├── AuthController
│   ├── AuthService
│   ├── JwtService
│   ├── LoginRequest
│   └── RegisterRequest
│
├── user
│   ├── User
│   ├── UserRepository
│   ├── UserService
│   └── Role
│
├── customer
│   ├── CustomerProfile
│   └── CustomerController
│
├── agent
│   ├── DeliveryAgent
│   ├── AgentRepository
│   ├── AgentService
│   └── AgentLocationService
│
├── order
│   ├── Order
│   ├── OrderController
│   ├── OrderService
│   ├── OrderRepository
│   ├── OrderStatus
│   └── dto
│
├── pricing
│   ├── RateCard
│   ├── PricingEngine
│   ├── RateCardRepository
│   └── PricingResult
│
├── zone
│   ├── Zone
│   ├── Area
│   ├── ZoneService
│   └── ZoneDetectionService
│
├── assignment
│   ├── AssignmentService
│   ├── AutoAssignmentStrategy
│   └── AgentAssignment
│
├── tracking
│   ├── TrackingEvent
│   ├── TrackingService
│   └── TrackingController
│
├── notification
│   ├── NotificationService
│   ├── EmailNotificationService
│   └── SmsNotificationService
│
├── reschedule
│   ├── RescheduleRequest
│   └── RescheduleService
│
└── admin
    ├── AdminController
    └── AdminService
```

---

# 10. Order Lifecycle

```text
                     ORDER CREATED
                           │
                           ▼
                    CHARGE CALCULATED
                           │
                           ▼
                    PAYMENT CONFIRMED
                           │
                           ▼
                    AGENT ASSIGNED
                           │
                           ▼
                       PICKED UP
                           │
                           ▼
                      IN TRANSIT
                           │
                           ▼
                    OUT FOR DELIVERY
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
             DELIVERED             FAILED
                                     │
                                     ▼
                              CUSTOMER NOTIFIED
                                     │
                                     ▼
                                RESCHEDULE
                                     │
                                     ▼
                              NEW AGENT ASSIGNED
                                     │
                                     ▼
                                PICKED UP
```

The required delivery statuses are **Picked Up, In Transit, Out for Delivery, Delivered and Failed**. Failed deliveries must trigger customer notification and allow rescheduling with agent reassignment.

---

# 11. Order Status State Machine

```text
CREATED
   │
   ▼
ASSIGNED
   │
   ▼
PICKED_UP
   │
   ▼
IN_TRANSIT
   │
   ▼
OUT_FOR_DELIVERY
   │
   ├──────────────► DELIVERED
   │
   └──────────────► FAILED
                         │
                         ▼
                    RESCHEDULED
                         │
                         ▼
                     ASSIGNED
```

Invalid transitions must be rejected.

Example:

```text
DELIVERED → PICKED_UP
```

must not be allowed.

---

# 12. Immutable Tracking History

Every status change creates a new tracking event.

Never update or delete previous tracking events.

Example:

```text
Order #ORD-1024

10:00 AM → CREATED
10:05 AM → ASSIGNED
11:10 AM → PICKED_UP
02:20 PM → IN_TRANSIT
06:30 PM → OUT_FOR_DELIVERY
08:05 PM → DELIVERED
```

Each event contains:

```text
tracking_id
order_id
previous_status
new_status
actor_id
actor_role
timestamp
latitude
longitude
remarks
```

The source specifically requires each status change to be logged with timestamp and actor, with immutable tracking history.

---

# 13. Rate Calculation Engine

This is the most important module of the project.

The rate engine must NOT contain hardcoded business pricing.

All rates must come from the database.

---

## 13.1 Inputs

```text
Pickup Address
Drop Address
Length
Breadth
Height
Actual Weight
Order Type
Payment Type
```

---

# 14. Step 1 — Detect Pickup Zone

```text
pickupAddress
      │
      ▼
Geocoding Service
      │
      ▼
Latitude + Longitude
      │
      ▼
Zone Detection Engine
      │
      ▼
Pickup Zone
```

Example:

```text
Pickup:
VIT Bhopal

↓
Zone:
ZONE_BHOPAL
```

---

# 15. Step 2 — Detect Drop Zone

Same process:

```text
Drop Address
     ↓
Geocoding
     ↓
Coordinates
     ↓
Zone Mapping
     ↓
Drop Zone
```

---

# 16. Zone Model

```text
Zone
│
├── id
├── zoneCode
├── zoneName
└── status

Area
│
├── id
├── areaName
├── pincode
├── latitude
├── longitude
└── zoneId
```

Example:

```text
ZONE-01
 ├── Bhopal
 ├── Sehore
 └── Ashta

ZONE-02
 ├── Indore
 ├── Dewas
 └── Ujjain
```

---

# 17. Step 3 — Determine Zone Type

```java
if (pickupZone.equals(dropZone)) {
    zoneType = INTRA_ZONE;
} else {
    zoneType = INTER_ZONE;
}
```

---

# 18. Step 4 — Calculate Volumetric Weight

Required formula:

```text
Volumetric Weight =
(L × B × H) / 5000
```

The problem statement explicitly specifies this formula.

Example:

```text
L = 50 cm
B = 40 cm
H = 30 cm

Volumetric Weight
= (50 × 40 × 30) / 5000
= 12 kg
```

---

# 19. Step 5 — Calculate Billable Weight

```text
Billable Weight =
MAX(actualWeight, volumetricWeight)
```

Example:

```text
Actual Weight = 8 kg
Volumetric Weight = 12 kg

Billable Weight = 12 kg
```

---

# 20. Step 6 — Select Rate Card

Rate selection depends on:

```text
Order Type
+
Zone Type
+
Billable Weight
```

Order types:

```text
B2B
B2C
```

Zone types:

```text
INTRA_ZONE
INTER_ZONE
```

Therefore:

```text
B2B + INTRA
B2B + INTER

B2C + INTRA
B2C + INTER
```

The specification requires separate intra/inter-zone rates for B2B and B2C.

---

# 21. Example Rate Card

```text
Rate Card

B2C
INTRA-ZONE

0–1 kg     ₹50
1–5 kg     ₹80
5–10 kg    ₹120
10–20 kg   ₹180
```

Database-driven:

```text
rate_card
-------------------------
id
order_type
zone_type
min_weight
max_weight
base_charge
per_kg_charge
active
```

---

# 22. Step 7 — COD Surcharge

If:

```text
paymentType == COD
```

then:

```text
finalCharge =
baseCharge + CODSurcharge
```

Otherwise:

```text
finalCharge =
baseCharge
```

The COD surcharge must also be configurable by order type.

---

# 23. Complete Pricing Pipeline

```text
Pickup Address
       │
       ▼
Pickup Zone
       │
       │
Drop Address
       │
       ▼
Drop Zone
       │
       ▼
Zone Type
(INTRA / INTER)
       │
       ▼
Volumetric Weight
       │
       ▼
Billable Weight
       │
       ▼
B2B / B2C
       │
       ▼
Rate Card Lookup
       │
       ▼
Base Shipping Charge
       │
       ▼
COD?
 ┌─────┴─────┐
YES          NO
 │            │
 ▼            │
COD Charge    │
 │            │
 └─────┬──────┘
       ▼
 FINAL CHARGE
```

---

# 24. Pricing Service Design

```java
public interface PricingEngine {

    PricingResult calculate(OrderPricingRequest request);
}
```

Implementation:

```text
PricingEngine
      │
      ├── ZoneDetectionService
      │
      ├── WeightCalculator
      │
      ├── RateCardService
      │
      └── CodSurchargeService
```

This creates separation of responsibilities.

---

# 25. Pricing Response

```json
{
  "actualWeight": 8.0,
  "volumetricWeight": 12.0,
  "billableWeight": 12.0,
  "pickupZone": "ZONE-01",
  "dropZone": "ZONE-02",
  "zoneType": "INTER_ZONE",
  "orderType": "B2C",
  "paymentType": "COD",
  "baseCharge": 180,
  "codSurcharge": 30,
  "finalCharge": 210
}
```

The customer must see this amount before confirming the order.

---

# 26. Auto Assignment Engine

The second major intelligence component is agent assignment.

Requirement:

> Assign the nearest available agent.



---

# 27. Agent Availability Model

Agent states:

```text
AVAILABLE
BUSY
OFFLINE
ON_DELIVERY
```

Only:

```text
AVAILABLE
```

agents can receive automatic assignments.

---

# 28. Agent Location

Each agent should maintain:

```text
agent_id
latitude
longitude
last_location_update
availability_status
current_order_id
zone_id
```

---

# 29. Auto Assignment Algorithm

```text
New Order
   │
   ▼
Pickup Location
   │
   ▼
Find AVAILABLE agents
   │
   ▼
Filter by zone
   │
   ▼
Calculate distance
   │
   ▼
Sort ascending
   │
   ▼
Nearest agent
   │
   ▼
Assign order
```

---

# 30. Distance Calculation

Use Haversine formula.

```text
d = 2R × asin(
    sqrt(
        sin²((lat2-lat1)/2)
        +
        cos(lat1)
        × cos(lat2)
        × sin²((lon2-lon1)/2)
    )
)
```

For a simple MVP, coordinates can be used directly.

For production, use a routing API because geographical distance is not always actual driving distance.

---

# 31. Assignment Strategy

Create an abstraction:

```java
public interface AssignmentStrategy {

    DeliveryAgent assign(Order order);
}
```

Implementation:

```java
NearestAvailableAgentStrategy
```

Future strategies can include:

```text
NearestAgentStrategy
LeastLoadedAgentStrategy
ZoneBasedStrategy
PriorityAgentStrategy
```

---

# 32. Manual Assignment

Admin can override automatic assignment.

```text
Admin
 │
 ▼
Select Order
 │
 ▼
Select Agent
 │
 ▼
Validate Agent Availability
 │
 ▼
Assign
```

Every manual assignment must be logged.

---

# 33. Failed Delivery Flow

```text
Agent
  │
  ▼
MARK FAILED
  │
  ▼
Record failure reason
  │
  ▼
Tracking event created
  │
  ▼
Customer notified
  │
  ▼
Customer selects new date
  │
  ▼
Reschedule request created
  │
  ▼
Previous assignment released
  │
  ▼
New agent assigned
```

The required specification explicitly states that a failed delivery must notify the customer, allow rescheduling, and reassign an agent for the new attempt.

---

# 34. Failure Reasons

Recommended enum:

```text
CUSTOMER_UNAVAILABLE
WRONG_ADDRESS
ADDRESS_NOT_FOUND
CUSTOMER_REFUSED
DAMAGED_PACKAGE
WEATHER_ISSUE
VEHICLE_ISSUE
OTHER
```

---

# 35. Reschedule Entity

```text
reschedule
-------------------------
id
order_id
requested_by
old_delivery_date
new_delivery_date
reason
status
created_at
```

Statuses:

```text
REQUESTED
APPROVED
ASSIGNED
COMPLETED
CANCELLED
```

---

# 36. Notification Architecture

```text
Order Status Changed
        │
        ▼
Tracking Service
        │
        ▼
Notification Service
        │
        ├──────────────► Email
        │
        └──────────────► SMS
```

The specification requires email notifications for every status change and asks for email/SMS integration.

---

# 37. Notification Events

Send notifications on:

```text
ORDER_CREATED
AGENT_ASSIGNED
PICKED_UP
IN_TRANSIT
OUT_FOR_DELIVERY
DELIVERED
FAILED
RESCHEDULED
```

---

# 38. Notification Database

```text
notification
-------------------------
id
order_id
customer_id
channel
event_type
recipient
message
status
sent_at
created_at
```

Status:

```text
PENDING
SENT
FAILED
```

---

# 39. Database ER Diagram

```text
                    ┌─────────────┐
                    │    USER     │
                    ├─────────────┤
                    │ id          │
                    │ name        │
                    │ email       │
                    │ password    │
                    │ role        │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
      ┌──────────┐   ┌──────────┐   ┌──────────────┐
      │ CUSTOMER │   │  AGENT   │   │    ADMIN     │
      └────┬─────┘   └────┬─────┘   └──────────────┘
           │              │
           │              │
           ▼              │
      ┌───────────┐       │
      │   ORDER   │◄──────┘
      └─────┬─────┘
            │
    ┌───────┼───────────────┐
    │       │               │
    ▼       ▼               ▼
TRACKING ASSIGNMENT    RESCHEDULE
    │
    ▼
NOTIFICATION


ZONE ─────────► AREA

RATE_CARD
   │
   ▼
PRICING
```

---

# 40. Core Database Tables

## users

```text
id
name
email
password_hash
phone
role
status
created_at
updated_at
```

---

## customers

```text
id
user_id
company_name
created_at
```

---

## delivery_agents

```text
id
user_id
employee_code
availability_status
latitude
longitude
last_location_update
current_order_id
zone_id
```

---

## zones

```text
id
zone_code
zone_name
status
created_at
```

---

## areas

```text
id
zone_id
area_name
pincode
latitude
longitude
status
```

---

## orders

```text
id
order_number
customer_id

pickup_address
pickup_latitude
pickup_longitude
pickup_zone_id

drop_address
drop_latitude
drop_longitude
drop_zone_id

order_type
payment_type

length
breadth
height

actual_weight
volumetric_weight
billable_weight

base_charge
cod_surcharge
final_charge

status
delivery_date

created_at
updated_at
```

---

## rate_cards

```text
id
order_type
zone_type
min_weight
max_weight
base_charge
per_kg_charge
active
effective_from
effective_to
```

---

## cod_surcharges

```text
id
order_type
surcharge_type
surcharge_value
active
```

---

## assignments

```text
id
order_id
agent_id
assignment_type
assigned_at
unassigned_at
status
```

Assignment types:

```text
AUTO
MANUAL
RESCHEDULE
```

---

## tracking_events

```text
id
order_id
previous_status
new_status
actor_id
actor_role
latitude
longitude
remarks
created_at
```

---

## reschedules

```text
id
order_id
requested_by
previous_date
new_date
reason
status
created_at
```

---

## notifications

```text
id
order_id
customer_id
channel
event_type
recipient
message
status
sent_at
created_at
```

---

# 41. REST API Design

## Authentication

### Register

```http
POST /api/v1/auth/register
```

### Login

```http
POST /api/v1/auth/login
```

---

# 42. Customer APIs

### Create order

```http
POST /api/v1/orders
```

### Preview charge

```http
POST /api/v1/orders/quote
```

### Get own orders

```http
GET /api/v1/orders/my
```

### Get order

```http
GET /api/v1/orders/{orderId}
```

### Tracking

```http
GET /api/v1/orders/{orderId}/tracking
```

### Reschedule

```http
POST /api/v1/orders/{orderId}/reschedule
```

---

# 43. Agent APIs

### Assigned orders

```http
GET /api/v1/agent/orders
```

### Update location

```http
PATCH /api/v1/agent/location
```

### Update status

```http
PATCH /api/v1/orders/{orderId}/status
```

### Mark failed

```http
POST /api/v1/orders/{orderId}/fail
```

---

# 44. Admin APIs

### All orders

```http
GET /api/v1/admin/orders
```

Filters:

```text
status
zone
agent
customer
date
orderType
paymentType
```

### Manual assignment

```http
POST /api/v1/admin/orders/{orderId}/assign
```

### Auto assignment

```http
POST /api/v1/admin/orders/{orderId}/auto-assign
```

### Override status

```http
PATCH /api/v1/admin/orders/{orderId}/status
```

---

# 45. Zone Management APIs

```http
POST   /api/v1/admin/zones
GET    /api/v1/admin/zones
PUT    /api/v1/admin/zones/{id}
DELETE /api/v1/admin/zones/{id}
```

Area management:

```http
POST /api/v1/admin/zones/{zoneId}/areas
PUT  /api/v1/admin/areas/{areaId}
DELETE /api/v1/admin/areas/{areaId}
```

---

# 46. Rate Card APIs

```http
POST /api/v1/admin/rates
GET  /api/v1/admin/rates
PUT  /api/v1/admin/rates/{id}
DELETE /api/v1/admin/rates/{id}
```

COD configuration:

```http
POST /api/v1/admin/cod-rates
PUT  /api/v1/admin/cod-rates/{id}
```

---

# 47. API Request Example

```json
POST /api/v1/orders

{
  "pickupAddress": "Bhopal",
  "dropAddress": "Indore",
  "length": 50,
  "breadth": 40,
  "height": 30,
  "actualWeight": 8,
  "orderType": "B2C",
  "paymentType": "COD"
}
```

Response:

```json
{
  "orderId": "ORD-10025",
  "pickupZone": "ZONE-01",
  "dropZone": "ZONE-02",
  "volumetricWeight": 12,
  "billableWeight": 12,
  "baseCharge": 180,
  "codSurcharge": 30,
  "totalCharge": 210,
  "status": "CREATED"
}
```

---

# 48. Authentication Architecture

Use:

```text
JWT
+
Spring Security
+
Role-Based Access Control
```

JWT:

```text
Header
Payload
Signature
```

Example payload:

```json
{
  "sub": "user123",
  "role": "CUSTOMER",
  "exp": 1780000000
}
```

---

# 49. Authorization

```text
CUSTOMER
 ├── create order
 ├── view own order
 ├── tracking
 └── reschedule

AGENT
 ├── view assigned orders
 ├── update location
 └── update status

ADMIN
 ├── everything
 ├── rates
 ├── zones
 ├── assignments
 └── status overrides
```

---

# 50. Frontend Architecture

```text
src/
│
├── components/
│   ├── Navbar
│   ├── Sidebar
│   ├── OrderCard
│   ├── TrackingTimeline
│   ├── StatusBadge
│   └── LoadingSpinner
│
├── pages/
│   ├── Login
│   ├── Register
│   ├── CustomerDashboard
│   ├── CreateOrder
│   ├── OrderDetails
│   ├── Tracking
│   ├── AgentDashboard
│   ├── AdminDashboard
│   ├── RateCards
│   ├── Zones
│   └── Agents
│
├── services/
│   ├── authApi
│   ├── orderApi
│   ├── adminApi
│   └── agentApi
│
├── hooks/
├── context/
├── types/
└── utils/
```

---

# 51. Customer Dashboard

Display:

```text
Total Orders
Active Deliveries
Delivered
Failed
```

Order card:

```text
ORD-10025

Bhopal
   ↓
Indore

B2C | COD

₹210

OUT FOR DELIVERY
```

Actions:

```text
Track
View Details
Reschedule
```

---

# 52. Create Order UI

Step 1:

```text
Pickup Address
Drop Address
```

Step 2:

```text
Length
Breadth
Height
Actual Weight
```

Step 3:

```text
B2B / B2C
Prepaid / COD
```

Step 4:

```text
CALCULATE CHARGE
```

Display:

```text
Actual Weight        8 kg
Volumetric Weight   12 kg
Billable Weight     12 kg

Shipping             ₹180
COD                   ₹30
--------------------------
TOTAL                 ₹210
```

Then:

```text
[ CONFIRM ORDER ]
```

---

# 53. Tracking UI

```text
ORDER #ORD-10025

Bhopal ───────────────────► Indore

✓ Order Created
  10:00 AM

✓ Agent Assigned
  10:05 AM

✓ Picked Up
  11:10 AM

✓ In Transit
  02:20 PM

● Out for Delivery
  06:30 PM

○ Delivered
```

The customer must be able to view live status and the complete tracking timeline.

---

# 54. Admin Dashboard

Dashboard widgets:

```text
Total Orders
Active Deliveries
Delivered Today
Failed Deliveries
Available Agents
Revenue
```

Tables:

```text
Orders
Agents
Zones
Rate Cards
Notifications
```

---

# 55. Admin Order Filters

```text
Status
Zone
Agent
Date
Order Type
Payment Type
```

The specification explicitly calls for filtering orders by status, zone and agent, plus administrator status overrides.

---

# 56. Agent Dashboard

```text
Today's Deliveries

┌──────────────────────────┐
│ ORD-1001                 │
│ Pickup: Bhopal           │
│ Drop: Indore             │
│ Status: IN TRANSIT       │
│                          │
│ [UPDATE STATUS]          │
└──────────────────────────┘
```

Agent can update:

```text
Picked Up
In Transit
Out for Delivery
Delivered
Failed
```

---

# 57. Important Business Rules

## Rule 1

Billable weight:

```text
MAX(actual, volumetric)
```

## Rule 2

Volumetric:

```text
L × B × H / 5000
```

## Rule 3

Same zone:

```text
INTRA_ZONE
```

Different zones:

```text
INTER_ZONE
```

## Rule 4

B2B uses B2B rate card.

## Rule 5

B2C uses B2C rate card.

## Rule 6

COD adds configured surcharge.

## Rule 7

Only available agents can be auto-assigned.

## Rule 8

Tracking history cannot be deleted.

## Rule 9

Invalid status transitions are rejected.

## Rule 10

Failed delivery requires a failure reason.

## Rule 11

Rescheduled orders receive a new assignment.

## Rule 12

Customers cannot modify finalized historical tracking events.

---

# 58. Transaction Design

Order creation should be transactional.

```java
@Transactional
public Order createOrder(...) {

    Zone pickupZone = zoneService.detect(...);

    Zone dropZone = zoneService.detect(...);

    PricingResult pricing =
        pricingEngine.calculate(...);

    Order order =
        orderRepository.save(...);

    trackingService.record(...);

    assignmentService.autoAssign(order);

    return order;
}
```

If pricing or order creation fails:

```text
ROLLBACK
```

This prevents partially-created orders.

---

# 59. Concurrency Protection

A major issue is two orders attempting to assign the same agent.

Use:

```text
Database transaction
+
Pessimistic locking / optimistic locking
+
availability validation
```

Example:

```text
Agent A = AVAILABLE

Order 1 ─────┐
             ├──► assignment transaction
Order 2 ─────┘

Only one succeeds.
```

---

# 60. Rate Card Versioning

Never overwrite historical pricing blindly.

Use:

```text
effective_from
effective_to
active
```

Example:

```text
Rate Version 1
Jan 1 → Jun 30

Rate Version 2
Jul 1 → Present
```

Existing orders retain their calculated charge.

This is important for auditability.

---

# 61. Zone Detection Strategy

Recommended MVP approach:

```text
Address
 ↓
Geocoding API
 ↓
Latitude / Longitude
 ↓
Check Area mapping
 ↓
Zone
```

For a hackathon:

```text
Pincode → Area → Zone
```

can be implemented first.

Production:

```text
Coordinates → Polygon → Zone
```

---

# 62. Caching

Redis can cache:

```text
Zone lookup
Rate cards
Agent availability
```

Example:

```text
rate:B2C:INTER:10-20
```

This reduces database queries.

Redis is optional for the MVP.

---

# 63. Security

Implement:

```text
JWT authentication
BCrypt password hashing
Role-based authorization
Input validation
DTO validation
CORS
Rate limiting
SQL injection protection
```

Never expose:

```text
password_hash
internal IDs unnecessarily
JWT secrets
API keys
```

---

# 64. Validation

Examples:

```text
Length > 0
Breadth > 0
Height > 0
Weight > 0
Valid email
Valid phone
Pickup != Drop
Valid order type
Valid payment type
```

---

# 65. Error Handling

Standard response:

```json
{
  "timestamp": "2026-08-21T18:30:00",
  "status": 400,
  "error": "INVALID_REQUEST",
  "message": "Actual weight must be greater than zero",
  "path": "/api/v1/orders"
}
```

Global Spring handler:

```java
@RestControllerAdvice
public class GlobalExceptionHandler
```

---

# 66. Logging

Use structured logs.

Example:

```text
INFO
ORDER_CREATED
orderId=ORD-10025
customerId=C123
```

```text
INFO
AGENT_ASSIGNED
orderId=ORD-10025
agentId=A102
distance=2.4km
```

```text
WARN
DELIVERY_FAILED
orderId=ORD-10025
reason=CUSTOMER_UNAVAILABLE
```

---

# 67. Observability

Spring Actuator endpoints:

```text
/actuator/health
/actuator/metrics
```

Track:

```text
Order creation latency
Pricing calculation latency
Assignment latency
Notification success rate
Failed deliveries
API error rate
```

---

# 68. Testing Strategy

## Unit Tests

Test:

```text
VolumetricWeightCalculator
BillableWeightCalculator
ZoneDetectionService
PricingEngine
CODCalculator
AssignmentStrategy
StatusTransitionValidator
```

---

# 69. Critical Pricing Tests

### Test 1

```text
Actual = 10
Volumetric = 8

Billable = 10
```

### Test 2

```text
Actual = 8
Volumetric = 12

Billable = 12
```

### Test 3

```text
B2B + INTRA
```

must select B2B intra rate.

### Test 4

```text
B2C + INTER
```

must select B2C inter rate.

### Test 5

```text
COD
```

must add surcharge.

### Test 6

```text
PREPAID
```

must not add COD surcharge.

---

# 70. Assignment Tests

```text
Available agent exists
→ Assign nearest agent
```

```text
No available agent
→ Order remains UNASSIGNED
```

```text
Agent is BUSY
→ Cannot assign
```

```text
Agent goes offline
→ Cannot assign
```

---

# 71. Tracking Tests

Verify:

```text
CREATED → ASSIGNED
ASSIGNED → PICKED_UP
PICKED_UP → IN_TRANSIT
IN_TRANSIT → OUT_FOR_DELIVERY
OUT_FOR_DELIVERY → DELIVERED
```

Invalid:

```text
DELIVERED → PICKED_UP
```

must fail.

---

# 72. Recommended Project Structure

```text
last-mile-delivery-tracker/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── database/
│   ├── migrations/
│   └── seed/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── rate-engine.md
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 73. Environment Variables

```env
DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=

JWT_SECRET=
JWT_EXPIRATION=

MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=

SMS_API_KEY=

MAPS_API_KEY=

REDIS_HOST=
REDIS_PORT=
```

Never commit `.env`.

Commit:

```text
.env.example
```

---

# 74. Deployment Architecture

For the hackathon:

```text
                    USERS
                      │
                      ▼
               Vercel Frontend
                      │
                      ▼
                Render Backend
                      │
                      ▼
              PostgreSQL Database
                      │
             ┌────────┴────────┐
             ▼                 ▼
        Email Service       Maps API
```

Recommended deployment:

```text
Frontend → Vercel
Backend → Render
Database → Render PostgreSQL / Neon
```

The problem statement specifically accepts hosted platforms such as Vercel, Render and Railway.

---

# 75. Docker Architecture

```text
docker-compose

┌───────────────────────────┐
│ frontend                  │
│ React                     │
└─────────────┬─────────────┘
              │
┌─────────────▼─────────────┐
│ backend                   │
│ Spring Boot               │
└─────────────┬─────────────┘
              │
┌─────────────▼─────────────┐
│ postgres                  │
│ PostgreSQL                 │
└───────────────────────────┘
```

Optional:

```text
redis
```

---

# 76. Development Phases

## Phase 1 — Foundation

```text
Spring Boot setup
PostgreSQL
JWT
User roles
Database migrations
```

## Phase 2 — Order

```text
Customer registration
Order creation
Order validation
```

## Phase 3 — Pricing

```text
Zone detection
Volumetric weight
Billable weight
Rate cards
COD
```

## Phase 4 — Assignment

```text
Agent management
Availability
Location
Nearest-agent algorithm
```

## Phase 5 — Tracking

```text
Status lifecycle
Tracking events
Timeline
```

## Phase 6 — Failure

```text
Failed delivery
Notification
Rescheduling
Reassignment
```

## Phase 7 — Admin

```text
Dashboard
Filters
Zones
Rates
Agents
Overrides
```

## Phase 8 — Frontend Polish

```text
Responsive UI
Dashboard
Tracking timeline
Maps
Notifications
```

## Phase 9 — Testing

```text
Unit
Integration
API
Security
Edge cases
```

## Phase 10 — Deployment

```text
Docker
Production database
Environment variables
Vercel
Render
```

---

# 77. MVP Priority

If development time is limited, implement in this order:

### 🔴 MUST HAVE

```text
JWT Authentication
Role-based access
Order creation
Zone detection
Volumetric weight
Billable weight
Rate calculation
COD surcharge
Agent assignment
Status lifecycle
Immutable tracking
Failed delivery
Rescheduling
Admin dashboard
```

### 🟡 SHOULD HAVE

```text
Email
SMS
Agent location
Maps
Live tracking
Redis
```

### 🟢 NICE TO HAVE

```text
WebSockets
Advanced analytics
ETA prediction
Route optimization
Push notifications
Dark mode
AI-based delivery prediction
```

---

# 78. End-to-End Example

Customer creates:

```text
Pickup:
Bhopal

Drop:
Indore

Dimensions:
50 × 40 × 30 cm

Actual Weight:
8 kg

Order:
B2C

Payment:
COD
```

System performs:

```text
1. Geocode Bhopal
2. Detect ZONE-01

3. Geocode Indore
4. Detect ZONE-02

5. Zones differ
   → INTER_ZONE

6. Volumetric weight
   = 50×40×30/5000
   = 12kg

7. Billable weight
   = MAX(8,12)
   = 12kg

8. Lookup:
   B2C + INTER_ZONE + 12kg

9. Base charge
   = ₹180

10. COD surcharge
    = ₹30

11. Final charge
    = ₹210

12. Customer sees ₹210

13. Customer confirms

14. Order created

15. Find available agents

16. Calculate distance

17. Select nearest agent

18. Agent accepts assignment

19. Status:
    ASSIGNED

20. Agent picks package

21. Status:
    PICKED_UP

22. Status:
    IN_TRANSIT

23. Status:
    OUT_FOR_DELIVERY

24. Delivery succeeds

25. Status:
    DELIVERED

26. Every status change:
    → tracking_event
    → email
    → SMS
```

---

# 79. System Design — Key Engineering Decisions

## Decision 1 — Modular Monolith

For this project, use a **modular monolith**, not microservices.

Why?

```text
Faster development
Easier deployment
Simpler debugging
Single database
Clear module boundaries
Easy future migration
```

The internal modules can later become microservices.

---

# 80. Future Microservice Evolution

Current:

```text
Spring Boot Monolith
```

Future:

```text
API Gateway
     │
     ├── Auth Service
     ├── Order Service
     ├── Pricing Service
     ├── Zone Service
     ├── Assignment Service
     ├── Tracking Service
     └── Notification Service
```

Kafka can eventually handle:

```text
ORDER_CREATED
ORDER_ASSIGNED
STATUS_CHANGED
DELIVERY_FAILED
ORDER_RESCHEDULED
```

For the hackathon, Kafka is unnecessary overhead.

---

# 81. Performance Considerations

Important indexes:

```sql
CREATE INDEX idx_orders_status
ON orders(status);

CREATE INDEX idx_orders_customer
ON orders(customer_id);

CREATE INDEX idx_orders_agent
ON assignments(agent_id);

CREATE INDEX idx_tracking_order
ON tracking_events(order_id);

CREATE INDEX idx_area_pincode
ON areas(pincode);
```

Agent lookup should avoid scanning every agent.

Use:

```text
availability_status
+
zone_id
```

as initial filters.

---

# 82. Data Integrity

Use foreign keys:

```text
orders.customer_id
→ customers.id

orders.pickup_zone_id
→ zones.id

orders.drop_zone_id
→ zones.id

assignments.agent_id
→ delivery_agents.id

tracking_events.order_id
→ orders.id
```

Use database constraints for:

```text
weight > 0
dimensions > 0
valid enum values
unique email
unique order number
```

---

# 83. Auditability

Important administrative actions should be auditable.

Recommended:

```text
audit_logs
-------------------------
id
actor_id
action
entity_type
entity_id
old_value
new_value
timestamp
```

Examples:

```text
ADMIN_CHANGED_RATE
ADMIN_ASSIGNED_AGENT
ADMIN_OVERRIDDEN_STATUS
ADMIN_CHANGED_ZONE
```

---

# 84. API Documentation

Use:

```text
Swagger / OpenAPI
```

Document:

```text
Authentication
Orders
Pricing
Agents
Tracking
Admin
Zones
Rate cards
Rescheduling
```

Target:

```text
/api-docs
/swagger-ui
```

---

# 85. README Must Contain

The original deliverables require a README containing setup instructions, `.env.example`, API documentation, DB schema and rate-calculation explanation.

Include:

```text
1. Project overview
2. Features
3. Architecture
4. Tech stack
5. Installation
6. Environment variables
7. Database setup
8. Running backend
9. Running frontend
10. API documentation
11. Database schema
12. Rate calculation
13. Assignment algorithm
14. Status lifecycle
15. Failed delivery flow
16. Testing
17. Deployment
18. Screenshots
19. Demo credentials
20. Future improvements
```

---

# 86. Demo Accounts

For presentation:

```text
ADMIN
admin@demo.com
password

CUSTOMER
customer@demo.com
password

AGENT
agent@demo.com
password
```

These should only be seeded for development/demo environments.

---

# 87. Demo Flow For Hackathon

Use this exact sequence during your presentation:

```text
LOGIN AS CUSTOMER
        ↓
CREATE ORDER
        ↓
ENTER DIMENSIONS
        ↓
SELECT B2C + COD
        ↓
SHOW AUTOMATIC PRICE
        ↓
CONFIRM
        ↓
SHOW ZONES
        ↓
SHOW AUTO-ASSIGNED AGENT
        ↓
LOGIN AS AGENT
        ↓
UPDATE PICKED UP
        ↓
UPDATE IN TRANSIT
        ↓
UPDATE OUT FOR DELIVERY
        ↓
MARK FAILED
        ↓
CUSTOMER RECEIVES NOTIFICATION
        ↓
CUSTOMER RESCHEDULES
        ↓
NEW AGENT ASSIGNED
        ↓
DELIVERED
        ↓
SHOW IMMUTABLE TIMELINE
        ↓
LOGIN AS ADMIN
        ↓
SHOW RATE CARD
        ↓
SHOW ZONES
        ↓
SHOW ORDER FILTERS
```

This demo directly exercises the areas emphasized by the evaluation criteria.

---

# 88. Final Architecture

```text
                         ┌───────────────────────┐
                         │       CUSTOMER        │
                         └───────────┬───────────┘
                                     │
                         ┌───────────▼───────────┐
                         │       REACT APP        │
                         │   Customer / Agent /   │
                         │        Admin UI        │
                         └───────────┬───────────┘
                                     │
                                  HTTPS
                                     │
                         ┌───────────▼───────────┐
                         │    SPRING BOOT API     │
                         │     MODULAR MONOLITH   │
                         └───────────┬───────────┘
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       │                             │                             │
       ▼                             ▼                             ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│ AUTH MODULE  │             │ ORDER MODULE │             │ ADMIN MODULE │
└──────────────┘             └──────┬───────┘             └──────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ┌────────────┐     ┌────────────┐     ┌──────────────┐
          │ZONE ENGINE │     │RATE ENGINE │     │ ASSIGNMENT   │
          └────────────┘     └────────────┘     │    ENGINE     │
                                                └──────┬───────┘
                                                       │
                                                       ▼
                                                ┌──────────────┐
                                                │   TRACKING   │
                                                │    ENGINE    │
                                                └──────┬───────┘
                                                       │
                                  ┌────────────────────┼─────────────────┐
                                  │                    │                 │
                                  ▼                    ▼                 ▼
                           ┌─────────────┐      ┌────────────┐    ┌────────────┐
                           │NOTIFICATION │      │RESCHEDULE  │    │ AUDIT LOG  │
                           └──────┬──────┘      └────────────┘    └────────────┘
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                     EMAIL              SMS

                                  │
                                  ▼
                         ┌──────────────────┐
                         │   POSTGRESQL     │
                         └──────────────────┘

                         Optional:
                         ┌──────────────────┐
                         │      REDIS       │
                         └──────────────────┘
```

---

# 89. Definition of Done

The project is considered complete when:

- [ ] Customer can register/login.
- [ ] Agent can login.
- [ ] Admin can login.
- [ ] Customer can create order.
- [ ] Admin can create order for customer.
- [ ] Pickup zone is automatically detected.
- [ ] Drop zone is automatically detected.
- [ ] Volumetric weight is calculated using `L×B×H/5000`.
- [ ] Billable weight uses the higher of actual/volumetric.
- [ ] Correct B2B/B2C rate card is selected.
- [ ] Intra/inter-zone pricing works.
- [ ] COD surcharge works.
- [ ] Price is displayed before confirmation.
- [ ] Auto-assignment finds nearest available agent.
- [ ] Admin can manually assign agents.
- [ ] Agent can update delivery status.
- [ ] Every status change creates immutable tracking history.
- [ ] Customer can see tracking timeline.
- [ ] Email notification works.
- [ ] SMS integration works or is demonstrated.
- [ ] Failed delivery flow works.
- [ ] Customer can reschedule.
- [ ] Agent is reassigned after rescheduling.
- [ ] Admin can filter orders.
- [ ] Admin can override status.
- [ ] Zones are configurable.
- [ ] Rate cards are configurable.
- [ ] API documentation exists.
- [ ] Database schema is documented.
- [ ] `.env.example` exists.
- [ ] Application is deployed.
- [ ] README is complete.

---

# 90. Recommended Implementation Principle

The single most important design principle for this project is:

> **Keep business rules inside dedicated services, not controllers.**

Bad:

```text
OrderController
 ├── calculate weight
 ├── detect zone
 ├── find rate
 ├── calculate COD
 ├── find agent
 ├── update status
 └── send email
```

Good:

```text
OrderController
      │
      ▼
OrderService
      │
      ├── ZoneDetectionService
      ├── PricingEngine
      ├── AssignmentService
      ├── TrackingService
      └── NotificationService
```

This makes the architecture cleaner, testable and much easier to explain during evaluation.

---

# 91. Final Recommendation

For a hackathon implementation, build this as a:

**Java 21 + Spring Boot + PostgreSQL + React/TypeScript modular monolith**

with these as the **four showcase components**:

```text
┌─────────────────────────────────────────────┐
│                                             │
│       ⭐ 1. DYNAMIC RATE ENGINE             │
│                                             │
│       Zone + Weight + B2B/B2C + COD        │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│       ⭐ 2. INTELLIGENT ASSIGNMENT          │
│                                             │
│       Nearest Available Delivery Agent      │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│       ⭐ 3. IMMUTABLE TRACKING              │
│                                             │
│       Status Machine + Audit Timeline       │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│       ⭐ 4. FAILED DELIVERY RECOVERY        │
│                                             │
│       Failure → Notify → Reschedule         │
│                → Reassign → Deliver         │
│                                             │
└─────────────────────────────────────────────┘
```

These four areas map directly to the problem's stated evaluation priorities: **rate calculation correctness, agent availability/assignment, immutable tracking, and database/API design**.