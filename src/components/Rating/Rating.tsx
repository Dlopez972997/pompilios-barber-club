type Props = {
  value?: number;
  count?: number;
};

export function Rating({ value, count }: Props) {
  if (value == null) return null;
  const width = `${Math.max(0, Math.min(5, value)) / 5 * 100}%`;
  const label = count != null ? `${value.toFixed(1)} de 5, ${count} reseñas` : `${value.toFixed(1)} de 5`;

  return (
    <p className="rating" aria-label={label}>
      <span className="stars" aria-hidden="true">
        <span className="stars-base">★★★★★</span>
        <span className="stars-fill" style={{ width }}>
          ★★★★★
        </span>
      </span>
      <span className="rating-copy">
        <strong>{value.toFixed(1)}</strong>
        {count != null ? <span>({count} reseñas)</span> : null}
      </span>
    </p>
  );
}
