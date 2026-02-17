import { api } from "@/lib/axios";

export const getUserProfile = async () => {
    const response = await api.get("/user/profile");
    return response.data;
};

export const updateCustomizations = async (customizations: { avatar?: string, theme?: string, pattern?: string, effect?: string }) => {
    const response = await api.put("/user/customizations", customizations);
    return response.data;
};
