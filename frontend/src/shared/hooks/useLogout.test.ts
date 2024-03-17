import { renderHook, act } from "@testing-library/react-hooks";
import useLogout from "./useLogout";
import * as API from "../api";

const mockRemoveCookies = jest.fn();

jest.mock("../api");
jest.mock("react-cookie", () => ({
    useCookies: () => ["", jest.fn(), mockRemoveCookies],
}));

const logoutSpy = jest.spyOn(API, "logout").mockImplementation(async () => {});
const removeLocalStorageSpy = jest.spyOn(Storage.prototype, "removeItem");

describe("useLogout", () => {
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
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe("Logout failed. Please try again.");
    });
});
