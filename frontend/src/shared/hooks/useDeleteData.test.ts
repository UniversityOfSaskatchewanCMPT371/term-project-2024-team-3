import { act, renderHook } from "@testing-library/react-hooks";
import * as API from "../api";
import useDeleteData from "./useDeleteData";

jest.mock("../api");

const deleteDataSpy = jest.spyOn(API, "deleteData").mockImplementation(async () => {});

describe("useDeleteData", () => {
    it("T5.118 should handle delete successfully", async () => {
        const { result, waitForNextUpdate } = renderHook(useDeleteData);

        act(() => {
            result.current.handleDataDelete();
        });

        await waitForNextUpdate();

        expect(deleteDataSpy).toHaveBeenCalledTimes(1);

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("T5.119 should handle delete when it errors", async () => {
        deleteDataSpy.mockImplementation(async () => {
            throw new Error("Delete data failed");
        });
        const { result, waitForNextUpdate } = renderHook(useDeleteData);

        act(() => {
            result.current.handleDataDelete();
        });

        await waitForNextUpdate();

        expect(deleteDataSpy).toHaveBeenCalledTimes(1);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toEqual("Delete data failed");
    });
});
