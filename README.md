# Project Name

## Description
This project is a Node.js application with Express, Sequelize (with PostgreSQL), and a set of RESTful APIs for user and post management. It includes the functionality to create, read, update, and delete users and posts. Jest is used for testing the API endpoints.

## Requirements
- Node.js (v14 or later)
- npm or yarn
- PostgreSQL (or a cloud-based PostgreSQL service like Neon)
- Jest for running tests

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sailokesh-hub/Micro-Instagram-Backend.git
   cd Micro-Instagram-Backend

## Install Dependencies
     ```bash
       npm install

## API Endpoints

| Method | Endpoint                         | Description                  |
|--------|----------------------------------|------------------------------|
| POST   | /users                           | Create a new user            |
| GET    | /users                           | Get all users                |
| GET    | /users/:userId                   | Get user by ID               |
| PUT    | /users/:userId                   | Update a user by ID          |
| DELETE | /users/:userId                   | Delete a user by ID          |
| POST   | /users/:userId/posts             | Create a post for a user     |
| GET    | /users/:userId/posts             | Get all posts by a user      |
| PUT    | /users/:userId/posts/:postId     | Update a post by ID          |
| DELETE | /users/:userId/posts/:postId     | Delete a post by ID          |

