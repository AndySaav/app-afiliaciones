import { Link } from "react-router-dom";

type PageHeaderProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
};

export function PageHeader({ title, description, actionLabel, actionTo }: PageHeaderProps) {
  return (
    <section className="page-header card">
      <div>
        <p className="eyebrow">Gestion operativa</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {actionLabel && actionTo ? (
        <Link className="button button-primary" to={actionTo}>
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
