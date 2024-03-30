import { renderHook, act } from "@testing-library/react-hooks";
import { useNavigate } from "react-router-dom";
import useLogout from "./useLogout";
import * as API from "../api";

const mockRemoveCookies = jest.fn();

jest.mock("../api");
jest.mock("react-cookie", () => ({
    useCookies: () => ["", jest.fn(), mockRemoveCookies],
}));
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

const removeLocalStorageSpy = jest.spyOn(Storage.prototype, "removeItem");

describe("useLogout", () => {
    const mockNavigate = jest.fn();
    let logoutSpy: jest.SpyInstance;
    beforeEach(() => {
        logoutSpy = jest.spyOn(API, "logout").mockImplementation(async () => {});
        (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    });
    it("T3.12 should handle logout successfully", async () => {
        const { result, waitForNextUpdate } = renderHook(useLogout);

        act(() => {
            result.current.handleLogout();
        });

        await waitForNextUpdate();

        expect(logoutSpy).toHaveBeenCalledTimes(1);
        expect(removeLocalStorageSpy).toHaveBeenNthCalledWith(1, "expires_at");
        expect(removeLocalStorageSpy).toHaveBeenNthCalledWith(2, "user_id");
        expect(mockRemoveCookies).toHaveBeenCalledWith("SESSION");
        expect(mockNavigate).toHaveBeenCalledWith("/");

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("T3.13 should handle logout when it errors", async () => {
        const { result, waitForNextUpdate } = renderHook(useLogout);

        logoutSpy.mockImplementation(async () => {
            throw new Error("Logout failed");
        });

        act(() => {
            result.current.handleLogout();
        });

        await waitForNextUpdate();

        expect(logoutSpy).toHaveBeenCalledTimes(1);
        expect(removeLocalStorageSpy).toHaveBeenCalled();
        expect(mockRemoveCookies).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe("Logout failed");
    });
});
