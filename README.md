# Micro Instagram Backend

## Description
This project is a Node.js application with Express, Sequelize (with PostgreSQL), and a set of RESTful APIs for user and post management. It includes the functionality to create, read, update, and delete users and posts. Jest is used for testing the API endpoints.

## Accessing the Live Application

You can access the live version of the application at:

[Live Application](https://micro-instagram-backend-git-main-sailokesh-hubs-projects.vercel.app/api)


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
2. **install all dependencies type below command in the cloned repository**

       npm install

## Running the Application Locally

3. **Start the Server by typing below command**

       npm start
   
 **Access the application: Open your browser and navigate to http://localhost:3001/. if you see Server Running message in browser then server started succufully.**

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

## Testing the Application

### Run Test Cases Using Jest:

#### Execute Tests:

       npm test

