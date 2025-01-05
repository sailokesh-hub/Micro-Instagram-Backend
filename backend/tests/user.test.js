const request = require("supertest");
const app = require("../app");
const sequelize = require("../config/database");
const User = require("../models/User");
const Post = require("../models/Post")

describe("POST /users", () => {
  // Sync database before running tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Cleanup: Clear users after each test
  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  // Close the database connection after all tests
  // afterAll(async () => {
  //   await sequelize.close();
  // });

  it("should create a user with valid data", async () => {
    const userData = {
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    };

    // Make sure user doesn't exist before testing
    await User.destroy({ where: { mobile_number: userData.mobile_number } });

    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User created successfully");
    expect(response.body.user).toMatchObject(userData);

    // Verify user in the database
    const userInDb = await User.findOne({ where: { mobile_number: userData.mobile_number } });
    expect(userInDb).not.toBeNull();
    expect(userInDb.name).toBe(userData.name);
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app).post("/api/users").send({
      name: "Test User",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "All fields are required: name, mobile_number, and address."
    );
  });

  it("should return 409 if mobile_number is not unique", async () => {
    const userData = {
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    };

    // Create the first user
    await User.create(userData);

    // Attempt to create a second user with the same mobile number
    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message", "Mobile number already in use.");
  });

  it("should return 500 if there is a server error", async () => {
    jest.spyOn(User, "create").mockImplementation(() => {
      throw new Error("Test server error");
    });

    const response = await request(app).post("/api/users").send({
      name: "Error User",
      mobile_number: "1234567899",
      address: "Error Street",
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Error creating user");

    // Restore the original implementation
    User.create.mockRestore();
  });
});



describe("GET /users", () => {
  // Sync database before running tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Cleanup: Clear users after each test
  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  // Close the database connection after all tests
  // afterAll(async () => {
  //   await sequelize.close();
  // });

  it("should return all users", async () => {
    const usersData = [
      { name: "User One", mobile_number: "1234567890", address: "123 Street" },
      { name: "User Two", mobile_number: "9876543210", address: "456 Street" },
    ];

    // Seed database with users
    await User.bulkCreate(usersData);

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(usersData.length);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(usersData[0]),
        expect.objectContaining(usersData[1]),
      ])
    );
  });

  it("should return an empty array if no users are found", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return 500 if there is a server error", async () => {
    jest.spyOn(User, "findAll").mockImplementation(() => {
      throw new Error("Test server error");
    });

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Error retrieving users");

    // Restore the original implementation
    User.findAll.mockRestore();
  });
});



describe("GET /posts", () => {
  // Sync database before running tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Cleanup: Clear posts and users after each test
  afterEach(async () => {
    await Post.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  // Close the database connection after all tests
  // afterAll(async () => {
  //   await sequelize.close();
  // });

  it("should return all posts", async () => {
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });

    const postsData = [
      {
        title: "Post One",
        description: "This is the first test post.",
        images: ["image1.png"],
        user_id: user.id,
      },
      {
        title: "Post Two",
        description: "This is the second test post.",
        images: ["image2.png"],
        user_id: user.id,
      },
    ];

    // Seed database with posts
    await Post.bulkCreate(postsData);

    const response = await request(app).get("/api/posts");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(postsData.length);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(postsData[0]),
        expect.objectContaining(postsData[1]),
      ])
    );
  });

  it("should return an empty array if no posts are found", async () => {
    const response = await request(app).get("/api/posts");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return 500 if there is a server error", async () => {
    jest.spyOn(Post, "findAll").mockImplementation(() => {
      throw new Error("Test server error");
    });

    const response = await request(app).get("/api/posts");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Error retrieving posts");

    // Restore the original implementation
    Post.findAll.mockRestore();
  });
});



describe("POST /users/:userId/posts", () => {
  // Sync database before running tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Cleanup: Clear posts and users after each test
  afterEach(async () => {
    await Post.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  // Close the database connection after all tests
  // afterAll(async () => {
  //   await sequelize.close();
  // });

  it("should create a post for a valid user", async () => {
    // Create a user to associate the post with
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });

    const postData = {
      title: "Test Post Title",
      description: "This is a test post description.",
      images: ["image1.jpg", "image2.jpg"],
    };

    const response = await request(app)
      .post(`/api/users/${user.id}/posts`)
      .send(postData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Post created successfully");
    expect(response.body.post).toMatchObject({
      title: postData.title,
      description: postData.description,
      images: postData.images,
      user_id: user.id,
    });

    // Verify the post in the database
    const postInDb = await Post.findOne({ where: { user_id: user.id } });
    expect(postInDb).not.toBeNull();
    expect(postInDb.title).toBe(postData.title);
  });

  it("should return 404 if user does not exist", async () => {
    const postData = {
      title: "Test Post Title",
      description: "This is a test post description.",
      images: ["image1.jpg", "image2.jpg"],
    };

    const response = await request(app)
      .post(`/api/users/999/posts`)
      .send(postData); // Assuming user ID 999 does not exist

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User with the given user_id does not exist.");
  });

  it("should return 400 if required fields are missing", async () => {
    // Create a user to associate the post with
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });

    const response = await request(app)
      .post(`/api/users/${user.id}/posts`)
      .send({
        description: "Missing title field",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Title and description are required.");
  });

  it("should return 500 if there is a server error", async () => {
    // Mock the `create` method to throw an error
    jest.spyOn(Post, "create").mockImplementation(() => {
      throw new Error("Test server error");
    });

    // Create a user to associate the post with
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });

    const postData = {
      title: "Test Post Title",
      description: "This is a test post description.",
      images: ["image1.jpg", "image2.jpg"],
    };

    const response = await request(app)
      .post(`/api/users/${user.id}/posts`)
      .send(postData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "An error occurred while creating the post.");

    // Restore the original implementation
    Post.create.mockRestore();
  });
});

describe("GET /users/:userId/posts", () => {
  // Sync database before running tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Cleanup: Clear posts and users after each test
  afterEach(async () => {
    await Post.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  // Close the database connection after all tests
  // afterAll(async () => {
  //   await sequelize.close();
  // });

  it("should return all posts for a valid user", async () => {
    // Create a user
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });

    // Create posts for the user
    const posts = await Post.bulkCreate([
      { title: "Post 1", description: "Description 1", images: ["image1.jpg"], user_id: user.id },
      { title: "Post 2", description: "Description 2", images: ["image2.jpg"], user_id: user.id },
    ]);

    const response = await request(app).get(`/api/users/${user.id}/posts`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Post 1", description: "Description 1" }),
        expect.objectContaining({ title: "Post 2", description: "Description 2" }),
      ])
    );
  });

  it("should return 404 if user does not exist", async () => {
    const response = await request(app).get("/api/users/999/posts"); // Assuming user ID 999 does not exist

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("should return an empty array if the user has no posts", async () => {
    // Create a user with no posts
    const user = await User.create({
      name: "Test User No Posts",
      mobile_number: "0987654321",
      address: "456 Empty Street",
    });

    const response = await request(app).get(`/api/users/${user.id}/posts`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return 500 if there is a server error", async () => {
    jest.spyOn(Post, "findAll").mockImplementation(() => {
      throw new Error("Test server error");
    });

    // Create a user
    const user = await User.create({
      name: "Error User",
      mobile_number: "1122334455",
      address: "Error Street",
    });

    const response = await request(app).get(`/api/users/${user.id}/posts`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Error retrieving posts");

    // Restore the original implementation
    Post.findAll.mockRestore();
  });
});

describe("PUT /users/:userId/posts/:postId", () => {
  // Sync database before running tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Cleanup: Clear posts and users after each test
  afterEach(async () => {
    await Post.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  // Close the database connection after all tests
  // afterAll(async () => {
  //   await sequelize.close();
  // });

  it("should update a post for a valid user and post ID", async () => {
    // Create a user
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });

    // Create a post for the user
    const post = await Post.create({
      title: "Original Title",
      description: "Original Description",
      images: ["original.jpg"],
      user_id: user.id,
    });

    const updatedData = {
      title: "Updated Title",
      description: "Updated Description",
      images: ["updated.jpg"],
    };

    const response = await request(app)
      .put(`/api/users/${user.id}/posts/${post.id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedData);

    // Verify the post was updated in the database
    const updatedPost = await Post.findByPk(post.id);
    expect(updatedPost.title).toBe(updatedData.title);
    expect(updatedPost.description).toBe(updatedData.description);
    expect(updatedPost.images).toEqual(updatedData.images);
  });

  it("should return 404 if the post does not exist for the given user", async () => {
    // Create a user
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });

    const response = await request(app)
      .put(`/api/users/${user.id}/posts/999`) // Assuming post ID 999 does not exist
      .send({
        title: "New Title",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Post not found");
  });

  it("should return 404 if the user does not exist", async () => {
    const response = await request(app)
      .put(`/api/users/999/posts/1`) // Assuming user ID 999 does not exist
      .send({
        title: "New Title",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Post not found");
  });

  it("should return 400 if there is a validation or update error", async () => {
    // Create a user
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });
  
    // Create a post for the user
    const post = await Post.create({
      title: "Original Title",
      description: "Original Description",
      images: ["original.jpg"],
      user_id: user.id,
    });
  
    // Mock the `update` method to throw an error
    jest.spyOn(Post.prototype, "update").mockImplementation(() => {
      throw new Error("Validation error");
    });
  
    const response = await request(app)
      .put(`/api/users/${user.id}/posts/${post.id}`)
      .send({
        title: "Invalid Data",
      });
  
    expect(response.status).toBe(400); // Ensure the response status is 400
    expect(response.body).toHaveProperty("message", "Error updating post"); // Validate the error message
  
    // Restore the original implementation
    Post.prototype.update.mockRestore();
  });
  
});

describe("DELETE /users/:userId/posts/:postId", () => {
  // Sync database before running tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Cleanup: Clear posts and users after each test
  afterEach(async () => {
    await Post.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  // Close the database connection after all tests
  afterAll(async () => {
    await sequelize.close();
  });

  it("should delete a post successfully", async () => {
    // Create a user
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });

    // Create a post for the user
    const post = await Post.create({
      title: "Test Title",
      description: "Test Description",
      images: ["test.jpg"],
      user_id: user.id,
    });

    // Send DELETE request
    const response = await request(app).delete(`/api/users/${user.id}/posts/${post.id}`);

    expect(response.status).toBe(204); // No content status for successful delete

    // Verify the post is deleted
    const deletedPost = await Post.findByPk(post.id);
    expect(deletedPost).toBeNull();
  });

  it("should return 404 if the post does not exist", async () => {
    // Create a user
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });

    // Attempt to delete a non-existing post
    const response = await request(app).delete(`/api/users/${user.id}/posts/9999`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Post not found");
  });

  it("should return 404 if the user does not exist", async () => {
    // Attempt to delete a post for a non-existing user
    const response = await request(app).delete(`/api/users/9999/posts/1`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Post not found");
  });

  it("should return 400 if there is an error during deletion", async () => {
    // Mock the destroy method to throw an error
    jest.spyOn(Post.prototype, "destroy").mockImplementation(() => {
      throw new Error("Deletion error");
    });

    // Create a user
    const user = await User.create({
      name: "Test User",
      mobile_number: "1234567890",
      address: "123 Test Street",
    });

    // Create a post for the user
    const post = await Post.create({
      title: "Test Title",
      description: "Test Description",
      images: ["test.jpg"],
      user_id: user.id,
    });

    // Attempt to delete the post
    const response = await request(app).delete(`/api/users/${user.id}/posts/${post.id}`);

    expect(response.status).toBe(400); // Bad request status for error during deletion
    expect(response.body).toHaveProperty("message", "Error deleting post");

    // Restore the original implementation
    Post.prototype.destroy.mockRestore();
  });
});
