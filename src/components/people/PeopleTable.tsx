import { Link } from "react-router-dom";
import {
  getPersonDisplayDni,
  getPersonFullName,
  type Person,
  type Referent,
} from "../../domain/affiliations";
import { formatDateTime } from "../../lib/formatters";
import { StatusBadge } from "../ui/StatusBadge";

type PeopleTableProps = {
  people: Person[];
  referents: Referent[];
  onDelete: (person: Person) => void;
};

export function PeopleTable({ people, referents, onDelete }: PeopleTableProps) {
  const referentsById = new Map(referents.map((referent) => [referent.id, referent]));

  return (
    <section className="card table-card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Persona</th>
              <th>DNI</th>
              <th>Localidad</th>
              <th>Estado</th>
              <th>Referente</th>
              <th>Ultimo movimiento</th>
              <th aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td>
                  <Link className="table-link" to={`/personas/${person.id}`}>
                    {getPersonFullName(person)}
                  </Link>
                </td>
                <td>{getPersonDisplayDni(person)}</td>
                <td>{person.address.locality}</td>
                <td>
                  <StatusBadge>{person.status}</StatusBadge>
                </td>
                <td>
                  {person.referents[0]
                    ? referentsById.get(person.referents[0].referentId)?.fullName ?? "Sin referente"
                    : "Sin referente"}
                </td>
                <td>{formatDateTime(person.updatedAt)}</td>
                <td>
                  <button
                    type="button"
                    className="icon-button icon-button-danger"
                    aria-label={`Eliminar a ${person.firstName} ${person.lastName}`}
                    onClick={() => onDelete(person)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
