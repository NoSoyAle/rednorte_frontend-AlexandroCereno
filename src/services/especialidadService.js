import api from "./api";

export const obtenerEspecialidades =
    async () => {

        const response =
            await api.get("/api/especialidad");

        return response.data;
    };