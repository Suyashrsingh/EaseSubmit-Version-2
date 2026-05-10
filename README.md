# README.md

## EaseSubmit Deployment Documentation

A complete deployment guide for hosting the EaseSubmit project using Docker, Docker Hub, AWS EC2, and Elastic IP.

---

# 📌 Tech Stack

* Frontend: React + Vite
* Backend: Node.js + Express.js
* Database: MongoDB Atlas
* Containerization: Docker
* Cloud Hosting: AWS EC2
* Web Server: Nginx
* Image Registry: Docker Hub

---

# 📁 Project Structure

```bash
EaseSubmit/
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🚀 Step 1: Create Dockerfile for Backend

## Backend Dockerfile

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
```

---

# 🚀 Step 2: Create Dockerfile for Frontend

## Frontend Dockerfile

```dockerfile
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

# 🚀 Step 3: Build Docker Images

## Backend

```bash
docker build -t easesubmit-backend .
```

## Frontend

```bash
docker build -t easesubmit-frontend .
```

---

# 🚀 Step 4: Tag Docker Images

## Backend

```bash
docker tag easesubmit-backend suyashrsingh0/eas-submit-backend:latest
```

## Frontend

```bash
docker tag easesubmit-frontend suyashrsingh0/eas-submit-frontend:latest
```

---

# 🚀 Step 5: Login to Docker Hub

```bash
docker login
```

Enter:

* Docker Hub Username
* Docker Hub Password / Access Token

---

# 🚀 Step 6: Push Docker Images

## Backend

```bash
docker push suyashrsingh0/eas-submit-backend:latest
```

## Frontend

```bash
docker push suyashrsingh0/eas-submit-frontend:latest
```

---

# ☁️ Step 7: Create AWS EC2 Instance

## EC2 Configuration

* OS: Ubuntu Server
* Instance Type: t2.micro / t3.micro
* Storage: As required
* Key Pair: Create new or use existing

## Allow Ports in Security Group

| Port | Purpose  |
| ---- | -------- |
| 22   | SSH      |
| 80   | HTTP     |
| 443  | HTTPS    |
| 3000 | Frontend |
| 8080 | Backend  |

---

# ☁️ Step 8: Connect to EC2

```bash
ssh -i key.pem ubuntu@YOUR_PUBLIC_IP
```

---

# ☁️ Step 9: Install Docker on EC2

## Update Packages

```bash
sudo apt update
```

## Install Docker

```bash
sudo apt install docker.io -y
```

## Start Docker

```bash
sudo systemctl start docker
```

## Enable Docker on Boot

```bash
sudo systemctl enable docker
```

## Add Ubuntu User to Docker Group

```bash
sudo usermod -aG docker ubuntu
```

Reconnect SSH after this step.

---

# ☁️ Step 10: Pull Docker Images

## Backend

```bash
docker pull suyashrsingh0/eas-submit-backend:latest
```

## Frontend

```bash
docker pull suyashrsingh0/eas-submit-frontend:latest
```

---

# ☁️ Step 11: Run Backend Container

```bash
docker run -d \
--name backend_container \
--restart unless-stopped \
-p 8080:8080 \
suyashrsingh0/eas-submit-backend:latest
```

---

# ☁️ Step 12: Run Frontend Container

```bash
docker run -d \
--name frontend_container \
--restart unless-stopped \
-p 3000:80 \
suyashrsingh0/eas-submit-frontend:latest
```

---

# 🔄 Automatic Container Restart

The option:

```bash
--restart unless-stopped
```

ensures:

* Containers automatically start after EC2 reboot
* No need to manually run containers again

---

# 🌐 Step 13: Configure Elastic IP

## Steps

1. Open AWS EC2 Dashboard
2. Go to Elastic IPs
3. Allocate Elastic IP
4. Associate with EC2 Instance

## Benefits

* Static Public IP
* IP does not change after restart
* Stable frontend/backend access

---

# ✅ Step 14: Verify Deployment

## Frontend

```bash
http://ELASTIC_IP:3000
```

## Backend Health API

```bash
http://ELASTIC_IP:8080/api/v1/health
```

---

# 📋 Useful Docker Commands

## View Running Containers

```bash
docker ps
```

## View All Containers

```bash
docker ps -a
```

## View Logs

```bash
docker logs backend_container
```

```bash
docker logs frontend_container
```

## Stop Container

```bash
docker stop backend_container
```

## Start Container

```bash
docker start backend_container
```

## Remove Container

```bash
docker rm backend_container
```

## Remove Image

```bash
docker rmi IMAGE_ID
```

---

# 🔄 Updating Application

## Step 1: Build New Image

```bash
docker build -t easesubmit-backend .
```

## Step 2: Tag Image

```bash
docker tag easesubmit-backend suyashrsingh0/eas-submit-backend:latest
```

## Step 3: Push Image

```bash
docker push suyashrsingh0/eas-submit-backend:latest
```

## Step 4: Pull Latest Image on EC2

```bash
docker pull suyashrsingh0/eas-submit-backend:latest
```

## Step 5: Remove Old Container

```bash
docker stop backend_container

docker rm backend_container
```

## Step 6: Run Updated Container

```bash
docker run -d \
--name backend_container \
--restart unless-stopped \
-p 8080:8080 \
suyashrsingh0/eas-submit-backend:latest
```

---

# 🔒 Important Notes

* Store secrets inside `.env`
* Never upload `.env` to GitHub
* Use MongoDB Atlas for production database
* Keep AWS Security Groups secure
* Use Elastic IP for permanent access
* Use Docker restart policy for auto startup

---

# 🏗️ Deployment Architecture

```text
Frontend (React + Nginx Container)
            ↓
        AWS EC2
      + Elastic IP
            ↓
Backend (Node.js + Express Container)
            ↓
      MongoDB Atlas
```

---

# 👨‍💻 Developers
Backend Development
=> **Rushikesh Wagh**
Frontend Development
=> **Ketan Dewalkar**
Deployment & DevOps
=> **Suyash Singh**


