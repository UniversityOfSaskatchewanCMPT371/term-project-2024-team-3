import { renderHook } from "@testing-library/react-hooks";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import useLogin from "./useLogin";
import * as API from "../api";

const mockLoginData = {
    userId: 123,
    authorities: [],
    token: "mockToken",
};
const currentTime = moment("2024-01-02T10:00:00Z").valueOf();
const mockSetStorage = jest.fn();
const mockSetCookies = jest.fn();

jest.mock("../api");
jest.mock("usehooks-ts", () => ({
    useLocalStorage: () => ["", mockSetStorage],
}));

jest.mock("react-cookie", () => ({
    useCookies: () => ["", mockSetCookies],
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

const loginSpy = jest.spyOn(API, "login").mockImplementation(async () => mockLoginData);

describe("useLogin", () => {
    const mockNavigate = jest.fn();
    beforeEach(() => {
        jest.spyOn(moment, "now").mockImplementation(() => currentTime);
        (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    });
    it("T3.10 should handle login successfully", async () => {
        const { result } = renderHook(useLogin);

        const mockData = {
            userId: 123,
            authorities: [],
            token: "mockToken",
        };

        loginSpy.mockResolvedValue(mockData);

        const username = "testUser";
        const password = "testPassword";
        await result.current.handleLogin(username, password);

        expect(loginSpy).toHaveBeenCalledWith(username, password);
        expect(mockSetStorage.mock.calls).toEqual([[123], ["2024-01-02T11:00:00Z"]]);
        expect(mockSetCookies).toHaveBeenCalledWith("SESSION", "mockToken", {
            expires: new Date("2024-01-02T11:00:00.000Z"),
            sameSite: "none",
            secure: true,
        });
        expect(mockNavigate).toHaveBeenCalledWith("/file-upload");

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("T3.10 should handle login when it errors", async () => {
        const { result } = renderHook(useLogin);

        loginSpy.mockImplementation(async () => {
            throw new Error("Login failed");
        });

        const username = "testUser";
        const password = "testPassword";
        await result.current.handleLogin(username, password);

        expect(loginSpy).toHaveBeenCalledWith(username, password);
        expect(mockSetStorage).not.toHaveBeenCalled();
        expect(mockSetCookies).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe("Login failed");
    });
});
