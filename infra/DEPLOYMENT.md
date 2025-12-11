AWS Deployment Guide (Free Tier)

Components
- RDS Postgres: soundreviews (db.t4g.micro)
- EC2 Ubuntu 24.04 (t3.micro): runs the API container
- S3 + CloudFront: hosts React static site

Steps
1) RDS Postgres
   - Create RDS PostgreSQL instance (free tier eligible). Note endpoint, db name, user, password.
   - Security Group: allow inbound 5432 only from EC2 SG (not from the world).

2) EC2 Instance
   - Launch Ubuntu Server 24.04 (t3.micro). Assign a security group allowing inbound 80/443 (or 3000 for direct API access).
   - SSH into instance. Install Docker:
     sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg
     sudo install -m 0755 -d /etc/apt/keyrings
     curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
     echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
     sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io
   - Pull and run the API container (from Docker Hub or GitHub Container Registry):
     docker run -d --name soundreviews-api -p 3000:3000 \
       -e NODE_ENV=production \
       -e DB_HOST=<rds-endpoint> -e DB_PORT=5432 \
       -e DB_NAME=<db-name> -e DB_USER=<db-user> -e DB_PASSWORD=<db-pass> \
       -e JWT_SECRET=<strong-secret> \
       yourrepo/soundreviews-server:latest
   - Initialize DB schema:
     docker exec -it soundreviews-api npx sequelize db:migrate

3) Frontend on S3/CloudFront
   - Build locally:
     cd client
     npm ci
     VITE_API_URL=https://<ec2-public-dns-or-domain>:3000 npm run build
   - Create S3 bucket (enable static website hosting)
   - Upload build:
     aws s3 sync dist s3://<bucket> --delete
   - Optional: Create CloudFront distribution with the S3 bucket as origin. Configure error pages for SPA routing.

4) DNS (optional)
   - Point a domain to CloudFront for the frontend
   - For API, set up an A record to EC2 or place behind an ALB and use HTTPS via ACM and a reverse proxy (e.g., Nginx or AWS ALB).

Security Notes
- Restrict RDS to EC2 SG access only
- Set strong JWT_SECRET
- Keep OS and Docker images updated
- Consider a reverse proxy and HTTPS termination
