import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAffiliations } from "../app/providers/AffiliationsProvider";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { getPersonDisplayDni, getPersonFullName } from "../domain/affiliations";
import { formatDate, formatDateTime } from "../lib/formatters";

export function PersonDetailPage() {
  const navigate = useNavigate();
  const { personId } = useParams();
  const { getPersonById, referents, deletePerson } = useAffiliations();
  const person = personId ? getPersonById(personId) : undefined;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!person) {
    return (
      <EmptyState
        title="Ficha no encontrada"
        description="No pudimos ubicar la persona solicitada en este momento."
      />
    );
  }

  const referentsById = new Map(referents.map((referent) => [referent.id, referent]));
  const personDisplayName = `${person.firstName} ${person.lastName}`;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deletePerson(person.id);
      navigate("/personas");
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo eliminar la persona.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        title={getPersonFullName(person)}
        description="Detalle de lectura con checklist, referentes, seguimiento y links de documentacion."
        actionLabel="Editar ficha"
        actionTo={`/personas/${person.id}/editar`}
      />

      <section className="card detail-grid">
        <article>
          <p className="eyebrow">Datos principales</p>
          <h3>{getPersonDisplayDni(person)}</h3>
          <p>{person.address.locality}</p>
          <p>
            {person.address.street} {person.address.number}
          </p>
          <p>Alta: {formatDateTime(person.createdAt)}</p>
          <p>Ultimo movimiento: {formatDateTime(person.updatedAt)}</p>
          <StatusBadge>{person.status}</StatusBadge>
        </article>

        <article>
          <p className="eyebrow">Fechas</p>
          <p>Fecha de nacimiento: {formatDate(person.birthDate)}</p>
          <p>Fecha de afiliacion: {formatDate(person.affiliationDate)}</p>
          <p>Ultimo contacto: {formatDate(person.tracking.contactDate)}</p>
        </article>
      </section>

      <section className="card">
        <p className="eyebrow">Checklist</p>
        <div className="checklist-readonly">
          <span>{person.checklist.hasFichaArmada ? "Ficha armada" : "Falta ficha armada"}</span>
          <span>{person.checklist.hasDniCopy ? "Copia DNI lista" : "Falta copia DNI"}</span>
          <span>{person.checklist.inSisapp ? "Cargado en SISAPP" : "Pendiente SISAPP"}</span>
          <span>{person.checklist.inPadron ? "Aparece en padron" : "No aparece en padron"}</span>
        </div>
        <p>{person.checklist.generalObservations || "Sin observaciones generales."}</p>
      </section>

      <section className="card">
        <p className="eyebrow">Referentes vinculados</p>
        <div className="stack">
          {person.referents.length ? (
            person.referents.map((link) => {
              const referent = referentsById.get(link.referentId);
              return (
                <article key={link.id} className="subcard">
                  <div className="inline-between">
                    <div>
                      <h3>{referent?.fullName ?? "Referente no encontrado"}</h3>
                      <p>Rol: {link.role}</p>
                      <p>{link.note || "Sin observacion puntual."}</p>
                    </div>
                    {referent ? (
                      <Link className="button button-ghost" to={`/referentes/${referent.id}`}>
                        Ver referente
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })
          ) : (
            <p>La ficha no tiene referentes vinculados.</p>
          )}
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Notas y documentacion</p>
        <p>{person.tracking.notes || "Sin notas de seguimiento."}</p>
        <div className="link-list">
          {person.attachments.dniFrontUrl ? (
            <a href={person.attachments.dniFrontUrl} target="_blank" rel="noreferrer">
              Abrir DNI frente
            </a>
          ) : null}
          {person.attachments.dniBackUrl ? (
            <a href={person.attachments.dniBackUrl} target="_blank" rel="noreferrer">
              Abrir DNI dorso
            </a>
          ) : null}
          {person.attachments.affiliationFormUrl ? (
            <a href={person.attachments.affiliationFormUrl} target="_blank" rel="noreferrer">
              Abrir ficha de afiliacion
            </a>
          ) : null}
        </div>
      </section>

      <section className="card danger-zone">
        <p className="eyebrow">Eliminar registro</p>
        <h3>Accion irreversible</h3>
        <p>Usá esta accion solo si querés borrar la ficha completa de la persona.</p>
        <div className="action-row">
          <button type="button" className="button button-danger" onClick={() => setShowDeleteConfirm(true)}>
            Eliminar persona
          </button>
        </div>
      </section>

      {showDeleteConfirm ? (
        <ConfirmDialog
          title={`¿Querés eliminar a ${personDisplayName}?`}
          message="Esta accion elimina la ficha de la persona de esta version de la app."
          cancelLabel="Cancelar"
          confirmLabel="Confirmar eliminacion"
          isLoading={isDeleting}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => void handleDelete()}
        />
      ) : null}
    </div>
  );
}
