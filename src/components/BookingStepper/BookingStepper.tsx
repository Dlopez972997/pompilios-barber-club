import { IconChevron } from "../Icons";

export type StepState = "complete" | "current" | "pending";

const steps = [
  { title: "Servicio", text: "Selecciona el servicio" },
  { title: "Profesional", text: "Elige a tu barbero" },
  { title: "Fecha y hora", text: "Selecciona el día y horario" },
  { title: "Confirmación", text: "Revisa y confirma tu cita" },
];

type Props = {
  states: StepState[];
};

export function BookingStepper({ states }: Props) {
  return (
    <ol className="stepper" aria-label="Pasos de la reserva">
      {steps.map((step, index) => {
        const state = states[index];
        return (
          <li key={step.title} className={`stepper-item is-${state}`}>
            <span className="stepper-index" aria-hidden="true">
              {index + 1}
            </span>
            <span>
              <strong>{step.title}</strong>
              <small>{step.text}</small>
            </span>
            {index < steps.length - 1 ? (
              <span className="stepper-sep" aria-hidden="true">
                <IconChevron />
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
