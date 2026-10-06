import { timeSlots } from "../../data/site";

type Props = {
  selected: string | null;
  disabledSlots: string[];
  onSelect: (slot: string) => void;
};

export function TimeSlots({ selected, disabledSlots, onSelect }: Props) {
  return (
    <div className="slots">
      <p className="slots-title">Horarios disponibles</p>
      <div className="slots-grid" role="listbox" aria-label="Horarios disponibles">
        {timeSlots.map((slot) => {
          const disabled = disabledSlots.includes(slot);
          const isSelected = selected === slot;
          return (
            <button
              key={slot}
              type="button"
              role="option"
              aria-selected={isSelected}
              disabled={disabled}
              className={`slot${isSelected ? " is-selected" : ""}`}
              onClick={() => onSelect(slot)}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
