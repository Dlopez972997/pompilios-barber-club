import type { TeamMember } from "../../data/types";
import { Button } from "../Button/Button";
import { IconArrow } from "../Icons";
import { Rating } from "../Rating/Rating";

type Props = {
  member: TeamMember;
  onView: (member: TeamMember) => void;
};

export function TeamCard({ member, onView }: Props) {
  return (
    <article className="team-card">
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
