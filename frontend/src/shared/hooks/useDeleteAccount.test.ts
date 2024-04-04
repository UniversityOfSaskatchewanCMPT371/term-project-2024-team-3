import { act, renderHook } from "@testing-library/react-hooks";
import * as useLogout from "shared/hooks/useLogout";
import * as API from "../api";
import useDeleteAccount from "./useDeleteAccount";

jest.mock("../api");
const mockHandleLogout = jest.fn();

const deleteDataSpy = jest.spyOn(API, "deleteAccount").mockImplementation(async () => {});
describe("useDeleteAccount", () => {
    beforeEach(() => {
        jest.spyOn(useLogout, "default").mockReturnValue({
            handleLogout: mockHandleLogout,
            isLoading: false,
            error: null,
        });
    });

    it("T5.115 should handle delete successfully", async () => {
        const { result, waitForNextUpdate } = renderHook(useDeleteAccount);

        act(() => {
            result.current.handleAccountDelete();
        });

        await waitForNextUpdate();

        expect(deleteDataSpy).toHaveBeenCalledTimes(1);
        expect(mockHandleLogout).toHaveBeenCalledTimes(1);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("T5.116 should handle delete when it errors", async () => {
        deleteDataSpy.mockImplementation(async () => {
            throw new Error("Delete account failed");
        });
        const { result, waitForNextUpdate } = renderHook(useDeleteAccount);

        act(() => {
            result.current.handleAccountDelete();
        });

        await waitForNextUpdate();

        expect(deleteDataSpy).toHaveBeenCalledTimes(1);
        expect(mockHandleLogout).toHaveBeenCalledTimes(0);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toEqual("Delete account failed");
    });
});
