# Inventory App

A simple NestJS + MongoDB inventory app with authentication (single user), Dockerized for easy development, featuring **multi-language support**.

## Features

- Node.js 22 (NestJS)
- MongoDB (via Docker)
- Simple login and welcome page
- Side panel for navigation (future tabs)
- One user (created via migration script)
- **🌍 Multi-language support**: English, Russian, Armenian, Georgian
- **⚙️ Settings page** with language selector
- **🇷🇺 Russian as default language**
- **💾 Database persistence** for language preferences

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
   - Default language: `Russian`
   - (You can change these in `src/migration/create-user.ts` before running the migration.)

5. **Access the app:**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Multi-Language Support 🌍

The application supports 4 languages with **Russian as the default**:

- 🇷🇺 **Russian** (Русский) - **Default**
- 🇺🇸 **English** (English)
- 🇦🇲 **Armenian** (Հայերեն)
- 🇬🇪 **Georgian** (ქართული)

### How to Use

1. **Language Selection**: Use the language selector in the top-right corner of the login page
2. **Settings Page**: Access `/settings` to change language preferences (requires login)
3. **URL Parameter**: Add `?lng=ru` (or `en`, `hy`, `ka`) to the URL to switch languages
4. **API Endpoints**:
   - `GET /api/languages` - Get available languages
   - `GET /api/translations?lng=ru` - Get translations for a specific language

### Example URLs

- Russian (default): `http://localhost:3000` or `http://localhost:3000?lng=ru`
- English: `http://localhost:3000?lng=en`
- Armenian: `http://localhost:3000?lng=hy`
- Georgian: `http://localhost:3000?lng=ka`

### Settings Page

The settings page (`/settings`) provides:
- **Language Selection**: Visual language picker with flags
- **Real-time Updates**: Language changes are applied immediately
- **Database Persistence**: Language preference is stored in MongoDB and persists across sessions
- **User-specific Settings**: Each user can have their own language preference

### Database Persistence 💾

Language preferences are stored in the user's database record:
- **User Schema**: Each user has a `settings` field with `language` preference
- **Automatic Loading**: User's preferred language is loaded on each page visit
- **Fallback System**: Falls back to Russian if no preference is set
- **Migration Support**: Existing users are automatically updated with default settings

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
│   ├── user/           # User management with settings
│   ├── i18n/           # Internationalization
│   ├── migration/      # Database migrations
│   ├── translations/   # Language files
│   │   ├── en.json     # English
│   │   ├── ru.json     # Russian (default)
│   │   ├── hy.json     # Armenian
│   │   └── ka.json     # Georgian
│   ├── views/          # HTML templates
│   │   ├── login.html  # Login page
│   │   ├── welcome.html # Dashboard
│   │   └── settings.html # Settings page
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