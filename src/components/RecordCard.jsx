import { money } from "../utils/money";

const recordColors = {
  fixedIncome: "#22c55e",
  extraIncome: "#84cc16",
  fixedExpense: "#f97316",
  received: "#2563eb",
  payment: "#dc2626",
  debt: "#ef4444",
  borrowed: "#a855f7",
  turkeyMoney: "#14b8a6",
};

function RecordCard({ title, subtitle, amount, currency = "USD", type }) {
  const color = recordColors[type] || "#334155";

  return (
    <div
      className="record"
      style={{
        borderLeft: `6px solid ${color}`,
      }}
    >
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <strong>{money(amount, currency)}</strong>
    </div>
  );
}

export default RecordCard;