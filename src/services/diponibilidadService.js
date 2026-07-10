import api from "./api";

export const crearDisponibilidad =
    async (disponibilidad) => {

        const response =
            await api.post(
                "/api/disponibilidad",
                disponibilidad
            );

        return response.data;
    };