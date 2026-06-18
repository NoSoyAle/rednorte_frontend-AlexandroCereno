import React, { useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Footer from "./componentes/footer";
import CalendarioSemanal from "./componentes/lilcalendario";
import ModalDisponibilidad from "./componentes/ModalDisponibilidad";
import ModalAtencion from "./componentes/ModalCita";
import ModalReasignar from "./componentes/ModalReasignar";
import {obtenerCitasDoctor,actualizarCita,obtenerHorariosDisponibles} from "../../services/citaService";
import {crearDisponibilidad} from "../../services/diponibilidadService";
import { generarAtencionTxt }from "../../utils/GenerarAtencion";
import { obtenerDoctorPorRut } from "../../services/doctorServices";

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const [fechaActual, setFechaActual] =useState(new Date());
    useEffect(() => {cargarDoctor();}, []);
    const [citas, setCitas] =useState([]);
    const [proximaCita, setProximaCita] = useState(null);
    const [horariosLibres, setHorariosLibres] = useState([]);
    const [citaSeleccionada, setCitaSeleccionada] =
    useState(null);
    const [citaReasignar, setCitaReasignar] = useState(null);
    const [atencion, setAtencion] =useState({
        motivo: "",
        licencia: false,
        detalleLicencia: "",
        diagnostico: "",
        medicamentos: "",
        derivacion: "",
        indicaciones: "",
        comentarios: ""
    });
    
    const [doctorId, setDoctorId] = useState(null);
    const cerrar = () => {
        localStorage.clear();
        navigate("/");
    };
    const cargarDoctor = async () => {
        try {
            const rut =
                localStorage.getItem("rut");
            const doctor =
                await obtenerDoctorPorRut(rut);
            setDoctorId(
                doctor.id
            );
        } catch (error) {
            console.error(
                "Error obteniendo doctor",
                error
            );
        }};

    useEffect(() => {const intervalo = setInterval(() => {
        setFechaActual(new Date());}, 1000);
        return () =>
            clearInterval(intervalo);}, []);

    useEffect(() => {if (doctorId) {cargarCitas();}}, [doctorId]);

    const cargarCitas = async () => {
        try {const data =await obtenerCitasDoctor(doctorId);
            setCitas(data);
            obtenerProxima(data);
                const fechaHoy = new Date()
                        .toISOString()
                        .split("T")[0];
                const libres =
                    await obtenerHorariosDisponibles(
                        doctorId,
                        fechaHoy
                    );
                setHorariosLibres(libres);} catch (error) {console.error(error);
                }
        };

    const obtenerProxima = (listaCitas) => {
        const ahora = new Date();
        const futuras =
            listaCitas.filter(cita => {
                const fechaHora =
                    new Date(
                        `${cita.fecha}T${cita.horaInicio}`);
                        return fechaHora > ahora;
            });
            futuras.sort((a, b) => {
            const fechaA =
                new Date(`${a.fecha}T${a.horaInicio}`);
                const fechaB =new Date(`${b.fecha}T${b.horaInicio}`);
            return fechaA - fechaB;
        });
        if (futuras.length > 0) {
            setProximaCita(
                futuras[0]
            );} else {
            setProximaCita(
                null
            );
        }
    };

    const cancelarCita =
        async (cita) => {
            try {const citaActualizada = {
                    ...cita,
                    estado: "CANCELADA"};
                await actualizarCita(cita.id,citaActualizada);
                alert("Cita cancelada");
                cargarCitas();}
                catch (error) {console.error(error);
                    alert("No fue posible cancelar la cita");
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

    const CitaRealizada =
        async (cita) => {
            try {const citaActualizada = {
                    ...cita,
                    estado: "REALIZADA"};
                await actualizarCita(cita.id,citaActualizada);
                cargarCitas();}
                catch (error) {console.error(error);
                    alert("No fue posible iniciar la cita");
            }
        };

    const abrirAtencion = (cita) => {if (!cita) return;
        setCitaSeleccionada(cita);
        const modal = new bootstrap.Modal(
        document.getElementById("modalAtencion"));
        modal.show();
    };


    const finalizarAtencion = async () => {
        if (!citaSeleccionada) return;
        try {generarAtencionTxt(
                citaSeleccionada,
                atencion
            );
            await actualizarCita(
                citaSeleccionada.id,
                {
                    ...citaSeleccionada,
                    estado: "REALIZADA"
                }
            );
            const modal =
                bootstrap.Modal.getInstance(
                    document.getElementById(
                        "modalAtencion"
                    )
                );
            if (modal) {
                modal.hide();
            }
            setAtencion({
                motivo: "",
                licencia: false,
                detalleLicencia: "",
                diagnostico: "",
                medicamentos: "",
                derivacion: "",
                indicaciones: "",
                comentarios: ""
            });
            setCitaSeleccionada(null);
            cargarCitas();
        } catch (error) {
            console.error(error);
            alert(
                "Error al finalizar la atención"
            );
        }
    };


    const guardarDisponibilidad =async (disponibilidades) => {
            try {for (const disponibilidad of disponibilidades) {
                await crearDisponibilidad(disponibilidad);}
                alert("Disponibilidad guardada correctamente");} catch (error) {
                    console.error(error);
                    alert(
                    "Error guardando disponibilidad");}
            };
            return (
            <>
            <Navbar />
            <div className="container-fluid mt-4">
                <div className="bg-light border border-dark-subtle rounded p-4 shadow-sm mb-4 text-center">
                    <h1>Bienvenido al panel del doctor</h1>
                    <p>
                        Gestiona tus citas,
                        agenda y disponibilidad
                    </p>
                    <h3>
                        Estamos a{" "}
                        {fechaActual.toLocaleDateString("es-CL")}
                    </h3>
                    <h3>
                        Son las{" "}
                        {fechaActual.toLocaleTimeString("es-CL")}
                    </h3>
                </div>
                <div className="row">
                    {/* PANEL IZQUIERDO */}
                    <div className="col-md-3">
                        <div className="card shadow-sm mb-3">
                            <div className="card-header">
                                Próximo Paciente
                            </div>
                            <ul className="list-group list-group-flush">
                                {proximaCita ? (<>
                                        <li className="list-group-item">
                                            Fecha:{" "}{proximaCita.fecha}
                                        </li>

                                        <li className="list-group-item">
                                            Hora:{" "}{proximaCita.horaInicio}
                                        </li>

                                        <li className="list-group-item">
                                            Paciente ID:{" "}{proximaCita.pacienteId}
                                        </li>

                                        <li className="list-group-item">
                                            Estado:{" "}{proximaCita.estado}
                                        </li>

                                    </>) : (
                                        <li className="list-group-item">
                                        No existen citas próximas
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="d-flex gap-2 mb-3">
                            <button className="btn btn-success btn-sm" disabled={!proximaCita}
                            onClick={() => abrirAtencion(proximaCita)}>
                                Iniciar Consulta
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                disabled={!proximaCita}
                                onClick={() =>
                                    cancelarCita(
                                        proximaCita)}>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-info btn-sm"
                                disabled={!proximaCita}
                                onClick={() =>
                                    abrirReasignar(
                                        proximaCita)}>
                                Reasignar
                            </button>
                        </div>

                        <div className="card text-bg-light shadow-sm mb-3">
                            <div className="card-header">
                                Horas Libres Hoy
                            </div>
                            <div className="card-body">
                                {horariosLibres.length > 0
                                    ? (<div className="d-flex flex-wrap gap-2">
                                            {horariosLibres.map(
                                                    hora => (
                                                        <span
                                                            key={hora}
                                                            className="badge bg-success p-2">
                                                            {hora.substring(0,5)}
                                                        </span>))}
                                            </div>): (<p className="mb-0">No hay bloques libres</p>)}
                            </div>
                        </div>

                        <div className="bg-light border border-dark-subtle rounded p-4 shadow-sm">
                            <h4>
                                Accesos rápidos
                            </h4>
                            <div className="d-flex flex-column gap-2 mt-3">
                                <Link to="/AgendaDia"
                                    className="btn btn-outline-primary">
                                    Agenda de hoy
                                </Link>
                                <button
                                    className="btn btn-outline-success"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalDisponibilidad">
                                    Configurar Turnos
                                </button>
                                <Link to="/PacientesDoctor"
                                    className="btn btn-outline-primary">
                                    Pacientes
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* PANEL DERECHO */}
                    <div className="col-md-9">
                        <div className="bg-light border border-dark-subtle rounded p-4 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3>Agenda semanal</h3>
                                <span className="badge text-bg-primary">
                                    {citas.length}
                                    {" "}
                                    citas
                                </span>
                            </div>
                            <CalendarioSemanal citas={citas}/>
                        </div>
                    </div>
                </div>
            </div>
            <ModalDisponibilidad
                doctorId={doctorId}
                onGuardar={guardarDisponibilidad}/>

            <ModalAtencion
                cita={citaSeleccionada}
                atencion={atencion}
                setAtencion={setAtencion}
                finalizar={finalizarAtencion}
            />

            <ModalReasignar
                cita={citaReasignar}
                doctorId={doctorId}
                onReasignar={handleReasignar}
            />
            <Footer />
        </>
    );
}