# Anaphy E-Learning Platform

## About the Project

Anaphy E-Learning is a web-based platform designed to provide an interactive and comprehensive learning experience for students studying Anatomy and Physiology. This platform is part of our capstone project and aims to combine engaging content with an intuitive interface to make complex subjects more accessible.

This project utilizes modern technologies to ensure scalability, responsiveness, and maintainability.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Containerization:** Docker
- **Styling:** CSS

## Prerequisites
To run this project locally, ensure you have the following installed:
- Docker Desktop
- Node.js (if running outside Docker)

## Getting Started

Follow these steps to set up the project locally using Docker:

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/anaphy-elearning.git
cd anaphy-elearning
```

### 2. Set Up Environment Variables
Create a `.env` file in the project root. This file should include necessary configuration details such as the client URL, database URI, authentication details, and the server port. Below are the typical values for local development:

```
CLIENT=<your client port>
MONGO_URI=<your MongoDB connection string>
USER=<your email or username for email sending>
PASSWORD=<your password for email sending>
SECRET_KEY=<your secret key for jwt>
PORT=<yoour server port>
```

### 3. Build and Run with Docker
Ensure Docker is running on your system, then execute the following commands:

```bash
# Build the Docker containers
docker-compose build

# Start the Docker containers
docker-compose up
```

### 4. Access the Application
Once the containers are up and running, you can access the application at:
```
http://localhost:5173
```
The backend API will be available at:
```
http://localhost:5000
```

### 5. Stopping the Containers
To stop the running containers, press `CTRL+C` in the terminal where Docker is running, or use the following command:
```bash
docker-compose down
```

## Project Structure
```
.
├── client               # Frontend code (React.js)
├── server               # Backend code (Node.js and Express.js)
├── docker-compose.yml   # Docker Compose configuration
├── README.md            # Project documentation
```

## Contribution
If you'd like to contribute to this project, please fork the repository and create a pull request. We welcome any suggestions or improvements!

## License
This project is licensed under the MIT License. See `LICENSE` for more details.

