import React, {useEffect,useState} from "react";
import * as bootstrap from "bootstrap";

import Navbar from "./componentes/Navbar";
import Footer from "./componentes/footer";
import ModalReasignar from "./componentes/ModalReasignar";
import {obtenerDoctorPorRut} from "../../services/doctorServices";
import {obtenerCitasPorFecha,actualizarCita} from "../../services/citaService";

export default function AgendaDiaria() {
    const [doctorId, setDoctorId] =useState(null);

    const [fechaSeleccionada,setFechaSeleccionada] =useState(new Date());

    const [citas,setCitas] = useState([]);
    const [citaReasignar, setCitaReasignar] = useState(null);

    useEffect(() => {if (doctorId) {cargarCitas();}}, [
        fechaSeleccionada,
        doctorId]);

    const cargarCitas = async () => {
        try {
            const fecha =
                fechaSeleccionada
                    .toISOString()
                    .split("T")[0];
            const data =
                await obtenerCitasPorFecha(
                    doctorId,
                    fecha
                );
                console.log(data);
            setCitas(data);
        } catch (error) {
            console.error(error);
        }
    };


    const cambiarEstado = async (cita,nuevoEstado) => {
        try {
            await actualizarCita(
                cita.id,
                {estado: nuevoEstado}
            );
            await cargarCitas();
        } catch (error) {
            console.error(error);
            alert(
                "No fue posible actualizar la cita"
            );
        }
    };

    const abrirReasignar = (cita) => {
        setCitaReasignar(cita);
        const modal = new bootstrap.Modal(
            document.getElementById("modalReasignar")
        );
        modal.show();
    };

    const handleReasignar = async (id, citaActualizada) => {
        try {
            await actualizarCita(id, citaActualizada);
            await cargarCitas();
        } catch (error) {
            console.error(error);
            alert("No fue posible reasignar la cita");
        }
    };

    const cambiarDia = (dias) => {

        const nuevaFecha =
            new Date(fechaSeleccionada);

        nuevaFecha.setDate(
            nuevaFecha.getDate() + dias
        );

        setFechaSeleccionada(
            nuevaFecha
        );
    };

    const total = citas.length;

    const atendidos =
        citas.filter(
            c => c.estado === "ATENDIDA"
        ).length;

    const noAsistieron =
        citas.filter(
            c => c.estado === "NO_ASISTIO"
        ).length;

    const canceladas =
        citas.filter(
            c => c.estado === "CANCELADA"
        ).length;

    const procesadas =
        atendidos +
        noAsistieron +
        canceladas;

    const progreso =
        total > 0
            ? (procesadas / total) * 100
            : 0;

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <div className="bg-light p-4 rounded shadow-sm mb-4 text-center">

                    <h2>
                        Agenda Diaria
                    </h2>

                    <h4>
                        {
                            fechaSeleccionada
                                .toLocaleDateString(
                                    "es-CL",
                                    {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    }
                                )
                        }
                    </h4>

                    <div className="d-flex justify-content-center gap-3 mt-3">

                        <button
                            className="btn btn-outline-primary"
                            onClick={() =>
                                cambiarDia(-1)
                            }
                        >
                            ◀ Día anterior
                        </button>

                        <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                setFechaSeleccionada(
                                    new Date()
                                )
                            }
                        >
                            Hoy
                        </button>

                        <button
                            className="btn btn-outline-primary"
                            onClick={() =>
                                cambiarDia(1)
                            }
                        >
                            Día siguiente ▶
                        </button>

                    </div>

                    <div
                        className="progress mt-4"
                        style={{
                            height: "25px"
                        }}
                    >

                        <div
                            className="progress-bar bg-success"
                            style={{
                                width:
                                    `${progreso}%`
                            }}
                        >
                            {Math.round(
                                progreso
                            )}%
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="badge bg-primary me-2">
                            Total: {total}
                        </span>
                        <span className="badge bg-success me-2">
                            Atendidos: {atendidos}
                        </span>
                        <span className="badge bg-danger me-2">
                            No asistieron: {noAsistieron}
                        </span>
                        <span className="badge bg-secondary">
                            Canceladas: {canceladas}
                        </span>
                    </div>
                </div>
                
                
                <div className="list-group shadow-sm">
                    {citas.map(
                            cita => (
                                <div
                                    key={cita.id}
                                    className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>
                                            {cita.horaInicio}{" - "}{cita.horaFin}
                                        </h5>
                                        <p className="mb-0">
                                            Nombre Paciente:{" "}{cita.nombrePaciente}
                                        </p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() =>
                                                cambiarEstado(cita,"REALIZADA")}>
                                            Cita Realizada
                                        </button>

                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() =>
                                                cambiarEstado(
                                                    cita,
                                                    "NO_ASISTE"
                                                )
                                            }
                                        >
                                            No asiste
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                cambiarEstado(
                                                    cita,
                                                    "CANCELADA"
                                                )
                                            }
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() =>
                                                abrirReasignar(cita)
                                            }
                                        >
                                            Reasignar
                                        </button>
                                    </div>
                                </div>))}
                </div>
            </div>
            <ModalReasignar
                cita={citaReasignar}
                doctorId={doctorId}
                onReasignar={handleReasignar}
            />
            <Footer />
        </>
    );
}