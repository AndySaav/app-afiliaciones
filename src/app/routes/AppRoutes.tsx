import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { DashboardPage } from "../../pages/DashboardPage";
import { PersonDetailPage } from "../../pages/PersonDetailPage";
import { PersonFormPage } from "../../pages/PersonFormPage";
import { PeoplePage } from "../../pages/PeoplePage";
import { ReferentDetailPage } from "../../pages/ReferentDetailPage";
import { ReferentFormPage } from "../../pages/ReferentFormPage";
import { ReferentsPage } from "../../pages/ReferentsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="personas" element={<PeoplePage />} />
        <Route path="personas/nueva" element={<PersonFormPage mode="create" />} />
        <Route path="personas/:personId" element={<PersonDetailPage />} />
        <Route path="personas/:personId/editar" element={<PersonFormPage mode="edit" />} />
        <Route path="referentes" element={<ReferentsPage />} />
        <Route path="referentes/nuevo" element={<ReferentFormPage mode="create" />} />
        <Route path="referentes/:referentId" element={<ReferentDetailPage />} />
        <Route path="referentes/:referentId/editar" element={<ReferentFormPage mode="edit" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
