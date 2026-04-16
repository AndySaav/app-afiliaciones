import type { Person, Referent } from "../../domain/affiliations";

export const seedReferents: Referent[] = [
  {
    id: "ref-001",
    fullName: "Martinez, Laura",
    observations: "Coordina el circuito de Lujan centro.",
  },
  {
    id: "ref-002",
    fullName: "Gomez, Ricardo",
    observations: "Trabaja con relevamiento territorial en Open Door.",
  },
  {
    id: "ref-003",
    fullName: "Suarez, Andrea",
    observations: "Apoya altas nuevas y seguimiento documental.",
  },
];

export const seedPeople: Person[] = [
  {
    id: "per-001",
    lastName: "Fernandez",
    firstName: "Micaela",
    dni: "32111444",
    sex: "F",
    birthDate: "1990-02-15",
    address: {
      street: "San Martin",
      number: "414",
      locality: "Lujan",
    },
    status: "Para afiliar",
    createdAt: "2026-03-20T10:30:00.000Z",
    updatedAt: "2026-04-01T14:10:00.000Z",
    checklist: {
      hasFichaArmada: false,
      hasDniCopy: true,
      inSisapp: false,
      inPadron: false,
      generalObservations: "Aun falta terminar la ficha para enviar.",
    },
    hasReferents: true,
    referents: [
      {
        id: "link-001",
        referentId: "ref-001",
        role: "Principal",
        note: "Contacto inicial realizado.",
      },
    ],
    tracking: {
      contactDate: "2026-03-31",
      notes: "Pendiente confirmar horario para firma.",
    },
    attachments: {
      dniFrontUrl: "https://example.com/dni-frente-micaela",
      dniBackUrl: "",
      affiliationFormUrl: "",
    },
  },
  {
    id: "per-002",
    lastName: "Pereyra",
    firstName: "Julian",
    dni: "29888776",
    sex: "M",
    birthDate: "1986-11-03",
    address: {
      street: "Belgrano",
      number: "1002",
      locality: "Open Door",
    },
    status: "Enviado a Justicia",
    createdAt: "2026-03-18T08:00:00.000Z",
    updatedAt: "2026-04-03T09:45:00.000Z",
    affiliationDate: "2026-04-02",
    checklist: {
      hasFichaArmada: true,
      hasDniCopy: true,
      inSisapp: true,
      inPadron: false,
      generalObservations: "Se envio documentacion completa.",
    },
    hasReferents: true,
    referents: [
      {
        id: "link-002",
        referentId: "ref-002",
        role: "Principal",
        note: "",
      },
      {
        id: "link-003",
        referentId: "ref-003",
        role: "Subreferente",
        note: "Da soporte para seguimiento.",
      },
    ],
    tracking: {
      contactDate: "2026-04-01",
      notes: "Esperando devolucion.",
    },
    attachments: {
      dniFrontUrl: "https://example.com/dni-frente-julian",
      dniBackUrl: "https://example.com/dni-dorso-julian",
      affiliationFormUrl: "https://example.com/ficha-julian",
    },
  },
  {
    id: "per-003",
    lastName: "Lopez",
    firstName: "Claudia",
    dni: "35123987",
    sex: "F",
    address: {
      street: "Mitre",
      number: "87",
      locality: "Torres",
    },
    status: "Afiliado",
    createdAt: "2026-02-10T12:00:00.000Z",
    updatedAt: "2026-03-28T16:30:00.000Z",
    affiliationDate: "2026-03-25",
    checklist: {
      hasFichaArmada: true,
      hasDniCopy: true,
      inSisapp: true,
      inPadron: true,
      generalObservations: "Ficha cerrada sin observaciones.",
    },
    hasReferents: false,
    referents: [],
    tracking: {
      notes: "Caso finalizado.",
    },
    attachments: {
      dniFrontUrl: "",
      dniBackUrl: "",
      affiliationFormUrl: "https://example.com/ficha-claudia",
    },
  },
];
