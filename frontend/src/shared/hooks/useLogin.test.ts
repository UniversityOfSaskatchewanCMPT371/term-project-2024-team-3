import { renderHook } from "@testing-library/react-hooks";
import moment from "moment";
import useLogin from "./useLogin"; // Assuming this is the path to your useLogin hook
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

const loginSpy = jest
  .spyOn(API, "login")
  .mockImplementation(async () => mockLoginData);

describe("useLogin", () => {
  beforeEach(() => {
    jest.spyOn(moment, "now").mockImplementation(() => currentTime);
  });
  it("should handle login successfully", async () => {
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
    expect(mockSetStorage.mock.calls).toEqual([
      [123],
      ["2024-01-02T11:00:00Z"],
    ]);
    expect(mockSetCookies).toHaveBeenCalledWith("SESSION", "mockToken", {
      expires: new Date("2024-01-02T11:00:00.000Z"),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle login when it errors", async () => {
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
    expect(result.current.error).toBe("Login failed. Please try again.");
  });
});
