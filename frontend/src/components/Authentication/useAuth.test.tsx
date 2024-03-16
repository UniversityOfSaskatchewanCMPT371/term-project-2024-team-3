import { renderHook } from "@testing-library/react-hooks";
import * as useIsUserLoggedIn from "shared/hooks/useIsUserLoggedIn";
import { AuthProvider, useAuth } from "./useAuth";

describe("useAuth", () => {
    let useIsUserLoggedInSpy: jest.SpyInstance;
    beforeEach(() => {
        useIsUserLoggedInSpy = jest.spyOn(useIsUserLoggedIn, "default").mockReturnValue(false);
    });

    it("T4.36: returns isAuthenticated as true when user is logged in", () => {
        useIsUserLoggedInSpy.mockReturnValue(true);

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        expect(result.current.isAuthenticated).toBe(true);
    });

    it("T4.37: returns isAuthenticated as false when user is not logged in", () => {
        useIsUserLoggedInSpy.mockReturnValue(false);

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        expect(result.current.isAuthenticated).toBe(false);
    });
});
