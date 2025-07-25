# Inventory App

A simple NestJS + MongoDB inventory app with authentication (single user), Dockerized for easy development.

## Features

- Node.js 22 (NestJS)
- MongoDB (via Docker)
- Simple login and welcome page
- Side panel for navigation (future tabs)
- One user (created via migration script)

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

---

### Setup

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd inventory
   ```

2. **Create your `.env` file:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` if you want to change the session secret or MongoDB URI.

3. **Build and start the containers:**

   ```bash
   docker compose up --build
   ```

4. **Run the migration to create the default user:**

   ```bash
   docker compose exec app npm run migration:create-user
   ```

   - Default username: `admin`
   - Default password: `admin123`
   - (You can change these in `src/migration/create-user.ts` before running the migration.)

5. **Access the app:**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Development

- The app code is mounted as a volume, so changes on your host are reflected in the container.
- To install new dependencies, run:
  ```bash
  docker compose exec app npm install <package>
  ```

---

### Stopping

To stop the app and MongoDB:

```bash
docker compose down
```

---

### Project Structure

```
inventory/
├── src/
│   ├── auth/           # Authentication module
│   ├── user/           # User management
│   ├── migration/      # Database migrations
│   ├── views/          # HTML templates
│   ├── app.module.ts   # Main module
│   └── main.ts         # Application entry point
├── Dockerfile          # Node.js container
├── docker-compose.yml  # Multi-container setup
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

---

### License

MIT