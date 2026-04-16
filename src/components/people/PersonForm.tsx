import { useMemo, useState } from "react";
import {
  localityOptions,
  personStatusOptions,
  referentRoleOptions,
  sexOptions,
  type Person,
  type PersonDraft,
  type Referent,
} from "../../domain/affiliations";
import { useAffiliations } from "../../app/providers/AffiliationsProvider";

type PersonFormProps = {
  mode: "create" | "edit";
  person?: Person;
  onSubmit: (draft: PersonDraft) => Promise<void>;
};

type ValidationErrors = Partial<Record<string, string>>;

function createEmptyState(): PersonDraft {
  return {
    lastName: "",
    firstName: "",
    dni: "",
    sex: undefined,
    birthDate: "",
    address: {
      street: "",
      number: "",
      floor: "",
      apartment: "",
      locality: "Lujan",
    },
    status: "Para afiliar",
    affiliationDate: "",
    checklist: {
      hasFichaArmada: false,
      hasDniCopy: false,
      inSisapp: false,
      inPadron: false,
      generalObservations: "",
    },
    hasReferents: false,
    referents: [],
    tracking: {
      contactDate: "",
      notes: "",
    },
    attachments: {
      dniFrontUrl: "",
      dniBackUrl: "",
      affiliationFormUrl: "",
    },
  };
}

function buildInitialState(person?: Person): PersonDraft {
  if (!person) {
    return createEmptyState();
  }

  return {
    ...person,
    birthDate: person.birthDate ?? "",
    affiliationDate: person.affiliationDate ?? "",
    tracking: {
      contactDate: person.tracking.contactDate ?? "",
      notes: person.tracking.notes,
    },
  };
}

export function PersonForm({ mode, person, onSubmit }: PersonFormProps) {
  const { referents, createReferent } = useAffiliations();
  const [form, setForm] = useState<PersonDraft>(() => buildInitialState(person));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [newReferentName, setNewReferentName] = useState("");
  const [newReferentNotes, setNewReferentNotes] = useState("");
  const [inlineMessage, setInlineMessage] = useState("");

  const linkedReferentIds = useMemo(() => new Set(form.referents.map((item) => item.referentId)), [form]);
  const availableReferents = referents.filter((referent) => !linkedReferentIds.has(referent.id));

  const updateReferentLink = (index: number, field: "referentId" | "role" | "note", value: string) => {
    const nextReferents = [...form.referents];
    nextReferents[index] = {
      ...nextReferents[index],
      [field]: value,
    };
    setForm({ ...form, referents: nextReferents });
  };

  const validate = () => {
    const nextErrors: ValidationErrors = {};

    if (!form.lastName.trim()) nextErrors.lastName = "Completá el apellido.";
    if (!form.firstName.trim()) nextErrors.firstName = "Completá el nombre.";

    if (form.hasReferents) {
      form.referents.forEach((referent, index) => {
        if (!referent.referentId) {
          nextErrors[`referent-${index}`] = "Seleccioná un referente.";
        }
      });
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveInlineReferent = async () => {
    if (!newReferentName.trim()) {
      setInlineMessage("Escribí apellido y nombre del referente.");
      return;
    }

    const referent = await createReferent({
      fullName: newReferentName.trim(),
      observations: newReferentNotes.trim(),
    });

    setForm({
      ...form,
      hasReferents: true,
      referents: [
        ...form.referents,
        {
          id: "",
          referentId: referent.id,
          role: "Principal",
          note: "",
        },
      ],
    });
    setNewReferentName("");
    setNewReferentNotes("");
    setInlineMessage("Referente creado y vinculado a la ficha.");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSaving(true);

    try {
      await onSubmit({
        ...form,
        birthDate: form.birthDate || undefined,
        affiliationDate: form.affiliationDate || undefined,
        referents: form.hasReferents ? form.referents : [],
        tracking: {
          contactDate: form.tracking.contactDate || undefined,
          notes: form.tracking.notes,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="form-layout" onSubmit={handleSubmit}>
      <section className="card form-section">
        <div className="section-heading">
          <p className="eyebrow">1. Datos personales</p>
          <h3>{mode === "create" ? "Alta nueva" : "Edición de ficha"}</h3>
        </div>
        <div className="form-grid">
          <label>
            <span>Apellido *</span>
            <input value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
            {errors.lastName ? <small>{errors.lastName}</small> : null}
          </label>
          <label>
            <span>Nombre *</span>
            <input value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
            {errors.firstName ? <small>{errors.firstName}</small> : null}
          </label>
          <label>
            <span>DNI</span>
            <input
              value={form.dni}
              onChange={(event) => setForm({ ...form, dni: event.target.value.replace(/\D/g, "") })}
            />
            {errors.dni ? <small>{errors.dni}</small> : null}
          </label>
          <label>
            <span>Sexo</span>
            <select
              value={form.sex ?? ""}
              onChange={(event) =>
                setForm({ ...form, sex: (event.target.value || undefined) as PersonDraft["sex"] })
              }
            >
              <option value="">Sin definir</option>
              {sexOptions.map((sex) => (
                <option key={sex} value={sex}>
                  {sex}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Fecha de nacimiento</span>
            <input type="date" value={form.birthDate} onChange={(event) => setForm({ ...form, birthDate: event.target.value })} />
          </label>
        </div>
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <p className="eyebrow">2. Domicilio</p>
          <h3>Ubicación</h3>
        </div>
        <div className="form-grid">
          <label>
            <span>Calle</span>
            <input
              value={form.address.street}
              onChange={(event) => setForm({ ...form, address: { ...form.address, street: event.target.value } })}
            />
            {errors.street ? <small>{errors.street}</small> : null}
          </label>
          <label>
            <span>Número</span>
            <input
              value={form.address.number}
              onChange={(event) => setForm({ ...form, address: { ...form.address, number: event.target.value } })}
            />
            {errors.number ? <small>{errors.number}</small> : null}
          </label>
          <label>
            <span>Piso</span>
            <input
              value={form.address.floor ?? ""}
              onChange={(event) => setForm({ ...form, address: { ...form.address, floor: event.target.value } })}
            />
          </label>
          <label>
            <span>Departamento</span>
            <input
              value={form.address.apartment ?? ""}
              onChange={(event) =>
                setForm({ ...form, address: { ...form.address, apartment: event.target.value } })
              }
            />
          </label>
          <label>
            <span>Localidad *</span>
            <select
              value={form.address.locality}
              onChange={(event) =>
                setForm({
                  ...form,
                  address: { ...form.address, locality: event.target.value as PersonDraft["address"]["locality"] },
                })
              }
            >
              {localityOptions.map((locality) => (
                <option key={locality} value={locality}>
                  {locality}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <p className="eyebrow">3. Estado y fechas</p>
          <h3>Seguimiento administrativo</h3>
        </div>
        <div className="form-grid">
          <label>
            <span>Estado *</span>
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value as PersonDraft["status"] })}
            >
              {personStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Fecha de afiliación</span>
            <input
              type="date"
              value={form.affiliationDate}
              onChange={(event) => setForm({ ...form, affiliationDate: event.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <p className="eyebrow">4. Checklist de gestión</p>
          <h3>Control operativo</h3>
        </div>
        <div className="checkbox-grid">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={form.checklist.hasFichaArmada}
              onChange={(event) =>
                setForm({ ...form, checklist: { ...form.checklist, hasFichaArmada: event.target.checked } })
              }
            />
            <span>Ficha armada</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={form.checklist.hasDniCopy}
              onChange={(event) =>
                setForm({ ...form, checklist: { ...form.checklist, hasDniCopy: event.target.checked } })
              }
            />
            <span>Copia DNI</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={form.checklist.inSisapp}
              onChange={(event) =>
                setForm({ ...form, checklist: { ...form.checklist, inSisapp: event.target.checked } })
              }
            />
            <span>Cargado en SISAPP</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={form.checklist.inPadron}
              onChange={(event) =>
                setForm({ ...form, checklist: { ...form.checklist, inPadron: event.target.checked } })
              }
            />
            <span>Aparece en padrón</span>
          </label>
        </div>
        <label>
          <span>Observaciones generales</span>
          <textarea
            rows={4}
            value={form.checklist.generalObservations}
            onChange={(event) =>
              setForm({ ...form, checklist: { ...form.checklist, generalObservations: event.target.value } })
            }
          />
        </label>
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <p className="eyebrow">5. Referentes</p>
          <h3>Vinculación</h3>
        </div>
        <label className="toggle-row">
          <span>¿Tiene referente?</span>
          <input
            type="checkbox"
            checked={form.hasReferents}
            onChange={(event) =>
              setForm({
                ...form,
                hasReferents: event.target.checked,
                referents: event.target.checked ? form.referents : [],
              })
            }
          />
        </label>

        {form.hasReferents ? (
          <>
            <div className="stack">
              {form.referents.map((link, index) => (
                <article key={`${link.id}-${index}`} className="subcard">
                  <div className="form-grid">
                    <label>
                      <span>Referente</span>
                      <select value={link.referentId} onChange={(event) => updateReferentLink(index, "referentId", event.target.value)}>
                        <option value="">Seleccionar</option>
                        {referents.map((referent: Referent) => (
                          <option key={referent.id} value={referent.id}>
                            {referent.fullName}
                          </option>
                        ))}
                      </select>
                      {errors[`referent-${index}`] ? <small>{errors[`referent-${index}`]}</small> : null}
                    </label>
                    <label>
                      <span>Rol</span>
                      <select value={link.role} onChange={(event) => updateReferentLink(index, "role", event.target.value)}>
                        {referentRoleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="field-span">
                      <span>Observación</span>
                      <input value={link.note} onChange={(event) => updateReferentLink(index, "note", event.target.value)} />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() =>
                      setForm({
                        ...form,
                        referents: form.referents.filter((_, currentIndex) => currentIndex !== index),
                      })
                    }
                  >
                    Quitar referente
                  </button>
                </article>
              ))}
            </div>

            <div className="action-row">
              <button
                type="button"
                className="button button-secondary"
                onClick={() =>
                  setForm({
                    ...form,
                    referents: [
                      ...form.referents,
                      { id: "", referentId: availableReferents[0]?.id ?? "", role: "Principal", note: "" },
                    ],
                  })
                }
              >
                Agregar referente vinculado
              </button>
            </div>

            <article className="subcard">
              <p className="eyebrow">Alta rápida desde la ficha</p>
              <div className="form-grid">
                <label>
                  <span>Apellido y nombre</span>
                  <input value={newReferentName} onChange={(event) => setNewReferentName(event.target.value)} />
                </label>
                <label className="field-span">
                  <span>Observaciones</span>
                  <textarea rows={3} value={newReferentNotes} onChange={(event) => setNewReferentNotes(event.target.value)} />
                </label>
              </div>
              <div className="action-row">
                <button type="button" className="button button-secondary" onClick={handleSaveInlineReferent}>
                  Crear referente
                </button>
                {inlineMessage ? <small>{inlineMessage}</small> : null}
              </div>
            </article>
          </>
        ) : null}
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <p className="eyebrow">6. Seguimiento / notas</p>
          <h3>Contacto y comentarios</h3>
        </div>
        <div className="form-grid">
          <label>
            <span>Fecha de contacto</span>
            <input
              type="date"
              value={form.tracking.contactDate ?? ""}
              onChange={(event) => setForm({ ...form, tracking: { ...form.tracking, contactDate: event.target.value } })}
            />
          </label>
          <label className="field-span">
            <span>Notas</span>
            <textarea rows={4} value={form.tracking.notes} onChange={(event) => setForm({ ...form, tracking: { ...form.tracking, notes: event.target.value } })} />
          </label>
        </div>
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <p className="eyebrow">7. Adjuntos</p>
          <h3>Links de documentación</h3>
        </div>
        <div className="form-grid">
          <label>
            <span>Link DNI frente</span>
            <input value={form.attachments.dniFrontUrl} onChange={(event) => setForm({ ...form, attachments: { ...form.attachments, dniFrontUrl: event.target.value } })} />
          </label>
          <label>
            <span>Link DNI dorso</span>
            <input value={form.attachments.dniBackUrl} onChange={(event) => setForm({ ...form, attachments: { ...form.attachments, dniBackUrl: event.target.value } })} />
          </label>
          <label className="field-span">
            <span>Link ficha de afiliación</span>
            <input value={form.attachments.affiliationFormUrl} onChange={(event) => setForm({ ...form, attachments: { ...form.attachments, affiliationFormUrl: event.target.value } })} />
          </label>
        </div>
      </section>

      <div className="action-row sticky-actions">
        <button type="submit" className="button button-primary" disabled={isSaving}>
          {isSaving ? "Guardando..." : mode === "create" ? "Crear persona" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
