# YourPro - Freelancing Platform

YourPro is a modern freelancing platform that connects talented professionals with companies looking to hire. The platform features a clean, user-friendly interface and robust backend functionality.

## Features

- User registration and authentication for both freelancers and companies
- Detailed freelancer profiles with skills, portfolio, and rates
- Company profiles with project posting capabilities
- Project management with status tracking
- File upload support for profile images and portfolios
- Modern, responsive UI built with React and Tailwind CSS
- Secure backend with PostgreSQL database

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/yourpro.git
   cd yourpro
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a PostgreSQL database:

   ```bash
   createdb yourpro
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following content:

   ```
   PORT=5001
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=yourpro
   JWT_SECRET=your-secret-key-here
   UPLOAD_DIR=uploads
   ```

5. Create the uploads directory:

   ```bash
   mkdir uploads
   ```

6. Initialize the database:

   ```bash
   psql -d yourpro -f src/db/schema.sql
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5001`.

## Project Structure

```
yourpro/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # React components
│   ├── config/         # Configuration files
│   ├── db/            # Database setup and migrations
│   ├── pages/         # React pages/routes
│   ├── services/      # Business logic and data access
│   ├── styles/        # CSS and style files
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main React component
│   └── index.tsx      # Application entry point
├── uploads/           # Uploaded files directory
├── .env              # Environment variables
├── package.json      # Project dependencies
├── tsconfig.json     # TypeScript configuration
└── README.md         # Project documentation
```

## API Endpoints

### Freelancers

- `POST /api/freelancers` - Register a new freelancer
- `GET /api/freelancers/:id` - Get freelancer profile
- `PUT /api/freelancers/:id` - Update freelancer profile

### Companies

- `POST /api/companies` - Register a new company
- `GET /api/companies/:id` - Get company profile
- `PUT /api/companies/:id` - Update company profile

### Projects

- `POST /api/projects` - Create a new project
- `GET /api/projects` - List all projects (with filters)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
