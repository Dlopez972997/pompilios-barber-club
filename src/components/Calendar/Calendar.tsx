import { addMonths, calendarCells, isPastDay, isSameDay, isSunday, monthLabel, weekdays } from "../../utils/dates";
import { IconChevron } from "../Icons";

type Props = {
  month: Date;
  selected: Date | null;
  onMonth: (month: Date) => void;
  onSelect: (date: Date) => void;
};

export function Calendar({ month, selected, onMonth, onSelect }: Props) {
  const cells = calendarCells(month);
  const today = new Date();

  return (
    <div className="calendar">
      <div className="calendar-head">
        <button type="button" aria-label="Mes anterior" onClick={() => onMonth(addMonths(month, -1))}>
          <IconChevron direction="left" />
        </button>
        <strong>{monthLabel(month)}</strong>
        <button type="button" aria-label="Mes siguiente" onClick={() => onMonth(addMonths(month, 1))}>
          <IconChevron direction="right" />
        </button>
      </div>
      <div className="calendar-grid" role="grid" aria-label={monthLabel(month)}>
        {weekdays.map((day) => (
          <span key={day} className="calendar-dow" role="columnheader">
            {day}
          </span>
        ))}
        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;
          const disabled = isSunday(day) || isPastDay(day, today);
          const selectedDay = selected ? isSameDay(day, selected) : false;
          return (
            <button
              key={day.toISOString()}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-pressed={selectedDay}
              aria-label={day.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
              className={selectedDay ? "is-selected" : ""}
              onClick={() => onSelect(day)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
