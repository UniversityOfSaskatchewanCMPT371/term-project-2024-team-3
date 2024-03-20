import moment from "moment";
import { renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import useIsUserLoggedIn from "./useIsUserLoggedIn";

const mockRemoveCookies = jest.fn();
const removeLocalStorageSpy = jest.spyOn(Storage.prototype, "removeItem");

jest.mock("react-cookie", () => ({
    useCookies: () => ["", jest.fn(), mockRemoveCookies],
}));

describe("useIsUserLoggedIn", () => {
    it("T3.8 returns false and clears storage and cookie when expiresAt is in the past", () => {
        const currentTime = moment("2024-01-02T00:00:00Z").valueOf();

        jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce("2024-01-01T00:00:00Z")
            .mockReturnValueOnce("100");

        jest.spyOn(moment, "now").mockImplementation(() => currentTime);

        const hook = renderHook(useIsUserLoggedIn);

        expect(removeLocalStorageSpy).toHaveBeenNthCalledWith(1, "expires_at");
        expect(removeLocalStorageSpy).toHaveBeenNthCalledWith(2, "user_id");
        expect(mockRemoveCookies).toHaveBeenCalledWith("SESSION");

        // Mock getItem to be removed for expires at and user id to be removed
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

        hook.rerender();

        waitFor(() => {
            expect(removeLocalStorageSpy).not.toHaveBeenCalled();
            expect(mockRemoveCookies).not.toHaveBeenCalled();
        });
        expect(hook.result.current).toBe(false);
    });

    it("T3.9 returns true when user is logged in and expiresAt is in the future", () => {
        const currentTime = moment("2023-12-31T23:59:59Z").valueOf();
        jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce('"2024-01-01T00:00:00Z"')
            .mockReturnValue("100");

        jest.spyOn(moment, "now").mockImplementation(() => currentTime);

        const { result } = renderHook(useIsUserLoggedIn);

        expect(removeLocalStorageSpy).not.toHaveBeenCalled();
        expect(mockRemoveCookies).not.toHaveBeenCalled();
        expect(result.current).toBe(true);
    });
});
