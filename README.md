# Database Concurrency Control Simulator for Inventory Management

## 📌 Overview

This project demonstrates **database concurrency control mechanisms** in a multi-user inventory system using:

* **Pessimistic Locking**
* **Optimistic Locking**

It simulates concurrent purchase requests and shows how different strategies prevent:

* Lost updates
* Overselling stock
* Data inconsistency

The application is fully containerized using **Docker Compose** and includes a PostgreSQL database, backend API, and frontend UI.

---

## 🛠️ Tech Stack

| Layer               | Technology              |
| ------------------- | ----------------------- |
| Backend             | Node.js + Express       |
| Database            | PostgreSQL              |
| Frontend            | React (Vite)            |
| Containerization    | Docker & Docker Compose |
| Concurrency Testing | Bash Scripts + cURL     |

---

## ⚙️ How Concurrency Is Implemented

### 🔐 Pessimistic Locking

* Locks product row before updating using:

```sql
SELECT ... FOR UPDATE
```

* Prevents other transactions from modifying the row.
* Safer but reduces concurrency.

---

### ⚡ Optimistic Locking

* Uses a `version` column.
* Update succeeds only if version matches:

```sql
UPDATE products
SET stock = ?, version = version + 1
WHERE id = ? AND version = ?
```

* Retries transaction up to **3 times with exponential backoff**.
* Higher concurrency, detects conflicts instead of blocking.

---

## 📂 Project Structure

```
Simulator for Inventory Management/
│
├── backend/                # Express API
├── frontend/               # React UI
├── seeds/init.sql          # DB schema + seed data
├── scripts/
│   ├── concurrent-test.sh  # Simulates concurrent users
│   └── monitor-locks.sh    # Displays DB locks
├── docker-compose.yml
└── README.md
```

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository

```
git clone <repo-url>
cd Simulator-for-Inventory-Management
```

---

### 2️⃣ Start Application (Docker)

```
docker-compose up --build
```

This launches:

* Backend → `http://localhost:8080`
* Frontend → `http://localhost:5173`
* PostgreSQL → Port `5432`

---

### 3️⃣ Verify Application Health

Open:

```
http://localhost:8080/health
```

Expected response:

```
OK
```

---

## 🗄️ Database Initialization

On startup, Docker runs:

```
seeds/init.sql
```

This creates:

### Products Table

| Column  | Description                         |
| ------- | ----------------------------------- |
| id      | Primary key                         |
| name    | Product name                        |
| stock   | Available quantity (≥ 0 constraint) |
| version | Used for optimistic locking         |

### Orders Table

Tracks success/failure of transactions.

---

## 📡 API Endpoints

### Get Product

```
GET /api/products/{id}
```

---

### Reset Inventory

```
POST /api/products/reset
```

Resets stock to initial seed values.

---

### Place Order (Pessimistic)

```
POST /api/orders/pessimistic
```

---

### Place Order (Optimistic)

```
POST /api/orders/optimistic
```

---

### Get Order Statistics

```
GET /api/orders/stats
```

Returns counts of:

* SUCCESS
* FAILED_OUT_OF_STOCK
* FAILED_CONFLICT

---

## 🧪 Concurrency Testing

### Run Pessimistic Test

```
./scripts/concurrent-test.sh pessimistic
```

### Run Optimistic Test

```
./scripts/concurrent-test.sh optimistic
```

Each script fires **20 simultaneous purchase requests**.

---

## 🔍 Monitor Database Locks

```
./scripts/monitor-locks.sh
```

Shows active PostgreSQL locks (`pg_locks`) to visualize pessimistic locking behavior.

---

## 📊 Expected Behavior

| Scenario                          | Result                 |
| --------------------------------- | ---------------------- |
| Multiple users buy simultaneously | No negative stock      |
| Pessimistic mode                  | Requests serialized    |
| Optimistic mode                   | Some retries/conflicts |
| Stock exhausted                   | Orders rejected safely |

---

## 🧠 Key Learning Outcomes

✔ Implemented transactional integrity
✔ Compared pessimistic vs optimistic strategies
✔ Prevented race conditions in high-contention systems
✔ Used Docker for reproducible environments
✔ Simulated real-world e-commerce concurrency problems

---

## 📦 Environment Variables

Example `.env.example`:

```
API_PORT=8080
DATABASE_URL=postgresql://user:password@db:5432/inventory_db
```

---

## ▶️ How to Stop the System

```
docker-compose down
```

---

## ✅ Conclusion

This simulator demonstrates how proper concurrency control ensures:

* Consistent inventory under heavy load
* Reliable transaction handling
* Scalable multi-user database operations

It models real-world backend challenges faced in **e-commerce, booking systems, and financial platforms**.

---

## 👩‍💻 Author

**Tanoo Sree**
Computer Science Student
Full-Stack Developer (React + Node.js)

---
