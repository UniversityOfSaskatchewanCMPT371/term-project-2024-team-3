import api from "./baseapi";
import { LoginResponseData, UserData } from "./types";

export const login = async (username: string, password: string): Promise<LoginResponseData> => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
        const response = await api.post("/loginuser", formData);
        const { data } = response;
        const { token } = response.headers;

        return {
            userId: Number(data.userID),
            authorities: Array.isArray(data.Authorities) ? data.Authorities : [],
            token: token,
        };
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Login Failed");
    }
};

export const logout = async (): Promise<void> => {
    try {
        await api.get("/logoutuser");
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Logout Failed");
    }
};

export const signUp = async (
    firstName: string,
    lastName: string,
    username: string,
    password: string,
): Promise<void> => {
    const requestBody = {
        firstName,
        lastName,
        username,
        password,
        accessGroup: [{ id: "4" }],
        role: [{ id: "5" }],
        rawData: [],
    };

    try {
        await api.post("/user", requestBody, {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        });
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Signup Failed");
    }
};

export const getUser = async (): Promise<UserData> => {
    try {
        const response = await api.get("/user");
        return {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            username: response.data.username,
        };
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Failed to fetch user details");
    }
};

export const deleteAccount = async (): Promise<void> => {
    try {
        await api.delete("/delete-Profile");
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Delete Account Failed");
    }
};

export const deleteData = async (): Promise<void> => {
    try {
        await api.delete("/delete-User-Data");
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Delete Data Failed");
    }
};

export const changePassword = async (password: string): Promise<void> => {
    const requestBody = {
        password,
    };
    try {
        await api.post("/password", requestBody);
    } catch (error) {
        throw new Error(error.response?.data?.message ?? "Change Password Failed");
    }
};
