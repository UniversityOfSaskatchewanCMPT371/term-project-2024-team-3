import { login, logout, signUp } from "./Api";
import api from "./baseapi";

describe("API Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Login: should return mapped data upon successful login", async () => {
        jest.spyOn(api, "post").mockResolvedValueOnce({
            data: { userID: "123", Authorities: ["admin", "user"] },
            headers: {
                token: "mock-token",
            },
        });

        const formData = new FormData();
        formData.append("username", "testUser");
        formData.append("password", "testPassword");

        const result = await login("testUser", "testPassword");

        expect(result).toEqual({
            userId: 123,
            authorities: ["admin", "user"],
            token: "mock-token",
        });

        expect(api.post).toHaveBeenCalledWith("/loginuser", formData);
    });

    it("Login: should throw an error upon failed login", async () => {
        jest.spyOn(api, "post").mockRejectedValueOnce(new Error("Login failed"));

        const formData = new FormData();
        formData.append("username", "testUser");
        formData.append("password", "testPassword");

        await expect(login("testUser", "testPassword")).rejects.toThrow("Login failed");

        expect(api.post).toHaveBeenCalledWith("/loginuser", formData);
    });

    it("Logout: should logout successfully", async () => {
        jest.spyOn(api, "get").mockResolvedValueOnce({
            ok: true,
        });

        await logout();

        expect(api.get).toHaveBeenCalledWith("/logoutuser");
    });

    it("Logout: should throw an error if fails", async () => {
        jest.spyOn(api, "get").mockRejectedValueOnce(new Error("Logout failed"));

        await expect(logout()).rejects.toThrow("Logout failed");

        expect(api.get).toHaveBeenCalledWith("/logoutuser");
    });

    it("should sign up successfully", async () => {
        jest.spyOn(api, "post").mockResolvedValueOnce({
            ok: true,
        });

        const username = "testuser";
        const password = "testpassword";
        const firstName = "Test";
        const lastName = "User";

        await expect(signUp(username, password, firstName, lastName)).resolves.not.toThrow();
        expect(api.post).toHaveBeenCalledWith(
            "/user",
            {
                firstName,
                lastName,
                username,
                password,
                accessGroup: [{ id: "4" }],
                role: [{ id: "5" }],
                rawData: [],
            },
            {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            },
        );
    });

    it("should throw an error if sign up fails", async () => {
        jest.spyOn(api, "post").mockRejectedValueOnce(new Error("Signup failed"));

        const username = "testuser";
        const password = "testpassword";
        const firstName = "Test";
        const lastName = "User";

        await expect(signUp(username, password, firstName, lastName)).rejects.toThrow(
            "Signup failed",
        );
        expect(api.post).toHaveBeenCalledWith(
            "/user",
            {
                firstName,
                lastName,
                username,
                password,
                accessGroup: [{ id: "4" }],
                role: [{ id: "5" }],
                rawData: [],
            },
            {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            },
        );
    });
});
