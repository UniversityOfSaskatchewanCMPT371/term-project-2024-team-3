import { renderHook } from "@testing-library/react-hooks";
import useLogout from "./useLogout";
import * as API from "../api";

const mockSetStorage = jest.fn();
const mockRemoveCookies = jest.fn();

jest.mock("../api");
jest.mock("usehooks-ts", () => ({
  useLocalStorage: () => ["", mockSetStorage],
}));

jest.mock("react-cookie", () => ({
  useCookies: () => ["", jest.fn(), mockRemoveCookies],
}));

const logoutSpy = jest.spyOn(API, "logout").mockImplementation(async () => {});

describe("useLogout", () => {
  it("should handle logout successfully", async () => {
    const { result } = renderHook(useLogout);

    await result.current.handleLogout();

    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(mockSetStorage.mock.calls).toEqual([[""], [-1]]);
    expect(mockRemoveCookies).toHaveBeenCalledWith("SESSION");

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle logout when it errors", async () => {
    const { result } = renderHook(useLogout);

    logoutSpy.mockImplementation(async () => {
      throw new Error("Logout failed");
    });
    await result.current.handleLogout();

    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(mockSetStorage).not.toHaveBeenCalled();
    expect(mockRemoveCookies).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Logout failed. Please try again.");
  });
});
