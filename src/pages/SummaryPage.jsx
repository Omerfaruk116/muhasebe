import Header from "../components/Header";
import { getSummary, money } from "../utils/calculations";

function SummaryPage({ records, goBack }) {
  const summary = getSummary(records);

  return (
    <div className="app">
      <Header title="Genel Özetler" back={goBack} />

      <div className="summary-grid">
        <div>
          Sabit Gelir
          <b>{money(summary.totalFixedIncome)}</b>
        </div>

        <div>
          Ekstra Gelir
          <b>{money(summary.totalExtraIncome)}</b>
        </div>

        <div>
          Aldım
          <b>{money(summary.totalReceived)}</b>
        </div>

        <div>
          Kalan Alacak
          <b>{money(summary.remaining)}</b>
        </div>

        <div>
          Sabit Gider
          <b>{money(summary.totalFixedExpense)}</b>
        </div>

        <div>
          Borç
          <b>{money(summary.totalDebt)}</b>
        </div>

        <div>
          Ödenmesi Gereken
          <b>{money(summary.mustPay)}</b>
        </div>

        <div>
          Emanet Para
          <b>{money(summary.totalBorrowed)}</b>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;