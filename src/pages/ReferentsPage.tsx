import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAffiliations } from "../app/providers/AffiliationsProvider";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";

export function ReferentsPage() {
  const { referents, people } = useAffiliations();
  const [query, setQuery] = useState("");

  const filteredReferents = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return referents.filter((referent) => {
      if (!normalized) {
        return true;
      }

      return (
        referent.fullName.toLowerCase().includes(normalized) ||
        referent.observations.toLowerCase().includes(normalized)
      );
    });
  }, [query, referents]);

  const peopleCountByReferent = new Map<string, number>();

  people.forEach((person) => {
    person.referents.forEach((link) => {
      peopleCountByReferent.set(link.referentId, (peopleCountByReferent.get(link.referentId) ?? 0) + 1);
    });
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Referentes"
        description="Listado general con buscador, alta nueva y acceso al detalle de vinculaciones."
        actionLabel="Nuevo referente"
        actionTo="/referentes/nuevo"
      />

      <section className="card">
        <label>
          <span>Buscar referente</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Apellido, nombre u observaciones"
          />
        </label>
      </section>

      {!filteredReferents.length ? (
        <EmptyState
          title="No hay referentes para mostrar"
          description="Probá con otra busqueda o crea un referente nuevo."
        />
      ) : (
        <section className="stack">
          {filteredReferents.map((referent) => (
            <article key={referent.id} className="card">
              <div className="inline-between">
                <div>
                  <p className="eyebrow">Referente</p>
                  <h3>{referent.fullName}</h3>
                  <p>{referent.observations || "Sin observaciones generales."}</p>
                  <p>{peopleCountByReferent.get(referent.id) ?? 0} personas vinculadas</p>
                </div>
                <Link className="button button-secondary" to={`/referentes/${referent.id}`}>
                  Ver detalle
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
