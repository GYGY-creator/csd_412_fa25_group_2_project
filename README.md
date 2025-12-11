SoundReviews - A food review web app with Google Maps

Overview
- Stack: Node.js (Express), Sequelize, Postgres, React (Vite), Docker
- Architecture: 3-tier (Presentation: React, Controller/Service: Express, Data: Postgres via Sequelize)
- Patterns: MVC, CRUD, RESTful
- Security: JWT auth, input validation, Helmet, rate limiting, CORS
- Public API: /api/v1 endpoints for restaurants and reviews
- External API: Google Maps for selecting and sharing restaurant locations

Repository Layout
- server/ – Express API, Sequelize models, controllers, routes, tests
- client/ – React app (Vite), pages, components, Google Maps integration
- docker-compose.yml – DB, API, Web, and test service
- infra/ – Deployment notes

Local Development
1) Prereqs: Node 18+, Docker
2) Environment: copy server/.env.example to server/.env and customize for local use if needed
3) Start stack:
   docker compose up --build
   - API on http://localhost:3000
   - Web on http://localhost:8080
4) Run migrations/seeds (optional):
   docker compose exec api npx sequelize db:migrate
   docker compose exec api npx sequelize db:seed:all

Testing (TDD)
- Tests use Jest + Supertest in the server. Integration tests connect to the Postgres service via docker-compose (service: db).
- Run tests in Docker:
   docker compose run --rm api-test
- Run tests locally (fallback using Sequelize sync):
   cd server && npm install && npm test

API Reference (Public)
Base: /api/v1
- GET /health
- Auth
  - POST /auth/register { username, email, password }
  - POST /auth/login { username, password } -> { token }
- Restaurants
  - GET /restaurants
  - GET /restaurants/:id
  - POST /restaurants (auth) { name, address, lat?, lng? }
  - PUT /restaurants/:id (auth)
  - DELETE /restaurants/:id (auth)
- Reviews
  - GET /reviews
  - GET /reviews/:id
  - POST /reviews (auth) { title, body, rating, restaurantId }
  - PUT /reviews/:id (auth)
  - DELETE /reviews/:id (auth)

Google Maps Integration
- Client uses @react-google-maps/api. Set VITE_GOOGLE_MAPS_API_KEY in client environment.
- In NewReview, users can click to place a marker and optionally save coordinates to the restaurant.

Coding Practices
- DRY: shared validation and middleware; services/controllers separated; asyncHandler utility; centralized error handling
- Conventions: RESTful routes, MVC separation (models/controllers/routes), linting via ESLint
- Error handling: global error handler, validation errors return 400, auth errors 401/403
- Security: JWT authentication, input validation, Helmet, rate limiting, CORS

Deployment (AWS Free Tier)
- Database: Amazon RDS Postgres (db.t4g.micro or free tier where available)
- Controller/API: EC2 Ubuntu 24.04 (t3.micro in free tier eligible). Install Docker on EC2 and run API container.
- Frontend: S3 static site hosting + CloudFront (free tier) for the built client
- Steps:
  1) RDS: create Postgres instance; note endpoint/port/credentials; security group: allow EC2 access
  2) EC2: launch Ubuntu 24.04, open security group inbound for HTTP (80/443 if using ALB/Nginx) and API port (3000) or place behind ALB
     - Install Docker and log in (optional ECR, else use Docker Hub)
     - Pull/build server image and run with env vars:
       docker run -d --name soundreviews-api -p 3000:3000 \
         -e NODE_ENV=production \
         -e DB_HOST=<rds-endpoint> -e DB_PORT=5432 \
         -e DB_NAME=<db-name> -e DB_USER=<db-user> -e DB_PASSWORD=<db-pass> \
         -e JWT_SECRET=<strong-secret> \
         yourrepo/soundreviews-server:latest
     - Run migrations:
       docker exec -it soundreviews-api npx sequelize db:migrate
  3) Frontend: build locally and upload dist/ to S3 bucket with static website hosting enabled
     - Set VITE_API_URL to the EC2 public URL (or ALB/CloudFront origin)
     - Example build:
       cd client && npm ci && VITE_API_URL=https://api.yourdomain.com npm run build
     - Upload dist/ to S3 (via AWS CLI):
       aws s3 sync dist s3://<your-bucket-name> --delete
     - Optionally use CloudFront to serve the S3 content globally

Environment Variables
- Server (.env): PORT, NODE_ENV, JWT_SECRET, DB_* or DATABASE_URL
- Client (.env): VITE_API_URL, VITE_GOOGLE_MAPS_API_KEY

Notes
- Google Maps API key should not be committed. Use environment variables in build/deploy.
- GitHub (free): push repo; can use GitHub Actions later for CI to run docker compose and jest.

Future Enhancements
- Role-based endpoints for admins
- Robust seeds and migrations per environment
- E2E tests (Playwright) for browser flows
- Observability (pino logging + OpenTelemetry)
