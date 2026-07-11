import React from "react";
import { useNavigate } from "react-router-dom";

import {crearCita}from "../../services/citaService";

export default function PasoConfirmacion({
    paciente,
    doctor,
    fecha,
    hora
}) {

    const navigate = useNavigate();

    const solicitarHora =
        async () => {
            try {
                const cita = {
                    pacienteId: paciente.id,
                    doctor: {
                        id: doctor.id
                    },
                    fecha: fecha,
                    horaInicio: hora,
                    estado: "Pendiente"
                };
                await crearCita(
                    cita
                );
                alert(
                    "Hora solicitada correctamente"
                );
                navigate("/");
            } catch (error) {
                console.error(error);
                alert(
                    "No fue posible generar la cita"
                );
            }
        };

    const ocultarCorreo =
        (correo) => {

            if (!correo)
                return "";

            const partes =
                correo.split("@");

            return (
                partes[0]
                    .substring(
                        0,
                        3
                    )
                +
                "***@"
                +
                partes[1]
            );

        };

    return (

        <div className="card shadow">

            <div className="card-body">

                <h3>
                    Confirmación
                </h3>

                <hr />

                <p>

                    <strong>
                        Paciente:
                    </strong>

                    {" "}
                    {paciente.nombre}
                    {" "}
                    {paciente.apellido}

                </p>

                <p>

                    <strong>
                        Doctor:
                    </strong>

                    {" "}
                    {doctor.nombre}
                    {" "}
                    {doctor.apellido}

                </p>

                <p>

                    <strong>
                        Fecha:
                    </strong>

                    {" "}
                    {fecha}

                </p>

                <p>

                    <strong>
                        Hora:
                    </strong>

                    {" "}
                    {hora}

                </p>

                <hr />

                <div
                    className="
                    alert
                    alert-info"
                >

                    Vamos a enviar
                    un correo a:

                    <br />

                    <strong>
                        {
                            ocultarCorreo(
                                paciente.email
                            )
                        }
                    </strong>

                </div>

                <button
                    className="
                    btn
                    btn-success
                    w-100"
                    onClick={
                        solicitarHora
                    }
                >

                    Solicitar Hora

                </button>

                <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={() => navigate("/")}
                >
                    Volver al inicio
                </button>

            </div>

        </div>

    );

}