import api from "./api";

export const obtenerDoctores =
    async () => {

        const response =
            await api.get("/api/doctor");

        return response.data;
    };

export const obtenerDoctoresPorEspecialidad =
    async (idEspecialidad) => {

        const response =
            await api.get(
                `/api/doctor/especialidad/${idEspecialidad}`
            );

        return response.data;
    };

export const obtenerDoctorPorRut =
    async (rut) => {

        const response =
            await api.get(
                `/api/doctor/rut/${rut}`
            );

        return response.data;
    };