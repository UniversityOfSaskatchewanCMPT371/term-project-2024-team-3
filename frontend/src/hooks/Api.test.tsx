// Import the necessary modules
import { login, logout } from "./Api";

// Describe the group of tests
describe("API tests", () => {
  // Before each test, mock the global fetch function
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status_code: 200, success: true }),
      } as Response),
    );
  });

  // After each test, restore all mocks
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test case for logging in a user
  it("logs in a user", async () => {
    // Define test credentials
    const testCredentials = {
      username: "testuser",
      password: "testuserpassword",
    };

    // Call the login function with the test credentials
    const data = await login(testCredentials);

    // Expect the returned data to be defined
    expect(data).toBeDefined();

    // Create a new FormData object for comparison
    const formData = new FormData();
    formData.append("username", testCredentials.username);
    formData.append("password", testCredentials.password);

    // Expect that fetch was called with the correct arguments
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/loginuser", {
      method: "POST",
      body: formData,
    });
  });

  // Test case for logging out a user
  it("logs out a user", async () => {
    // Call the logout function
    const data = await logout();

    // Expect the returned data to be defined
    expect(data).toBeDefined();

    // Expect that fetch was called with the correct arguments
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/logoutuser", {
      method: "GET",
    });
  });
});
