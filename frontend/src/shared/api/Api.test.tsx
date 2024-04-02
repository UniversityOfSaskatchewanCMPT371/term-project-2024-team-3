import { AxiosError } from "axios";
import { changePassword, deleteAccount, deleteData, getUser, login, logout, signUp } from "./Api";
import api from "./baseapi";

describe("API Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("T3.2 Login: should return mapped data upon successful login", async () => {
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

    it("T3.3 Login: should throw an error upon failed login", async () => {
        jest.spyOn(api, "post").mockRejectedValueOnce(new Error("Login Failed"));

        const formData = new FormData();
        formData.append("username", "testUser");
        formData.append("password", "testPassword");

        await expect(login("testUser", "testPassword")).rejects.toThrow("Login Failed");

        expect(api.post).toHaveBeenCalledWith("/loginuser", formData);
    });

    it("T3.4 Logout: should logout successfully", async () => {
        jest.spyOn(api, "get").mockResolvedValueOnce({
            ok: true,
        });

        await logout();

        expect(api.get).toHaveBeenCalledWith("/logoutuser");
    });

    it("T3.5 Logout: should throw an error if fails", async () => {
        jest.spyOn(api, "get").mockRejectedValueOnce(new AxiosError("Logout Failed"));

        await expect(logout()).rejects.toThrow("Logout Failed");

        expect(api.get).toHaveBeenCalledWith("/logoutuser");
    });

    it("T3.6 should sign up successfully", async () => {
        jest.spyOn(api, "post").mockResolvedValueOnce({
            ok: true,
        });

        const username = "testuser";
        const password = "testpassword";
        const firstName = "Test";
        const lastName = "User";

        await expect(signUp(firstName, lastName, username, password)).resolves.not.toThrow();
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

    it("T3.7 should throw an error if sign up fails", async () => {
        jest.spyOn(api, "post").mockRejectedValueOnce(new AxiosError("Signup Failed"));

        const username = "testuser";
        const password = "testpassword";
        const firstName = "Test";
        const lastName = "User";

        await expect(signUp(firstName, lastName, username, password)).rejects.toThrow(
            "Signup Failed",
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

    it("T5.?? should get user successfully", async () => {
        const expected = {
            firstName: "hello",
            lastName: "test",
            username: "hellotest",
        };
        jest.spyOn(api, "get").mockResolvedValueOnce({
            data: expected,
        });

        const response = await getUser();
        expect(api.get).toHaveBeenCalledWith("/user");

        expect(response).toEqual(expected);
    });

    it("T5.?? should throw an error if get user fails", async () => {
        jest.spyOn(api, "get").mockRejectedValueOnce(new AxiosError("Failed to fetch user"));

        await expect(getUser()).rejects.toThrow("Failed to fetch user");
        expect(api.get).toHaveBeenCalledWith("/user");
    });

    it("T5.?? should delete account successfully", async () => {
        jest.spyOn(api, "delete").mockResolvedValueOnce({
            ok: true,
        });

        await deleteAccount();
        expect(api.delete).toHaveBeenCalledWith("/delete-Profile");
    });

    it("T5.?? should throw an error if deleting account fails", async () => {
        jest.spyOn(api, "delete").mockRejectedValueOnce(new AxiosError("Delete Account Failed"));

        await expect(deleteAccount()).rejects.toThrow("Delete Account Failed");
        expect(api.delete).toHaveBeenCalledWith("/delete-Profile");
    });

    it("T5.?? should delete data successfully", async () => {
        jest.spyOn(api, "delete").mockResolvedValueOnce({
            ok: true,
        });

        await deleteData();
        expect(api.delete).toHaveBeenCalledWith("/delete-User-Data");
    });

    it("T5.?? should throw an error if deleting data fails", async () => {
        jest.spyOn(api, "delete").mockRejectedValueOnce(new AxiosError("Delete Data Failed"));

        await expect(deleteData()).rejects.toThrow("Delete Data Failed");
        expect(api.delete).toHaveBeenCalledWith("/delete-User-Data");
    });

    it("T5.?? should change password successfully", async () => {
        const password = "123";
        jest.spyOn(api, "post").mockResolvedValueOnce({
            ok: true,
        });

        await changePassword(password);
        expect(api.post).toHaveBeenCalledWith("/password", { password });
    });

    it("T5.?? should throw an error if change password fails", async () => {
        const password = "123";
        jest.spyOn(api, "post").mockRejectedValueOnce(new AxiosError("Change Password Failed"));

        await expect(changePassword(password)).rejects.toThrow("Change Password Failed");
        expect(api.post).toHaveBeenCalledWith("/password", { password });
    });
});
