import moment from "moment";
import { renderHook } from "@testing-library/react-hooks";
import useIsUserLoggedIn from "./useIsUserLoggedIn";

describe("useIsUserLoggedIn", () => {
    it("returns false and clears storage and cookie when expiresAt is in the past", () => {
        const currentTime = moment("2024-01-02T00:00:00Z").valueOf();

        jest.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("").mockReturnValueOnce("100");

        jest.spyOn(moment, "now").mockImplementation(() => currentTime);

        const { result } = renderHook(useIsUserLoggedIn);

        expect(result.current).toBe(false);
    });

    it("returns true when user is logged in and expiresAt is in the future", () => {
        const currentTime = moment("2023-12-31T23:59:59Z").valueOf();
        jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce('"2024-01-01T00:00:00Z"')
            .mockReturnValue("100");

        jest.spyOn(moment, "now").mockImplementation(() => currentTime);

        const { result } = renderHook(useIsUserLoggedIn);
        expect(result.current).toBe(true);
    });
});
