import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  AffiliationsService,
  createAffiliationsService,
  type DashboardSummary,
  type PersonFilters,
} from "../../features/affiliations";
import type {
  Person,
  PersonDraft,
  PersonListView,
  Referent,
  ReferentDraft,
} from "../../domain/affiliations";

type AffiliationsContextValue = {
  isReady: boolean;
  people: Person[];
  referents: Referent[];
  dashboard: DashboardSummary;
  refresh: () => Promise<void>;
  getPersonById: (personId: string) => Person | undefined;
  getReferentById: (referentId: string) => Referent | undefined;
  getReferentPeople: (referentId: string) => Promise<Person[]>;
  getPersonList: (filters: PersonFilters, view: PersonListView) => Promise<Person[]>;
  createPerson: (draft: PersonDraft) => Promise<Person>;
  updatePerson: (personId: string, draft: PersonDraft) => Promise<Person>;
  deletePerson: (personId: string) => Promise<void>;
  createReferent: (draft: ReferentDraft) => Promise<Referent>;
  updateReferent: (referentId: string, draft: ReferentDraft) => Promise<Referent>;
};

const AffiliationsContext = createContext<AffiliationsContextValue | null>(null);

export function AffiliationsProvider({ children }: PropsWithChildren) {
  const service = useMemo(() => createAffiliationsService(), []);
  const [people, setPeople] = useState<Person[]>([]);
  const [referents, setReferents] = useState<Referent[]>([]);
  const [dashboard, setDashboard] = useState<DashboardSummary>({
    peopleInProgress: 0,
    pendingDni: 0,
    pendingSisapp: 0,
    missingFicha: 0,
  });
  const [isReady, setIsReady] = useState(false);

  const refresh = async () => {
    const [nextPeople, nextReferents, nextDashboard] = await Promise.all([
      service.listPeople(),
      service.listReferents(),
      service.getDashboardSummary(),
    ]);

    setPeople(nextPeople);
    setReferents(nextReferents);
    setDashboard(nextDashboard);
    setIsReady(true);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const value: AffiliationsContextValue = {
    isReady,
    people,
    referents,
    dashboard,
    refresh,
    getPersonById: (personId) => people.find((person) => person.id === personId),
    getReferentById: (referentId) => referents.find((referent) => referent.id === referentId),
    getReferentPeople: (referentId) => service.getReferentPeople(referentId),
    getPersonList: (filters, view) => service.getPeopleForList(filters, view),
    createPerson: async (draft) => {
      const person = await service.createPerson(draft);
      await refresh();
      return person;
    },
    updatePerson: async (personId, draft) => {
      const person = await service.updatePerson(personId, draft);
      await refresh();
      return person;
    },
    deletePerson: async (personId) => {
      await service.deletePerson(personId);
      await refresh();
    },
    createReferent: async (draft) => {
      const referent = await service.createReferent(draft);
      await refresh();
      return referent;
    },
    updateReferent: async (referentId, draft) => {
      const referent = await service.updateReferent(referentId, draft);
      await refresh();
      return referent;
    },
  };

  return <AffiliationsContext.Provider value={value}>{children}</AffiliationsContext.Provider>;
}

export function useAffiliations() {
  const context = useContext(AffiliationsContext);

  if (!context) {
    throw new Error("useAffiliations must be used inside AffiliationsProvider");
  }

  return context;
}
