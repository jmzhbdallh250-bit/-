# Malaab (Venues & Formation) - Local Dev

Assumptions:
- Backend: Node.js + Express + Prisma + PostgreSQL (Docker)
- Frontend: Expo React Native
- Image upload: local /uploads (demo)
- Auth: Guest + Email/Password (no username)

Quick start:

1) Clone files to project root with two folders: backend/ and mobile/

2) Backend
- cd backend
- cp .env.example .env  (edit DATABASE_URL if needed)
- docker-compose up -d   (starts postgres)
- npm install
- npx prisma generate
- npx prisma migrate dev --name init
- node prisma/seed.js
- npm run dev

3) Mobile (Expo)
- cd mobile
- npm install
- npx expo start

API base URL:
- Default: http://localhost:4000
- If using mobile dev on physical device, expose backend to LAN or use ngrok/tunnel.

If you want: I can prepare a ZIP of this scaffold or push to a GitHub repo you provide.
