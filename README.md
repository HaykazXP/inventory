# Inventory App

A simple NestJS + MongoDB inventory app with authentication (single user), Dockerized for easy development, featuring **multi-language support** and **complete product management**.

## Features

- Node.js 22 (NestJS)
- MongoDB (via Docker)
- Simple login and welcome page
- Side panel for navigation
- One user (created via migration script)
- **🌍 Multi-language support**: English, Russian, Armenian, Georgian
- **⚙️ Settings page** with language selector
- **🇷🇺 Russian as default language**
- **💾 Database persistence** for language preferences
- **📦 Complete Product Management**: CRUD operations with price history tracking
- **📊 Price History**: Automatic tracking of price changes with dates
- **🎨 Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **🔍 Real-time Updates**: Instant feedback for all operations

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

4. **Run the migrations to create the default user and sample products:**

   ```bash
   # Create default user
   docker compose exec app npm run migrate:user
   
   # Create sample products (optional)
   docker compose exec app npm run migrate:products
   ```

   - Default username: `admin`
   - Default password: `admin123`
   - Default language: `Russian`
   - Sample products: 5 products with price history
   - (You can change these in the migration files before running.)

5. **Access the app:**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Product Management 📦

The application now includes a complete product management system:

### Features

- **Create Products**: Add new products with name and price
- **Edit Products**: Update product information and prices
- **Delete Products**: Remove products with confirmation
- **Price History**: Automatic tracking of all price changes with dates
- **Modern UI**: Beautiful card-based layout with modals
- **Real-time Updates**: Instant feedback for all operations

### Product Schema

Each product includes:
- **Name**: Product name (required, 1-100 characters)
- **Price**: Current price (required, minimum $0.01)
- **Old Prices**: Historical price records with dates
- **Timestamps**: Creation and update timestamps

### Price History Tracking

- **Automatic Tracking**: When a product's price is updated, the old price is automatically saved with the current date
- **Date Format**: Prices are tracked using YYYY-MM-DD format
- **History View**: Click "View Price History" to see all historical prices
- **Sorted Display**: Price history is displayed in reverse chronological order

### API Endpoints

- `GET /products` - List all products (renders products page)
- `POST /products` - Create a new product
- `GET /products/:id` - Get a specific product
- `PATCH /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product
- `POST /products/:id/price` - Update product price (with history tracking)
- `GET /products/:id/history` - Get price history for a product

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
│   ├── product/        # Product management with CRUD operations
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.schema.ts
│   │   └── product.module.ts
│   ├── i18n/           # Internationalization
│   ├── migration/      # Database migrations
│   │   ├── create-user.ts
│   │   └── create-products.ts
│   ├── translations/   # Language files
│   │   ├── en.json     # English
│   │   ├── ru.json     # Russian (default)
│   │   ├── hy.json     # Armenian
│   │   └── ka.json     # Georgian
│   ├── views/          # HTML templates
│   │   ├── login.html  # Login page
│   │   ├── welcome.html # Dashboard
│   │   ├── products.html # Products management page
│   │   └── settings.html # Settings page
│   ├── app.module.ts   # Main module
│   └── main.ts         # Application entry point
├── Dockerfile          # Node.js container
├── docker-compose.yml  # Multi-container setup
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

---

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build the application
- `npm run migrate:user` - Create default user
- `npm run migrate:products` - Create sample products
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

---

### License

MIT