import { login, logout } from "./Api";

describe("API Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Login: should return mapped data upon successful login", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ userID: "123", Authorities: ["admin", "user"] }),
        headers: {
          get: () => "mock-token",
        },
      } as unknown as Response),
    );

    const result = await login("testUser", "testPassword");

    expect(result).toEqual({
      userId: 123,
      authorities: ["admin", "user"],
      token: "mock-token",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/loginuser",
      {
        method: "POST",
        body: expect.any(FormData),
      },
    );
  });

  it("Login: should throw an error upon failed login", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
      } as unknown as Response),
    );

    await expect(login("testUser", "testPassword")).rejects.toThrow(
      "Login failed",
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/loginuser",
      {
        method: "POST",
        body: expect.any(FormData),
      },
    );
  });

  it("Logout: should logout successfully", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
    } as Response);

    await logout();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/logoutuser",
      {
        method: "GET",
      },
    );
  });

  it("Logout: should throw an error if fails", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(logout()).rejects.toThrow("Logout failed");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/logoutuser",
      {
        method: "GET",
      },
    );
  });
});
