import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAffiliations } from "../app/providers/AffiliationsProvider";
import { PersonForm } from "../components/people/PersonForm";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import type { PersonDraft } from "../domain/affiliations";

type PersonFormPageProps = {
  mode: "create" | "edit";
};

export function PersonFormPage({ mode }: PersonFormPageProps) {
  const navigate = useNavigate();
  const { personId } = useParams();
  const { getPersonById, createPerson, updatePerson } = useAffiliations();
  const person = useMemo(() => (personId ? getPersonById(personId) : undefined), [getPersonById, personId]);

  if (mode === "edit" && !person) {
    return (
      <EmptyState
        title="Persona no encontrada"
        description="La ficha que querés editar no existe o todavia no se cargo en memoria."
      />
    );
  }

  const handleSubmit = async (draft: PersonDraft) => {
    try {
      if (mode === "create") {
        const created = await createPerson(draft);
        navigate(`/personas/${created.id}`);
        return;
      }

      if (!personId) {
        return;
      }

      const updated = await updatePerson(personId, draft);
      navigate(`/personas/${updated.id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo guardar la ficha.");
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        title={mode === "create" ? "Alta de persona" : "Edicion de persona"}
        description="Formulario dividido en siete bloques para dejar la ficha lista para futuras integraciones."
      />
      <PersonForm mode={mode} person={person} onSubmit={handleSubmit} />
    </div>
  );
}
