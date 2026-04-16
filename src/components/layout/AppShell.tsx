import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { to: "/", label: "Inicio" },
  { to: "/personas", label: "Personas" },
  { to: "/personas/nueva", label: "Alta" },
  { to: "/referentes", label: "Referentes" },
];

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="sticky-header">
        <div className="topbar">
          <div>
            <p className="eyebrow">Modulo independiente</p>
            <h1>Gestion de Afiliaciones</h1>
          </div>
          <p className="topbar-copy">
            Base V1 preparada para evolucionar a backend y base cloud sin rehacer la UI.
          </p>
        </div>

        <nav className="top-nav" aria-label="Navegacion principal">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
