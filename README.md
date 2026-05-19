# HealthBridge – A Collaborative HealthCare Platform

HealthBridge is a centralized, microservices-based healthcare platform designed to seamlessly connect patients, doctors, hospital administrators, and ambulance drivers. By offering real-time emergency coordination, telemedicine access, and AI-driven medical record insights, HealthBridge ensures timely, efficient, and accessible healthcare delivery.

## 🚀 Key Features

### 🚑 Emergency & Transport Services
* **Login-Free Emergency Access:** Instant ambulance booking and nearby hospital discovery without the friction of signing in.
* **Smart Ambulance Allocation:** AI-based dispatch using real-time location, traffic conditions, urgency, and hospital capacity.
* **Real-Time GPS Tracking:** Optimized routing and navigation for ambulance drivers to reduce delays during the "golden hour."

### 🏥 Telemedicine & Consultations
* **Virtual Care:** Integrated telemedicine platform supporting chat, audio, and adaptive video consultations.
* **Low-Network Support:** Accessible communication tools designed to work efficiently even in remote or low-connectivity areas.

### 📁 Smart Medical Records
* **Secure Document Management:** Centralized, encrypted storage of chronological patient records.
* **AI Report Summarizer:** Automatically analyzes multiple reports to generate two views: a simplified summary for patients and a detailed clinical timeline for doctors.

### ⚙️ Role-Based Dashboards
* **Patients:** Easy booking, health tracking, and direct communication.
* **Doctors:** Smart scheduling, fast access to summarized records, and unified patient tracking.
* **Ambulance Drivers:** Traffic updates, patient condition pre-briefs, and fastest-route navigation.
* **Admins:** Real-time visibility into hospital beds, ICU capacity, blood bank status, and staff coordination.

## 🛠️ Tech Stack

**Frontend:**
* [Vite](https://vitejs.dev/) - Blazing fast frontend tooling.
* [React](https://reactjs.org/) - UI library for building the lightweight, accessible user interface.
* [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for a calm, light-themed, and responsive design.

**Backend:**
* [Java](https://www.java.com/) & [Spring Boot](https://spring.io/projects/spring-boot) - Robust framework handling the microservices architecture.
* [PostgreSQL](https://www.postgresql.org/) + `pgvector` - Relational database and vector search for medical record retrieval.

## Prerequisites
* Node.js (v18+)
* Java 21+
* Maven or Gradle
* PostgreSQL Server with `pgvector`

## Deployment

Use the step-by-step guide in [DEPLOYMENT.md](/Users/adityadebnath/Projects/Playground/Collaborative-HealthCare-Platform/DEPLOYMENT.md) to deploy:
- `frontend/` to Vercel
- `backend/` to Render

## Database Setup For Teams

Right now the backend supports both a local database and a shared team database, but they are not the same thing:

* `jdbc:mysql://127.0.0.1:3306/...` or `jdbc:mysql://localhost:3306/...` means **your own machine only**.
* A real shared database must point to a **single remote MySQL host** that every teammate can reach, such as `jdbc:mysql://your-db-host:3306/healthcare_platform`.

If every teammate uses `localhost` in `DB_URL`, each person gets a different database even if the database name is the same.

### Recommended team setup

1. Create one shared MySQL database on a host everyone can access.
2. Give the team the same `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` for that shared database.
3. Keep JWT secrets identical across the team as well, otherwise tokens created on one backend may fail on another.
4. Start the backend without forcing the `local` profile when you want the shared database.

Example shared configuration:

```properties
DB_URL=jdbc:mysql://YOUR_REMOTE_HOST:3306/healthcare_platform?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=shared_user
DB_PASSWORD=shared_password
JWT_ACCESS_SECRET=replace-with-team-secret
JWT_REFRESH_SECRET=replace-with-team-secret
```

### Local-only development

If someone wants an isolated local database for testing, they can explicitly run with the `local` profile:

```bash
cd backend
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```

The `local` profile defaults the database URL to:

```properties
jdbc:mysql://127.0.0.1:3306/healthcare_platform?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

### Important note

Do not commit real database passwords or JWT secrets into the repository. Keep them in local environment files or your shell environment instead.

<!--## 📦 Local Setup & Installation
### Frontend Setup (Vite + React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```
### Backend Setup (Spring Boot)
1. Navigate to the backend directory:
    ```
    cd backend
    ```

2. Configure your MySQL database credentials in src/main/resources/application.properties:
    ```bash
    Properties
    spring.datasource.url=jdbc:mysql://localhost:3306/healthbridge
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    ```
3. Run the Spring Boot application:
    ```bash
    ./mvnw spring-boot:run
    ```
#### 👥 Target Users

* **Patients**: Individuals (especially elderly or critical care) needing quick emergency help, transport, or virtual consultations.
* **Doctors**: Medical professionals needing streamlined records and optimized scheduling.
* **Ambulance Drivers**: Emergency responders needing fast routes and clear patient coordination.
* **Healthcare Admins**: Hospital managers overseeing real-time facility resources and staff workload.-->
