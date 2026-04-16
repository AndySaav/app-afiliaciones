import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAffiliations } from "../app/providers/AffiliationsProvider";
import { ReferentForm } from "../components/referents/ReferentForm";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import type { ReferentDraft } from "../domain/affiliations";

type ReferentFormPageProps = {
  mode: "create" | "edit";
};

export function ReferentFormPage({ mode }: ReferentFormPageProps) {
  const navigate = useNavigate();
  const { referentId } = useParams();
  const { getReferentById, createReferent, updateReferent } = useAffiliations();
  const referent = useMemo(
    () => (referentId ? getReferentById(referentId) : undefined),
    [getReferentById, referentId],
  );

  if (mode === "edit" && !referent) {
    return (
      <EmptyState
        title="Referente no encontrado"
        description="No pudimos ubicar el referente que querés editar."
      />
    );
  }

  const handleSubmit = async (draft: ReferentDraft) => {
    if (mode === "create") {
      const created = await createReferent(draft);
      navigate(`/referentes/${created.id}`);
      return;
    }

    if (!referentId) {
      return;
    }

    const updated = await updateReferent(referentId, draft);
    navigate(`/referentes/${updated.id}`);
  };

  return (
    <div className="page-stack">
      <PageHeader
        title={mode === "create" ? "Alta de referente" : "Edicion de referente"}
        description="Formulario simple desacoplado del detalle para futuras integraciones con backend."
      />
      <ReferentForm mode={mode} referent={referent} onSubmit={handleSubmit} />
    </div>
  );
}
