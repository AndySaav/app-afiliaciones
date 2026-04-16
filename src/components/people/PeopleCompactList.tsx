import { Link } from "react-router-dom";
import {
  getPersonFullName,
  getPersonShortStatus,
  type Person,
  type Referent,
} from "../../domain/affiliations";
import { StatusBadge } from "../ui/StatusBadge";

type PeopleCompactListProps = {
  people: Person[];
  referents: Referent[];
  onDelete: (person: Person) => void;
};

export function PeopleCompactList({ people, referents, onDelete }: PeopleCompactListProps) {
  const referentsById = new Map(referents.map((referent) => [referent.id, referent]));

  return (
    <section className="compact-list">
      <div className="card compact-summary">
        <p>Total visible</p>
        <strong>{people.length} registros</strong>
      </div>

      {people.map((person, index) => (
        <article key={person.id} className="card compact-item">
          <div className="compact-topline">
            <span>#{index + 1}</span>
            <div className="compact-actions">
              <StatusBadge>{getPersonShortStatus(person)}</StatusBadge>
              <button
                type="button"
                className="icon-button icon-button-danger"
                aria-label={`Eliminar a ${person.firstName} ${person.lastName}`}
                onClick={() => onDelete(person)}
              >
                X
              </button>
            </div>
          </div>
          <h3>
            <Link to={`/personas/${person.id}`}>{getPersonFullName(person)}</Link>
          </h3>
          <p>
            Referente:{" "}
            {person.referents[0]
              ? referentsById.get(person.referents[0].referentId)?.fullName ?? "Sin referente"
              : "Sin referente"}
          </p>
          <p>{getPersonShortStatus(person)}</p>
        </article>
      ))}
    </section>
  );
}
