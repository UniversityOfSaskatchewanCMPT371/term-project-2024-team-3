import { renderHook } from "@testing-library/react-hooks";
import { PredictionType, WatchType } from "shared/api";
import { waitFor } from "@testing-library/react";
import usePredictFile from "./usePredictFile";
import * as API from "../Data/index";

const mockSetStorage = jest.fn();

jest.mock("../api");
jest.mock("usehooks-ts", () => ({
    useLocalStorage: () => ["", mockSetStorage],
}));

const predictFileSpy = jest.spyOn(API, "predict").mockImplementation(async () => {});

const mockData = {
    id: "12345678",
    model: PredictionType.SVM,
    watchType: WatchType.APPLE_WATCH,
};

describe("usePredictFile", () => {
    it("should handle predict successfully", async () => {
        const { result } = renderHook(usePredictFile);

        await result.current.handlePredict(mockData.id, mockData.model, mockData.watchType);

        expect(predictFileSpy).toHaveBeenCalledTimes(1);
        expect(predictFileSpy).toHaveBeenCalledWith(
            mockData.id,
            mockData.model,
            mockData.watchType,
        );

        waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe(null);
        });
    });

    it("should handle predict when it errors", async () => {
        const { result } = renderHook(usePredictFile);

        predictFileSpy.mockImplementation(async () => {
            throw new Error("Prediction failed");
        });
        await result.current.handlePredict(mockData.id, mockData.model, mockData.watchType);

        expect(predictFileSpy).toHaveBeenCalledTimes(1);
        waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toEqual("Predict File failed");
        });
    });
});
