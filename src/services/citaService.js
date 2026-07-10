import api from "./api";

export const obtenerCitasDoctor = async (doctorId) => {

    const response = await api.get(
        `/api/citas/doctor/${doctorId}`
    );

    return response.data;
};

export const actualizarCita = async (
    id,
    cita
) => {

    const response = await api.put(
        `/api/citas/${id}`,
        cita
    );

    return response.data;
};

export const crearCita = async (
    cita
) => {

    const response = await api.post(
        "/api/citas",
        cita
    );

    return response.data;
};

export const eliminarCita = async (
    id
) => {

    await api.delete(
        `/api/citas/${id}`
    );

};

export const obtenerCitasPorFecha =
async (doctorId, fecha) => {

    const response = await api.get(
        `/api/citas/doctor/${doctorId}/fecha/${fecha}`
    );

    return response.data;
};

export const obtenerHorariosDisponibles = async (
    doctorId,
    fecha
) => {

    const response = await api.get(
        `/api/citas/disponibles/${doctorId}/${fecha}`
    );

    return response.data;
};

export const obtenerPacientesDoctor =async (doctorId) => {
        const response =await api.get(`/api/citas/doctor/${doctorId}/pacientes`
            );return response.data;
    };