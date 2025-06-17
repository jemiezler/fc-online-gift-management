# FC Online Gift Management

A full-stack application for managing gifts, questions, and answers for FC Online events. This project consists of a backend (NestJS) and a frontend (Next.js + Tailwind CSS).

## Project Structure

- `backend/` — NestJS API server
- `frontend/` — Next.js web application

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (install with `npm install -g pnpm`)

---

## Backend Setup

1. **Install dependencies:**
   ```sh
   cd backend
   pnpm install
   ```

2. **Configure Environment Variables:**
   - Copy `.env.example` to `.env` (create `.env.example` if it does not exist).
   - Edit `.env` to set your environment variables (e.g., database connection, JWT secret, etc.).
   - Example:
     ```env
     MONGODB_URI=mongodb://localhost:27017/fc-online
     JWT_SECRET=your-secret-key
     PORT=3001
     ```

3. **Run the backend server:**
   ```sh
   pnpm start:dev
   ```
   The server will start on the port specified in your `.env` (default: 3001).

---

## Frontend Setup

1. **Install dependencies:**
   ```sh
   cd frontend
   pnpm install
   ```

2. **Configure Environment Variables:**
   - Copy `.env.example` to `.env` (create `.env.example` if it does not exist).
   - Edit `.env` to set your environment variables (e.g., API base URL).
   - Example:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:3001
     ```

3. **Run the frontend app:**
   ```sh
   pnpm dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Changing Environment Variables (ENV)

- Both backend and frontend use `.env` files for configuration.
- To change environment variables:
  1. Open the `.env` file in the respective folder (`backend/` or `frontend/`).
  2. Edit the variable values as needed.
  3. Restart the server or app to apply changes.

---

## License

This project is released under a custom permissive license:

- You may use, modify, and distribute this software for any purpose, personal or commercial.
- Attribution to the original author is required.
- The software is provided "as is" without warranty of any kind. Use at your own risk.
- Contributions are welcome and should be clearly marked as such.

For the full license text, see the LICENSE file in this repository.

---

## Contact
For questions or support, please contact the project maintainer.
Nattawat Nattachansit (+66)99-2900945
