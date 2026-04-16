import type { Person, PersonDraft, Referent, ReferentDraft } from "../../domain/affiliations";

export interface PersonRepository {
  list(): Promise<Person[]>;
  getById(personId: string): Promise<Person | undefined>;
  create(draft: PersonDraft): Promise<Person>;
  update(personId: string, draft: PersonDraft): Promise<Person>;
  delete(personId: string): Promise<void>;
}

export interface ReferentRepository {
  list(): Promise<Referent[]>;
  getById(referentId: string): Promise<Referent | undefined>;
  create(draft: ReferentDraft): Promise<Referent>;
  update(referentId: string, draft: ReferentDraft): Promise<Referent>;
}
