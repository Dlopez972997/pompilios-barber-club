import { useEffect, useRef, useState } from "react";
import type { TeamMember } from "../../data/types";
import { Button } from "../Button/Button";
import { IconArrow } from "../Icons";
import { Rating } from "../Rating/Rating";

type Props = {
  member: TeamMember;
  index?: number;
  onView: (member: TeamMember) => void;
};

export function TeamCard({ member, index = 0, onView }: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || shown) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <article
      ref={cardRef}
      className={`team-card${shown ? " is-in" : ""}`}
      style={{ animationDelay: `${(index % 4) * 60}ms` }}
    >
      <div className="team-card-media">
        <img src={member.image} alt={member.name} />
      </div>
      <p className="eyebrow">{member.role}</p>
      <h3>{member.name}</h3>
      <Rating value={member.rating} count={member.reviews} />
      <Button variant="outline" full onClick={() => onView(member)}>
        Ver perfil
        <IconArrow />
      </Button>
    </article>
  );
}
