const request = require("supertest");
const app = require("../app");
const sequelize = require("../config/database");
const User = require("../models/User");

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
  afterAll(async () => {
    await sequelize.close();
  });

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
