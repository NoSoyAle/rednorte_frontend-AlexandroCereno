import React, { useState, useEffect } from "react";
import * as bootstrap from "bootstrap";
import { obtenerHorariosDisponibles } from "../../../services/citaService";

export default function ModalReasignar({ cita, doctorId, onReasignar }) {
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const modalEl = document.getElementById("modalReasignar");
    if (!modalEl) return;
    const handler = () => {
      setNuevaFecha("");
      setHorarios([]);
      setHoraSeleccionada("");
      setCargando(false);
      setGuardando(false);
    };
    modalEl.addEventListener("show.bs.modal", handler);
    return () => modalEl.removeEventListener("show.bs.modal", handler);
  }, []);

  const cargarHorarios = async (fecha) => {
    if (!fecha || !doctorId) return;
    setCargando(true);
    setHoraSeleccionada("");
    try {
      const data = await obtenerHorariosDisponibles(doctorId, fecha);
      setHorarios(data || []);
    } catch (error) {
      console.error("Error cargando horarios:", error);
      setHorarios([]);
    } finally {
      setCargando(false);
    }
  };

  const handleFechaChange = (e) => {
    const fecha = e.target.value;
    setNuevaFecha(fecha);
    setHorarios([]);
    setHoraSeleccionada("");
    if (fecha) cargarHorarios(fecha);
  };

  const calcularDuracion = () => {
    if (!cita?.horaInicio || !cita?.horaFin) return 20;
    const [hI, mI] = cita.horaInicio.split(":").map(Number);
    const [hF, mF] = cita.horaFin.split(":").map(Number);
    return hF * 60 + mF - (hI * 60 + mI);
  };

  const calcularHoraFin = (horaInicio, duracion) => {
    const [h, m] = horaInicio.split(":").map(Number);
    const totalMin = h * 60 + m + duracion;
    return `${String(Math.floor(totalMin / 60)).padStart(2, "0")}:${String(totalMin % 60).padStart(2, "0")}:00`;
  };

  const handleReasignar = async () => {
    if (!nuevaFecha || !horaSeleccionada || !cita) return;

    setGuardando(true);
    try {
      const duracion = calcularDuracion();
      const horaFin = calcularHoraFin(horaSeleccionada, duracion);

      const citaActualizada = {
        ...cita,
        fecha: nuevaFecha,
        horaInicio: horaSeleccionada,
        horaFin,
      };

      await onReasignar(cita.id, citaActualizada);

      const modal = bootstrap.Modal.getInstance(document.getElementById("modalReasignar"));
      if (modal) modal.hide();
    } catch (error) {
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  if (!cita) return null;

  return (
    <div className="modal fade" id="modalReasignar" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reasignar Cita</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
          </div>
          <div className="modal-body">
            <div className="bg-light p-3 rounded mb-3">
              <h6 className="fw-bold">Datos actuales de la cita</h6>
              <p className="mb-1"><strong>Paciente:</strong> {cita.nombrePaciente}</p>
              <p className="mb-1"><strong>Fecha:</strong> {cita.fecha}</p>
              <p className="mb-0">
                <strong>Hora:</strong> {cita.horaInicio?.substring(0, 5)} - {cita.horaFin?.substring(0, 5)}
              </p>
            </div>

            <hr />

            <div className="mb-3">
              <label className="form-label fw-semibold">Nueva fecha</label>
              <input
                type="date"
                className="form-control"
                value={nuevaFecha}
                onChange={handleFechaChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {nuevaFecha && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Horarios disponibles</label>
                {cargando ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : horarios.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {horarios.map((hora) => (
                      <button
                        key={hora}
                        type="button"
                        className={`btn btn-sm ${horaSeleccionada === hora ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setHoraSeleccionada(hora)}
                      >
                        {hora.substring(0, 5)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No hay horarios disponibles para esta fecha</p>
                )}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!nuevaFecha || !horaSeleccionada || guardando}
              onClick={handleReasignar}
            >
              {guardando ? "Reasignando..." : "Reasignar Cita"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
