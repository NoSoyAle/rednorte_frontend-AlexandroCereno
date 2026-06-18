import React,
{useEffect,useState}from "react";

import Navbar from "./componentes/Navbar";
import Footer from "./componentes/footer";
import {obtenerDoctorPorRut} from "../../services/doctorServices";

import {obtenerPacientesDoctor} from "../../services/citaService";

export default function PacientesDoctor() {
    const [
    doctorId,
    setDoctorId
] = useState(null);
    

    const [
        pacientes,
        setPacientes
    ] = useState([]);

    const [
        busqueda,
        setBusqueda
    ] = useState("");

    useEffect(() => {cargarDoctor();}, []);

    useEffect(() => {if (doctorId) {cargarPacientes();}}, [doctorId]);

    const cargarDoctor =
        async () => {
            try {
                const rut =
                    localStorage.getItem(
                        "rut"
                    );
                const doctor =
                    await obtenerDoctorPorRut(
                        rut
                    );
                setDoctorId(
                    doctor.id
                );
            } catch (error) {
                console.error(
                    error
                );
            }
        };


    const cargarPacientes =
        async () => {

            try {

                const data =
                    await obtenerPacientesDoctor(
                        doctorId
                    );

                setPacientes(
                    data
                );

            } catch (error) {

                console.error(
                    error
                );

            }

        };

    const pacientesFiltrados =
        pacientes.filter(
            paciente => {

                const textoBusqueda =
                    busqueda.toLowerCase();

                const nombreCompleto =
                    `${paciente.nombre} ${paciente.apellido}`
                        .toLowerCase();

                const rut =
                    paciente.rut
                        ?.toLowerCase() || "";

                return (
                    nombreCompleto.includes(
                        textoBusqueda
                    )
                    ||
                    rut.includes(
                        textoBusqueda
                    )
                );

            }
        );

    return (

        <>
            <Navbar />

            <div className="container mt-4">

                <div className="bg-light p-4 rounded shadow-sm mb-4">

                    <h2>
                        Mis Pacientes
                    </h2>

                    <p>
                        Pacientes atendidos
                        previamente
                    </p>

                </div>

                <div className="card shadow-sm">

                    <div className="card-body">

                        <div className="mb-3">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="
                                Buscar por nombre,
                                apellido o rut"
                                value={
                                    busqueda
                                }
                                onChange={(e) =>
                                    setBusqueda(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <p className="text-muted">

                            Mostrando
                            {" "}
                            {
                                pacientesFiltrados.length
                            }
                            {" "}
                            pacientes

                        </p>

                        <table
                            className="
                            table
                            table-hover
                            align-middle"
                        >
                            <thead>
                                <tr>
                                    <th>
                                        Nombre
                                    </th>
                                    <th>
                                        Apellido
                                    </th>
                                    <th>
                                        Rut
                                    </th>
                                    <th>
                                        Correo
                                    </th>
                                    <th>
                                        Teléfono
                                    </th>
                                    <th>
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pacientesFiltrados.map(
                                        paciente => (
                                            <tr
                                                key={
                                                    paciente.pacienteId
                                                }
                                            >
                                                <td>
                                                    {
                                                        paciente.nombre
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        paciente.apellido
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        paciente.rut
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        paciente.email
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        paciente.telefono
                                                    }
                                                </td>
                                                <td>
                                                    <button
                                                        className="
                                                        btn
                                                        disabled
                                                        btn-sm"
                                                    >
                                                        Ver Historial
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}