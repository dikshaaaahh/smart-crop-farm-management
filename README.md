# Smart Crop Decision & Farm Management System
> **Placement-Ready Full-Stack Web Application for B.Tech Computer Science Project**

A modern, full-stack precision farm management and rule-based agronomic advisory system built with **Spring Boot 3 (Java 21)**, **React.js (Vite)**, and **MySQL** (with H2 in-memory profile support).

---

## 📌 Project Overview

In traditional farming, decisions regarding crop choice, fertilizer dosing, and irrigation scheduling are often made either on intuition or fragmented guidelines, leading to soil degradation, high input costs, and yield losses.

The **Smart Crop Decision & Farm Management System** addresses this problem by delivering a deterministic, transparent, and explainable agricultural assistant paired with an operational farm management tool.

### 🌟 Key Design Highlights:
* **100% Explainable Rule-Based Logic:** Zero black-box machine learning or uninterpretable neural nets. Every recommendation computes an explicit **Suitability Score (%)** with itemized reasons, environmental match breakdown, and water deficit alerts.
* **No External API Dependencies:** Works completely offline without unreliable paid weather or map APIs. All agronomic reference data is pre-seeded into MySQL/H2 via an automated `DataInitializer`.
* **Honest Agronomic Advisory:** Clearly labeled reference values and disclaimers, adhering to ethical computing and academic integrity.
* **Production-Grade Layered Architecture:** Strict adherence to `Controller -> Service -> Repository -> Database` with DTOs, Bean Validation, Global Exception Handling, and CORS.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Description |
| :--- | :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.4.3 | RESTful backend microservice |
| **Persistence** | Spring Data JPA, Hibernate ORM | Relational mapping, repositories, transaction management |
| **Validation** | Jakarta Bean Validation (`spring-boot-starter-validation`) | Server-side request validation (`@Valid`, `@NotNull`, etc.) |
| **Primary DB** | MySQL 8.x (`smart_crop_db`) | Primary relational database with foreign-key constraints |
| **Demo/Test DB**| H2 In-Memory Database | Instant plug-and-play testing without setting up MySQL |
| **Frontend** | React 18, Vite 5, JavaScript (ES6+) | Single-page application (SPA) with fast HMR |
| **Icons & UI** | Lucide React, Modern CSS3 | Agricultural palette, responsive grid/flexbox, modals |
| **Build Tools** | Maven Wrapper (`./mvnw`), NPM | Standard build automation |

---

## 🏛️ System Architecture

```
[ Browser / React Frontend (Port 5173) ]
                    │
                    │ JSON / HTTP REST APIs (with CORS enabled)
                    ▼
[ Spring Boot REST Controllers (Port 8080) ]
   ├── DashboardController (/api/dashboard)
   ├── FarmController (/api/farms)
   ├── CropController (/api/crops)
   ├── RecommendationController (/api/recommendations)
   ├── FertilizerController (/api/fertilizer)
   ├── IrrigationController (/api/irrigation)
   ├── ActivityController (/api/activities)
   └── ExpenseController (/api/expenses)
                    │
                    ▼
[ Service Layer (Business & Rule-Based Decision Logic) ]
   ├── CropRecommendationService  (Deterministic Multi-Criteria Scoring)
   ├── FertilizerService          (NPK & Commercial Bag Calculations)
   ├── IrrigationService          (Phenological Critical Windows & ET)
   ├── FarmService, ActivityService, ExpenseService, DashboardService
                    │
                    ▼
[ Spring Data JPA Repositories (Data Access Layer) ]
   ├── FarmRepository
   ├── CropRepository
   ├── CropActivityRepository
   └── FarmExpenseRepository
                    │
                    ▼
[ Database Layer: MySQL 8.0 (`smart_crop_db`) | H2 In-Memory (Test) ]
```

---

## 📦 Core Modules & Feature Breakdown

### 1. 🌾 Farm Management
* Complete CRUD operations on farms: Farm Name, Farmer Name, Location, Land Area (in acres), Soil Type (Loamy, Clay, Alluvial, Black, Sandy, Red), Irrigation Method (Canal, Borewell, Drip, Sprinkler, Rainfed), and Water Availability Level.
* Quick-action buttons to transfer farm parameters directly into Recommendation, Fertilizer, or Irrigation modules.

### 2. 🧠 Rule-Based Crop Recommendation Engine
* Evaluates input conditions: **Soil Type**, **Target Season** (Kharif, Rabi, Zaid, All-Season), **Land Area**, **Water Availability**, and **Budget Level**.
* **Deterministic Scoring Breakdown (0 to 100 Points):**
  * **Soil Compatibility (+35 pts):** Agronomic match with soil texture (optimal = 35, versatile/alluvial = 25, non-ideal = 10 + warning).
  * **Seasonal Alignment (+35 pts):** Photoperiod and temperature alignment (direct match = 35, off-season = 5 + season risk warning).
  * **Water Security & Deficit Penalty (+30 pts / -20 pts):** Evaluates crop evapotranspiration against water availability. E.g., High-water crops in rainfed/dry land receive an immediate **-20 point penalty** accompanied by critical water stress warnings.
  * **Budget Sensitivity (-10 pts):** Warns if low budget conflicts with high-cost crops (e.g., Sugarcane/Potato).
* **Economic Projections:** Automatically projects:
  $$\text{Estimated Yield} = \text{Yield per Acre} \times \text{Acres}$$
  $$\text{Gross Revenue} = \text{Yield} \times \text{Market Price (MSP)}$$
  $$\text{Net Profit} = \text{Gross Revenue} - (\text{Cultivation Cost} \times \text{Acres})$$

### 3. 🧪 Fertilizer Guidance
* Calculates stoichiometric fertilizer requirements for commercial NPK carriers:
  $$\text{DAP (kg)} = \frac{P_{req}}{0.46}$$
  $$\text{Urea (kg)} = \frac{N_{req} - (\text{DAP} \times 0.18)}{0.46}$$
  $$\text{MOP (kg)} = \frac{K_{req}}{0.60}$$
* Calculates the exact number of **50 kg fertilizer bags** required for the specified acreage.
* Recommends stage-wise split applications (Basal, Tillering, Panicle Initiation, Flowering) and soil-specific advisories (e.g., split nitrogen on sandy soils to prevent leaching).

### 4. 💧 Irrigation Guidance
* Classifies water requirements (Low, Moderate, High, Very High) and suggests optimal irrigation methods (Drip, Sprinkler, Furrow, Basin).
* Dynamic schedule calculations adjusted for soil porosity (e.g., Sandy soils -3 days, Clay soils +3 days) and season evapotranspiration.
* Highlights crop-specific **Phenological Critical Stages** (e.g., Crown Root Initiation in Wheat, Squaring/Boll formation in Cotton) where water stress causes severe permanent yield penalty.
* Water conservation tips (mulching, tensiometers, night irrigation).

### 5. 🚜 Crop Activity Tracker
* Log farming operations: Land Preparation, Sowing, Irrigation, Fertilization, Weeding, Spraying, and Harvesting.
* Track status (`PLANNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) with direct one-click status transitions.
* Filter by farm and category; calculates activity costs.

### 6. 💰 Farm Expense Manager
* Records operational costs across 7 categories: `SEEDS`, `FERTILIZERS`, `LABOUR`, `IRRIGATION`, `PESTICIDES`, `MACHINERY`, `TRANSPORT`.
* Visual category-wise cost breakdown bars with percentage expenditure.
* Associated with specific farm and crop for accurate unit economics.

### 7. 📊 Executive Dashboard
* Overview KPI cards: Total Farms, Tracked Acreage, Active Activities, and Total Expenses.
* Quick Action launcher for high-frequency workflows.
* Real-time backend connectivity badge with diagnostic guide.

---

## 🗄️ Database Design (`smart_crop_db`)

```
   ┌────────────────────────────────┐
   │             farms              │
   ├────────────────────────────────┤
   │ id (PK, AutoIncrement)         │
   │ name, farmer_name, location    │
   │ total_area_acres               │
   │ soil_type (ENUM)               │
   │ irrigation_source (ENUM)       │
   │ water_availability (ENUM)      │
   │ current_crops, notes           │
   │ created_at, updated_at         │
   └───────────────┬────────────────┘
                   │ 1
                   │
         ┌─────────┴─────────┐
         │ N                 │ N
         ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│  crop_activities │  │  farm_expenses   │
├──────────────────┤  ├──────────────────┤
│ id (PK)          │  │ id (PK)          │
│ farm_id (FK)     │  │ farm_id (FK)     │
│ farm_name        │  │ farm_name        │
│ crop_name        │  │ crop_name        │
│ title, category  │  │ category (ENUM)  │
│ scheduled_date   │  │ amount (Double)  │
│ status (ENUM)    │  │ expense_date     │
│ cost, notes      │  │ payment_mode     │
└──────────────────┘  └──────────────────┘

   ┌────────────────────────────────┐
   │             crops              │ (Predefined Reference Data)
   ├────────────────────────────────┤
   │ id (PK, AutoIncrement)         │
   │ name, scientific_name, category│
   │ suitable_seasons (CSV)         │
   │ suitable_soils (CSV)           │
   │ water_requirement (ENUM)       │
   │ min_temp, max_temp             │
   │ duration_days_min / max        │
   │ avg_yield_per_acre_quintals    │
   │ market_price_per_quintal       │
   │ cost_of_cultivation_per_acre   │
   │ npk_ratio, fertilizer_guidance │
   │ irrigation_guidance, notes     │
   └────────────────────────────────┘
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
* **Java Development Kit (JDK 17 or 21)**: Verify with `java -version`.
* **Node.js (v18+) & npm**: Verify with `node -v` and `npm -v`.
* **MySQL Server (Optional for default mode, H2 mode requires nothing)**.

---

### Option A: Running with In-Memory H2 Database (Recommended for Demo / Viva)
No database installation or configuration is needed.

1. **Start the Backend:**
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
   ```
   * The backend will start at `http://localhost:8080`.
   * Sample crops, farms, activities, and expenses are automatically seeded.
   * Access the H2 Database Console at `http://localhost:8080/h2-console`
     * **JDBC URL:** `jdbc:h2:mem:smart_crop_db`
     * **User:** `sa`
     * **Password:** *(leave blank)*

2. **Start the Frontend:**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   * Access the web interface at `http://localhost:5173`.

---

### Option B: Running with MySQL Primary Database

1. **Create the Database in MySQL:**
   ```sql
   CREATE DATABASE smart_crop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Configure Credentials in `backend/src/main/resources/application.properties` (or via environment variables):**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_crop_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

3. **Start the Backend:**
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```

4. **Start the Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/dashboard/stats` | Aggregated farm count, expenses, and activities |
| `GET` | `/api/farms` | Retrieve all farms |
| `POST` | `/api/farms` | Register a new farm |
| `PUT` | `/api/farms/{id}` | Update existing farm details |
| `DELETE` | `/api/farms/{id}` | Remove a farm |
| `GET` | `/api/crops` | Fetch agronomic reference crop catalog |
| `POST` | `/api/recommendations/crop` | Evaluate crop suitability based on soil, season, and water |
| `POST` | `/api/fertilizer/guidance` | Calculate commercial fertilizer bags & split doses |
| `POST` | `/api/irrigation/guidance` | Fetch water scheduling and critical crop growth windows |
| `GET` | `/api/activities` | List farming activities (supports farm/status filter) |
| `POST` | `/api/activities` | Schedule a new farming activity |
| `PATCH` | `/api/activities/{id}/status` | Update activity lifecycle status |
| `DELETE` | `/api/activities/{id}` | Delete an activity |
| `GET` | `/api/expenses` | List all farm expenses |
| `POST` | `/api/expenses` | Add a farm expense |
| `DELETE` | `/api/expenses/{id}` | Delete an expense |

---

## 🎓 Viva & Technical Interview Guide (Placement Ready)

Here are the most frequently asked questions and model answers for academic vivas and technical placements:

### 1. Why rule-based logic instead of Machine Learning?
> *"Machine Learning models in agriculture act as black boxes (e.g. Random Forest, Neural Networks) and require thousands of hyper-local historical training samples (micro-climate, soil chemistry, NDVI satellite imagery) which are rarely verifiable or transparent. In farm advisory, a farmer needs to understand **why** a crop is recommended and what the risk factors are. Our rule-based decision matrix evaluates agronomic criteria (soil texture compatibility, thermal/photoperiod season match, evapotranspiration water balance) deterministically, returning explicit reasons, warnings, and verifiable math."*

### 2. How is the suitability score calculated?
> *"The suitability score is computed on a scale of 0 to 100 based on weighted agronomic parameters:
> * **Soil Matching (35%):** Checks if the soil texture matches optimal agronomic classes (Loamy, Clay, Alluvial, Black, Sandy).
> * **Seasonal Suitability (35%):** Validates the crop's photoperiod against Kharif, Rabi, or Zaid seasons.
> * **Water Balance (30% with penalties):** High-water crops (like Paddy or Sugarcane) evaluated in water-scarce or rainfed farms incur a heavy penalty (-20 points) and critical drought warnings.
> * Final scores are categorized into 'Highly Recommended', 'Recommended', 'Moderately Suitable', or 'Risky'."*

### 3. How does the fertilizer calculator determine bags from NPK?
> *"Commercial fertilizers are not pure elemental nutrients. For instance, DAP (Diammonium Phosphate) contains 46% $P_2O_5$ and 18% Nitrogen. Urea contains 46% Nitrogen. Muriate of Potash (MOP) contains 60% $K_2O$. Our service uses stoichiometric back-calculation: it first supplies Phosphorus via DAP, subtracts the Nitrogen incidentally provided by that DAP, and then calculates the remaining Nitrogen deficit to be supplied as Urea. It then converts the total kilogram requirements into standard 50 kg farmer bags."*

### 4. What is the role of Spring Boot profiles here?
> *"We defined two profiles: the primary production profile targeting MySQL (`application.properties`) and an embedded profile (`application-h2.properties`). When presenting or testing on any machine without MySQL installed, passing `-Dspring-boot.run.profiles=h2` enables an in-memory database with the exact same schema and pre-seeded data, demonstrating software portability."*

### 5. What are the key software engineering principles applied?
> * **Separation of Concerns (SoC):** Controllers handle HTTP transport and routing; Services contain business logic; Repositories manage persistence.
> * **Defensive Programming:** Bean Validation on DTOs, `@ControllerAdvice` global exception handling, and foreign key referential integrity.
> * **Cross-Origin Resource Sharing (CORS):** Centralized `CorsConfig` allowing seamless decoupled communication between React (port 5173) and Spring Boot (port 8080).

---

## 📄 License & Attribution
Developed for B.Tech Computer Science Capstone Project. Agronomic parameters are standard reference benchmarks curated from ICAR (Indian Council of Agricultural Research) public advisory literature for educational and decision-support demonstrations.
