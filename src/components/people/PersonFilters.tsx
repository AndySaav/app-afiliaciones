import { localityOptions, personStatusOptions, type Referent } from "../../domain/affiliations";
import type { PersonFilters as PersonFiltersState } from "../../features/affiliations";

type PersonFiltersProps = {
  filters: PersonFiltersState;
  referents: Referent[];
  onChange: (nextFilters: PersonFiltersState) => void;
};

export function PersonFilters({ filters, referents, onChange }: PersonFiltersProps) {
  return (
    <section className="card filter-grid">
      <label>
        <span>Buscar</span>
        <input
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="Nombre, apellido o DNI"
        />
      </label>

      <label>
        <span>Estado</span>
        <select
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value })}
        >
          <option value="">Todos</option>
          {personStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Localidad</span>
        <select
          value={filters.locality}
          onChange={(event) => onChange({ ...filters, locality: event.target.value })}
        >
          <option value="">Todas</option>
          {localityOptions.map((locality) => (
            <option key={locality} value={locality}>
              {locality}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Referente</span>
        <select
          value={filters.referentId}
          onChange={(event) => onChange({ ...filters, referentId: event.target.value })}
        >
          <option value="">Todos</option>
          {referents.map((referent) => (
            <option key={referent.id} value={referent.id}>
              {referent.fullName}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
