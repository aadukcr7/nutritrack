# NutriTrack Backend - Node.js/Express

A converted Node.js version of the NutriTrack API originally built with Python FastAPI. This backend provides APIs for pregnancy and baby nutrition tracking, growth monitoring, reminders, and health information.

## Directory Structure

```
backend-node/
├── src/
│   ├── config/           # Configuration files
│   │   └── index.js      # Main config (database, JWT, server settings)
│   ├── db/               # Database configuration
│   │   └── sequelize.js  # Sequelize ORM setup
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── GrowthRecord.js
│   │   ├── Reminder.js
│   │   ├── Note.js
│   │   ├── Meal.js
│   │   ├── NutritionGoal.js
│   │   ├── WaterIntake.js
│   │   ├── WeightLog.js
│   │   ├── Symptom.js
│   │   └── index.js      # Model exports
│   ├── controllers/      # Route handlers (business logic)
│   │   ├── authController.js
│   │   ├── growthController.js
│   │   ├── reminderController.js
│   │   └── staticController.js
│   ├── routes/           # Route definitions
│   │   ├── authRoutes.js
│   │   ├── growthRoutes.js
│   │   ├── reminderRoutes.js
│   │   └── staticRoutes.js
│   ├── middleware/       # Express middleware
│   │   └── auth.js       # JWT authentication & error handling
│   ├── utils/            # Utility functions
│   │   └── auth.js       # Password hashing, JWT token creation/verification
│   ├── services/         # Business logic services (optional, for complex operations)
│   └── server.js         # Main Express app & server
├── package.json          # Dependencies
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Example `.env`:
```
DATABASE_URL=sqlite://./db.sqlite
SECRET_KEY=your-secret-key-min-32-chars
PORT=8000
NODE_ENV=development
```

For MySQL:
```
DATABASE_URL=mysql://user:password@localhost:3306/nutritrack
```

### 3. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Growth Records (requires authentication)
- `GET /api/growth/records` - Get all growth records
- `POST /api/growth/records` - Create a growth record
- `GET /api/growth/records/:recordId` - Get specific record
- `PUT /api/growth/records/:recordId` - Update a record
- `DELETE /api/growth/records/:recordId` - Delete a record

### Reminders (requires authentication)
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create a reminder
- `PATCH /api/reminders/:reminderId/complete` - Mark reminder as complete
- `DELETE /api/reminders/:reminderId` - Delete a reminder

### Static Information (public)
- `GET /api/static/nutrition-tips` - Get nutrition tips
- `GET /api/static/safe-foods` - Get safe/unsafe foods list
- `GET /api/static/vaccine-schedule` - Get vaccine schedule
- `GET /api/static/feeding-guide` - Get feeding guide by age
- `GET /api/static/daily-tip` - Get a random daily tip

## Authentication

Protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Key Features

✅ **User Management** - Registration with password strength validation and JWT authentication
✅ **Growth Tracking** - Record and monitor baby/child growth metrics
✅ **Reminders** - Set and track health appointments and vaccines
✅ **Nutrition Info** - Static endpoint with nutrition, food safety, and feeding guides
✅ **CORS Support** - Configured for frontend on localhost:5173
✅ **Database Flexibility** - Works with SQLite (default) or MySQL
✅ **Modular Structure** - Clean separation of concerns

## Database Models

- **User** - User accounts with email/password authentication
- **GrowthRecord** - Height, weight, head circumference tracking
- **Reminder** - Health appointments and vaccine reminders
- **Note** - User notes and observations
- **Meal** - Food intake logging with nutritional info
- **NutritionGoal** - Daily nutritional targets
- **WaterIntake** - Hydration tracking
- **WeightLog** - Weight progression tracking
- **Symptom** - Symptom logging with severity

## Dependencies

- **express** - Web framework
- **sequelize** - ORM for database
- **mysql2** - MySQL database driver
- **sqlite3** - SQLite database (included by default)
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation/verification
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **nodemon** - Auto-reload in development

## Password Validation Rules

Passwords must contain:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character: `!@#$%^&*(),.?":{}|<>`

## Error Handling

API returns standardized error responses:

```json
{
  "detail": "Error message describing what went wrong"
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `500` - Server error

## Development

To modify the API:

1. **Add a new route** - Create a new file in `src/routes/`
2. **Add a controller** - Create a new file in `src/controllers/`
3. **Add a model** - Create a new file in `src/models/`
4. **Update config** - Modify `src/config/index.js` if needed

## Production Deployment

For production:

1. Set `NODE_ENV=production`
2. Use a strong `SECRET_KEY` (minimum 32 characters)
3. Configure MySQL or PostgreSQL database
4. Use environment variables for all secrets
5. Consider using PM2 or similar for process management
6. Set up HTTPS/SSL
7. Configure appropriate CORS origins

## License

ISC
