import { BrowserStorageDriver, MemoryStorageDriver } from "../../data/storage/storageDriver";
import {
  getPersonShortStatus,
  type Person,
  type PersonDraft,
  type PersonListView,
  type Referent,
  type ReferentDraft,
} from "../../domain/affiliations";
import { LocalPersonRepository, LocalReferentRepository } from "./localRepositories";
import type { PersonRepository, ReferentRepository } from "./repositories";

export type PersonFilters = {
  query: string;
  status: string;
  locality: string;
  referentId: string;
};

export type DashboardSummary = {
  peopleInProgress: number;
  pendingDni: number;
  pendingSisapp: number;
  missingFicha: number;
};

export class AffiliationsService {
  constructor(
    private readonly peopleRepository: PersonRepository,
    private readonly referentsRepository: ReferentRepository,
  ) {}

  listPeople() {
    return this.peopleRepository.list();
  }

  listReferents() {
    return this.referentsRepository.list();
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const people = await this.peopleRepository.list();
    return {
      peopleInProgress: people.filter((person) => person.status !== "Afiliado").length,
      pendingDni: people.filter((person) => !person.dni.trim() || !person.checklist.hasDniCopy).length,
      pendingSisapp: people.filter((person) => !person.checklist.inSisapp).length,
      missingFicha: people.filter((person) => !person.checklist.hasFichaArmada).length,
    };
  }

  async getPeopleForList(filters: PersonFilters, view: PersonListView) {
    const [people, referents] = await Promise.all([
      this.peopleRepository.list(),
      this.referentsRepository.list(),
    ]);

    const normalizedQuery = filters.query.trim().toLowerCase();
    const referentsById = new Map(referents.map((referent) => [referent.id, referent]));

    return people.filter((person) => {
      const fullName = `${person.lastName} ${person.firstName}`.toLowerCase();
      const compactStatus = getPersonShortStatus(person).toLowerCase();
      const referentNames = person.referents
        .map((link) => referentsById.get(link.referentId)?.fullName.toLowerCase() ?? "")
        .join(" ");

      const matchesQuery =
        !normalizedQuery ||
        fullName.includes(normalizedQuery) ||
        person.dni.includes(normalizedQuery) ||
        referentNames.includes(normalizedQuery) ||
        (view === "compact" && compactStatus.includes(normalizedQuery));

      const matchesStatus = !filters.status || person.status === filters.status;
      const matchesLocality = !filters.locality || person.address.locality === filters.locality;
      const matchesReferent =
        !filters.referentId ||
        person.referents.some((link) => link.referentId === filters.referentId);

      return matchesQuery && matchesStatus && matchesLocality && matchesReferent;
    });
  }

  createPerson(draft: PersonDraft) {
    return this.peopleRepository.create(draft);
  }

  updatePerson(personId: string, draft: PersonDraft) {
    return this.peopleRepository.update(personId, draft);
  }

  deletePerson(personId: string) {
    return this.peopleRepository.delete(personId);
  }

  createReferent(draft: ReferentDraft) {
    return this.referentsRepository.create(draft);
  }

  updateReferent(referentId: string, draft: ReferentDraft) {
    return this.referentsRepository.update(referentId, draft);
  }

  async getReferentPeople(referentId: string): Promise<Person[]> {
    const people = await this.peopleRepository.list();
    return people.filter((person) => person.referents.some((link) => link.referentId === referentId));
  }

  getPersonById(personId: string) {
    return this.peopleRepository.getById(personId);
  }

  getReferentById(referentId: string) {
    return this.referentsRepository.getById(referentId);
  }
}

export function createAffiliationsService() {
  const storage =
    typeof window !== "undefined" && window.localStorage
      ? new BrowserStorageDriver(window.localStorage)
      : new MemoryStorageDriver();

  return new AffiliationsService(
    new LocalPersonRepository(storage),
    new LocalReferentRepository(storage),
  );
}
