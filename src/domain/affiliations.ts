export const localityOptions = [
  "Lujan",
  "Carlos Keen",
  "Jauregui",
  "Pueblo Nuevo",
  "Cortinez",
  "Torres",
  "Open Door",
  "Olivera",
] as const;

export const personStatusOptions = [
  "Para afiliar",
  "Enviado a Justicia",
  "Afiliado",
  "Rechazado",
  "Afiliacion anterior",
] as const;

export const sexOptions = ["F", "M", "X"] as const;
export const referentRoleOptions = ["Principal", "Subreferente", "Otro"] as const;
export const personListViewOptions = ["complete", "compact"] as const;

export type Locality = (typeof localityOptions)[number];
export type PersonStatus = (typeof personStatusOptions)[number];
export type Sex = (typeof sexOptions)[number];
export type ReferentRole = (typeof referentRoleOptions)[number];
export type PersonListView = (typeof personListViewOptions)[number];

export type Address = {
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  locality: Locality;
};

export type PersonChecklist = {
  hasFichaArmada: boolean;
  hasDniCopy: boolean;
  inSisapp: boolean;
  inPadron: boolean;
  generalObservations: string;
};

export type PersonReferentLink = {
  id: string;
  referentId: string;
  role: ReferentRole;
  note: string;
};

export type PersonTracking = {
  contactDate?: string;
  notes: string;
};

export type PersonAttachments = {
  dniFrontUrl: string;
  dniBackUrl: string;
  affiliationFormUrl: string;
};

export type Person = {
  id: string;
  lastName: string;
  firstName: string;
  dni: string;
  sex?: Sex;
  birthDate?: string;
  address: Address;
  status: PersonStatus;
  createdAt: string;
  updatedAt: string;
  affiliationDate?: string;
  checklist: PersonChecklist;
  hasReferents: boolean;
  referents: PersonReferentLink[];
  tracking: PersonTracking;
  attachments: PersonAttachments;
};

export type Referent = {
  id: string;
  fullName: string;
  observations: string;
};

export type PersonDraft = Omit<Person, "id" | "createdAt" | "updatedAt">;
export type ReferentDraft = Omit<Referent, "id">;

export function getPersonFullName(person: Pick<Person, "firstName" | "lastName">) {
  return `${person.lastName}, ${person.firstName}`;
}

export function getPersonShortStatus(person: Person) {
  if (!person.dni.trim() || !person.checklist.hasDniCopy) {
    return "Falta DNI";
  }

  if (!person.checklist.hasFichaArmada) {
    return "Falta ficha";
  }

  if (!person.checklist.inSisapp) {
    return "Falta SISAPP";
  }

  if (!person.hasReferents || person.referents.length === 0) {
    return "Sin referente";
  }

  return "Completo";
}

export function getPersonDisplayDni(person: Pick<Person, "dni">) {
  return person.dni.trim() || "Sin DNI cargado";
}
