export enum UserRoleEnum {
    ROLE_ADMIN = "ROLE_ADMIN",
    ROLE_USER = "ROLE_USER",
}

export type Authority = {
    authority: UserRoleEnum;
};

export type LoginResponseData = {
    userId: number;
    authorities: Array<Authority>;
    token: String | null | undefined;
};

export type LogoutResponseData = {
    name: String;
};

export enum WatchType {
    APPLE_WATCH = "applewatch",
    FITBIT = "fitbit",
}

export enum PredictionType {
    SVM = "svm",
    RANDOM_FOREST = "randomForest",
    ROTATION_FOREST = "rotationForest",
    DECISSION_TREE = "decissionTree",
}

export type FileData = {
    id: Number;
    data: Uint8Array | null;
    predictionType: PredictionType | null;
    dateTime: Date | null;
};

export type PredictedFilesData = {
    list: Array<FileData>;
};

export type ProcessedFilesData = {
    list: Array<ProcessedFileData>;
};

export type ProcessedFileData = {
    id: Number;
    data: Uint8Array | null;
    predictedData: FileData | null;
    dateTime: Date | null;
};

export enum DataType {
    APPLE_WATCH = "AppleWatch",
    FITBIT = "FitBit",
}

export enum DownloadType {
    PROCESS = "process",
    PREDICT = "predict",
}

export type RawFileData = {
    id: Number;
    data: Uint8Array | null;
    type: DataType | null;
    processedDataID: Number | null;
    dateTime: string | null;
};

export type RawFilesData = {
    list: Array<RawFileData>;
};

export type DownloadData = {
    file: Uint8Array | null | undefined;
};
