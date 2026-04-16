import { seedPeople, seedReferents } from "../../data/mock/seed";
import type { StorageDriver } from "../../data/storage/storageDriver";
import type { Person, PersonDraft, Referent, ReferentDraft } from "../../domain/affiliations";
import type { PersonRepository, ReferentRepository } from "./repositories";

const PEOPLE_KEY = "affiliations.people.v1";
const REFERENTS_KEY = "affiliations.referents.v1";

function generateId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function sortPeople(people: Person[]) {
  return [...people].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

function sortReferents(referents: Referent[]) {
  return [...referents].sort((left, right) => left.fullName.localeCompare(right.fullName));
}

export class LocalPersonRepository implements PersonRepository {
  constructor(private readonly storage: StorageDriver) {}

  async list() {
    const people = this.storage.read<Person[]>(PEOPLE_KEY) ?? seedPeople;
    this.storage.write(PEOPLE_KEY, people);
    return sortPeople(people);
  }

  async getById(personId: string) {
    const people = await this.list();
    return people.find((person) => person.id === personId);
  }

  async create(draft: PersonDraft) {
    const people = await this.list();
    const now = new Date().toISOString();
    const nextPerson: Person = {
      ...draft,
      id: generateId("per"),
      createdAt: now,
      updatedAt: now,
      referents: draft.referents.map((link) => ({
        ...link,
        id: link.id || generateId("link"),
      })),
    };

    this.assertUniqueDni(people, nextPerson.dni);
    const nextPeople = sortPeople([nextPerson, ...people]);
    this.storage.write(PEOPLE_KEY, nextPeople);
    return nextPerson;
  }

  async update(personId: string, draft: PersonDraft) {
    const people = await this.list();
    const currentPerson = people.find((person) => person.id === personId);

    if (!currentPerson) {
      throw new Error("La persona solicitada no existe.");
    }

    this.assertUniqueDni(
      people.filter((person) => person.id !== personId),
      draft.dni,
    );

    const nextPerson: Person = {
      ...draft,
      id: personId,
      createdAt: currentPerson.createdAt,
      updatedAt: new Date().toISOString(),
      referents: draft.referents.map((link) => ({
        ...link,
        id: link.id || generateId("link"),
      })),
    };

    const nextPeople = sortPeople(
      people.map((person) => (person.id === personId ? nextPerson : person)),
    );

    this.storage.write(PEOPLE_KEY, nextPeople);
    return nextPerson;
  }

  async delete(personId: string) {
    const people = await this.list();
    const exists = people.some((person) => person.id === personId);

    if (!exists) {
      throw new Error("La persona solicitada no existe.");
    }

    this.storage.write(
      PEOPLE_KEY,
      people.filter((person) => person.id !== personId),
    );
  }

  private assertUniqueDni(people: Person[], dni: string) {
    const normalizedDni = dni.trim();

    if (!normalizedDni) {
      return;
    }

    const duplicated = people.some((person) => person.dni.trim() === normalizedDni);

    if (duplicated) {
      throw new Error("Ya existe una persona cargada con ese DNI.");
    }
  }
}

export class LocalReferentRepository implements ReferentRepository {
  constructor(private readonly storage: StorageDriver) {}

  async list() {
    const referents = this.storage.read<Referent[]>(REFERENTS_KEY) ?? seedReferents;
    this.storage.write(REFERENTS_KEY, referents);
    return sortReferents(referents);
  }

  async getById(referentId: string) {
    const referents = await this.list();
    return referents.find((referent) => referent.id === referentId);
  }

  async create(draft: ReferentDraft) {
    const referents = await this.list();
    const nextReferent: Referent = {
      ...draft,
      id: generateId("ref"),
    };
    const nextReferents = sortReferents([nextReferent, ...referents]);
    this.storage.write(REFERENTS_KEY, nextReferents);
    return nextReferent;
  }

  async update(referentId: string, draft: ReferentDraft) {
    const referents = await this.list();
    const nextReferent: Referent = {
      ...draft,
      id: referentId,
    };
    const nextReferents = sortReferents(
      referents.map((referent) => (referent.id === referentId ? nextReferent : referent)),
    );
    this.storage.write(REFERENTS_KEY, nextReferents);
    return nextReferent;
  }
}
