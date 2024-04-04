import { act, renderHook } from "@testing-library/react-hooks";
import * as API from "../api";
import useChangePassword from "./useChangePassword";

jest.mock("../api");

const deleteDataSpy = jest.spyOn(API, "changePassword").mockImplementation(async () => {});
const password = "123";

describe("useChangePassword", () => {
    it("T5.107 should handle password change successfully", async () => {
        const { result, waitForNextUpdate } = renderHook(useChangePassword);

        act(() => {
            result.current.handleChangePassword(password);
        });

        await waitForNextUpdate();

        expect(deleteDataSpy).toHaveBeenCalledTimes(1);

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("T5.108 should handle password change when it errors", async () => {
        deleteDataSpy.mockImplementation(async () => {
            throw new Error("Password change failed");
        });
        const { result, waitForNextUpdate } = renderHook(useChangePassword);

        act(() => {
            result.current.handleChangePassword(password);
        });

        await waitForNextUpdate();

        expect(deleteDataSpy).toHaveBeenCalledTimes(1);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toEqual("Password change failed");
    });
});
