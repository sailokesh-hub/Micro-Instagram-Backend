const request = require("supertest");
const app = require("../app"); // Import the app (already set up with routes)
const { User } = require("../models"); // Sequelize User model
const sequelize = require("../config/database");

describe("POST /api/users", () => {
  beforeAll(async () => {
    // Sync the database for testing purposes
    await sequelize.sync({ force: true }); // Clears all tables before tests
  });

  afterEach(async () => {
    // Clean up any data in the database after each test if needed
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    // Close the connection after all tests are done
    await sequelize.close();
  });

  it("should create a user with valid input", async () => {
    const newUser = {
      name: "John Doe",
      mobile_number: "1234567890",
      address: "123 Main St",
    };

    const response = await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201);

    expect(response.body.message).toBe("User created successfully");
    expect(response.body.user.name).toBe(newUser.name);
    expect(response.body.user.mobile_number).toBe(newUser.mobile_number);
    expect(response.body.user.address).toBe(newUser.address);
  });

  it("should return 400 if required fields are missing", async () => {
    const newUser = { name: "John Doe" }; // Missing mobile_number and address

    const response = await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400);

    expect(response.body.message).toBe(
      "All fields are required: name, mobile_number, and address."
    );
  });

  it("should return 409 if mobile_number is not unique", async () => {
    const existingUser = {
      name: "Jane Doe",
      mobile_number: "1234567890",
      address: "456 Main St",
    };

    // Create the first user
    await request(app).post("/api/users").send(existingUser).expect(201);

    // Try to create a second user with the same mobile_number
    const newUser = {
      name: "John Doe",
      mobile_number: "1234567890", // Same as existing
      address: "789 Main St",
    };

    const response = await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(409);

    expect(response.body.message).toBe("Mobile number must be unique");
  });

  it("should return 500 if there's a server error", async () => {
    const newUser = {
      name: "Test User",
      mobile_number: "9876543210",
      address: "Test Address",
    };

    // Mock an error by making the model throw
    jest.spyOn(User, "create").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(500);

    expect(response.body.message).toBe("Error creating user");
  });
});
