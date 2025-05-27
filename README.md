# BE_nodejs - Teacher Management API

## Overview

This project implements a set of API endpoints for teachers to perform administrative functions for their classes.  
Built with **Node.js** and **MySQL**, it supports core features such as registering students, suspending students, retrieving common students among teachers, and fetching notification recipients.

---

## Hosted API

The API is deployed on a VPS with the following IP address:  
**14.225.206.247**

You can test the endpoints by sending requests to this IP (e.g., `http://14.225.206.247:<port>/api/...`).

**Example:**  
`http://14.225.206.247:3000/api/commonstudents?teacher=john.smith@school.edu&teacher=emily.jones@school.edu`

---

## Project Structure
```
BE_nodejs/
├── src/
│   ├── controller/                                # Route handlers / Controllers
│   ├── service/                                   # Business logic
│   ├── repository/                                # Data access layer (DB queries)
      ├── teacher.repository.interface.ts          # Interface for TeacherRepository
      ├── mysql.teacher.repository.ts              # MySQL2 driver implementation
│   ├── middleware/                                # Express middlewares
│   ├── database/                                  # Configuration files to connect to db
│   └── app.ts, server.ts                          # Entry point of the app
├── test/                                          # Unit tests
├── docker-compose.yml                             # Docker compose file to run the app + DB
├── Dockerfile                                     # Dockerfile for building the app image
├── .env.example                                   # Example environment variables file
├── package.json                                   # Node.js dependencies and scripts
└── README.md                                      # This documentation file
└── postman_collection.json                        # postman json file to import

```
---

## Running Locally

### Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/)
- Install [Docker Compose](https://docs.docker.com/compose/install/)

### Steps

1. Clone the repository:
```
git clone https://github.com/khanhnhqdev/BE_nodejs.git
cd <repository-folder>
```

2. Copy the example environment file and configure your .env variables
```
cp .env.example .env
# Edit .env to set your environment variables if needed
```

3. Run Docker Compose to start the app and MySQL
```
docker-compose up -d
```

4. Testing
```
npm install
npm run test
```

## Notes

- Currently, database query results are not strictly typed to the defined TypeScript interfaces (`Student`, `Teacher`).
- Query results are loosely typed as `any` or similar for simplicity.
- If query results or data structures become more complex, or are returned to other layers, proper mapping and typing with interfaces will be added.

