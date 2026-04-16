import { useEffect, useState } from "react";
import { useAffiliations } from "../app/providers/AffiliationsProvider";
import { PeopleCompactList } from "../components/people/PeopleCompactList";
import { PersonFilters } from "../components/people/PersonFilters";
import { PeopleTable } from "../components/people/PeopleTable";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import type { Person, PersonListView } from "../domain/affiliations";
import type { PersonFilters as PersonFiltersState } from "../features/affiliations";

const initialFilters: PersonFiltersState = {
  query: "",
  status: "",
  locality: "",
  referentId: "",
};

export function PeoplePage() {
  const { referents, getPersonList, isReady, deletePerson } = useAffiliations();
  const [view, setView] = useState<PersonListView>("complete");
  const [filters, setFilters] = useState<PersonFiltersState>(initialFilters);
  const [people, setPeople] = useState<Person[]>([]);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    void getPersonList(filters, view).then(setPeople);
  }, [filters, getPersonList, isReady, view, referents]);

  const handleConfirmDelete = async () => {
    if (!personToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deletePerson(personToDelete.id);
      setPersonToDelete(null);
      const refreshedPeople = await getPersonList(filters, view);
      setPeople(refreshedPeople);
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo eliminar la persona.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Personas"
        description="Listado principal con vista completa y reducida, filtros base y acceso a ficha."
        actionLabel="Alta nueva"
        actionTo="/personas/nueva"
      />

      <SegmentedControl
        label="Vista del listado"
        value={view}
        onChange={setView}
        options={[
          { value: "complete", label: "Vista completa" },
          { value: "compact", label: "Vista reducida" },
        ]}
      />

      <PersonFilters filters={filters} referents={referents} onChange={setFilters} />

      {!people.length ? (
        <EmptyState
          title="No hay resultados"
          description="Probá ajustar la búsqueda o crear una nueva ficha."
        />
      ) : view === "complete" ? (
        <PeopleTable people={people} referents={referents} onDelete={setPersonToDelete} />
      ) : (
        <PeopleCompactList people={people} referents={referents} onDelete={setPersonToDelete} />
      )}

      {personToDelete ? (
        <ConfirmDialog
          title={`¿Querés eliminar a ${personToDelete.firstName} ${personToDelete.lastName}?`}
          message="Esta acción elimina la ficha de la persona del listado actual."
          cancelLabel="Cancelar"
          confirmLabel="Confirmar eliminación"
          isLoading={isDeleting}
          onCancel={() => setPersonToDelete(null)}
          onConfirm={() => void handleConfirmDelete()}
        />
      ) : null}
    </div>
  );
}
