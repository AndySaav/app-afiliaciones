import { Link, useParams } from "react-router-dom";
import { useAffiliations } from "../app/providers/AffiliationsProvider";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { getPersonFullName } from "../domain/affiliations";

export function ReferentDetailPage() {
  const { referentId } = useParams();
  const { getReferentById, people } = useAffiliations();
  const referent = referentId ? getReferentById(referentId) : undefined;

  if (!referent) {
    return (
      <EmptyState
        title="Referente no encontrado"
        description="No pudimos ubicar el detalle solicitado."
      />
    );
  }

  const linkedPeople = people
    .filter((person) => person.referents.some((link) => link.referentId === referent.id))
    .map((person) => ({
      person,
      link: person.referents.find((link) => link.referentId === referent.id)!,
    }));

  return (
    <div className="page-stack">
      <PageHeader
        title={referent.fullName}
        description="Detalle del referente con observaciones y personas vinculadas."
        actionLabel="Editar referente"
        actionTo={`/referentes/${referent.id}/editar`}
      />

      <section className="card">
        <p className="eyebrow">Observaciones generales</p>
        <p>{referent.observations || "Sin observaciones generales."}</p>
      </section>

      <section className="card">
        <div className="inline-between">
          <div>
            <p className="eyebrow">Personas vinculadas</p>
            <h3>{linkedPeople.length} fichas</h3>
          </div>
        </div>

        <div className="stack">
          {linkedPeople.length ? (
            linkedPeople.map(({ person, link }) => (
              <article key={person.id} className="subcard">
                <div className="inline-between">
                  <div>
                    <h3>{getPersonFullName(person)}</h3>
                    <p>Rol en ficha: {link.role}</p>
                    <p>{link.note || "Sin observacion puntual."}</p>
                  </div>
                  <div className="detail-actions">
                    <StatusBadge>{person.status}</StatusBadge>
                    <Link className="button button-ghost" to={`/personas/${person.id}`}>
                      Ver ficha
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p>Este referente todavia no tiene personas vinculadas.</p>
          )}
        </div>
      </section>
    </div>
  );
}
