import { useState, useMemo } from "react";
import { predict } from "../Data/index";
import { PredictionType, WatchType } from "../api";

type UsePredict = {
    handlePredict: (id: string, model: PredictionType, watchType: WatchType) => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const usePredictFile = (): UsePredict => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    const handlePredict = async (
        id: string,
        model: PredictionType,
        watchType: WatchType,
    ): Promise<void> => {
        setIsLoading(true);
        try {
            await predict(id, model, watchType);
            setErrorState(null);
        } catch (error) {
            setErrorState("Predict File failed");
        } finally {
            setIsLoading(false);
        }
    };

    return useMemo(
        () => ({
            handlePredict,
            isLoading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default usePredictFile;
