import { Link } from "react-router-dom";
import { useAffiliations } from "../app/providers/AffiliationsProvider";
import { StatCard } from "../components/ui/StatCard";

export function DashboardPage() {
  const { dashboard, people, referents } = useAffiliations();

  return (
    <div className="page-stack">
      <section className="hero card">
        <div>
          <p className="eyebrow">Resumen rapido</p>
          <h2>Panel operativo</h2>
          <p>
            Estado general del modulo con accesos rapidos para continuar la carga y el
            seguimiento.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="button button-primary" to="/personas">
            Ver personas
          </Link>
          <Link className="button button-secondary" to="/personas/nueva">
            Alta nueva
          </Link>
          <Link className="button button-ghost" to="/referentes">
            Referentes
          </Link>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Personas en proceso" value={dashboard.peopleInProgress} />
        <StatCard label="Pendientes de DNI" value={dashboard.pendingDni} tone="warning" />
        <StatCard label="Pendientes SISAPP" value={dashboard.pendingSisapp} tone="warning" />
        <StatCard label="Falta armar ficha" value={dashboard.missingFicha} tone="warning" />
      </section>

      <section className="card summary-grid">
        <article>
          <p className="eyebrow">Personas cargadas</p>
          <strong>{people.length}</strong>
          <p>Con ficha, checklist y seguimiento listos para escalar a backend.</p>
        </article>
        <article>
          <p className="eyebrow">Referentes activos</p>
          <strong>{referents.length}</strong>
          <p>Submodulo vinculado con relaciones uno a muchos desde cada persona.</p>
        </article>
      </section>
    </div>
  );
}
