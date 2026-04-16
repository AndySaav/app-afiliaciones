import { useState } from "react";
import type { Referent, ReferentDraft } from "../../domain/affiliations";

type ReferentFormProps = {
  mode: "create" | "edit";
  referent?: Referent;
  onSubmit: (draft: ReferentDraft) => Promise<void>;
};

export function ReferentForm({ mode, referent, onSubmit }: ReferentFormProps) {
  const [fullName, setFullName] = useState(referent?.fullName ?? "");
  const [observations, setObservations] = useState(referent?.observations ?? "");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim()) {
      setError("Completá apellido y nombre.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await onSubmit({
        fullName: fullName.trim(),
        observations: observations.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="form-layout" onSubmit={handleSubmit}>
      <section className="card form-section">
        <div className="section-heading">
          <p className="eyebrow">Referente</p>
          <h3>{mode === "create" ? "Alta de referente" : "Edicion de referente"}</h3>
        </div>
        <div className="form-grid">
          <label>
            <span>Apellido y nombre *</span>
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} />
            {error ? <small>{error}</small> : null}
          </label>
          <label className="field-span">
            <span>Observaciones generales</span>
            <textarea rows={5} value={observations} onChange={(event) => setObservations(event.target.value)} />
          </label>
        </div>
      </section>
      <div className="action-row sticky-actions">
        <button type="submit" className="button button-primary" disabled={isSaving}>
          {isSaving ? "Guardando..." : mode === "create" ? "Crear referente" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
