import { renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import useGetUser from "./useGetUser";
import * as API from "../api";

jest.mock("../api");

const mockData = {
    firstName: "hello",
    lastName: "hellothere",
    username: "hellousername",
};

const getUserSpy = jest.spyOn(API, "getUser").mockImplementation(async () => mockData);

describe("useGetUser", () => {
    it("T5.105 should get users successfully", async () => {
        getUserSpy.mockResolvedValue(mockData);

        const { result } = renderHook(useGetUser);

        expect(getUserSpy).toHaveBeenCalledTimes(1);

        waitFor(() => {
            expect(result).toEqual(mockData);
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe(null);
        });
    });

    it("T5.106 should handle get user when it errors", async () => {
        const { result } = renderHook(useGetUser);

        getUserSpy.mockImplementation(async () => {
            throw new Error("Getting user failed");
        });

        expect(getUserSpy).toHaveBeenCalledTimes(1);

        waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toEqual(`Getting user failed`);
        });
    });
});
