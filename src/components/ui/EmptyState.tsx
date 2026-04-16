type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <article className="card empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
