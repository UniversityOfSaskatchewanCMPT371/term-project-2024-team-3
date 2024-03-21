import { useState, useMemo } from "react";
import { useRollbar } from "@rollbar/react";
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
    const rollbar = useRollbar();

    const handlePredict = async (
        id: string,
        model: PredictionType,
        watchType: WatchType,
    ): Promise<void> => {
        const infoMsg = `Request to predict ${watchType} ${model} file with id ${id}`;
        setIsLoading(true);
        try {
            rollbar.info(`${infoMsg} sent.`);
            await predict(id, model, watchType);
            setErrorState(null);
            rollbar.info(`${infoMsg} completed without errors.`);
        } catch (error) {
            setErrorState("Predict File failed");
            rollbar.error(`${infoMsg} failed.`);
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
