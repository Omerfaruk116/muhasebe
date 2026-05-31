import Header from "../components/Header";
import { getSummary } from "../utils/calculations";
import { money } from "../utils/money";

function SummaryPage({ records, persons, goBack }) {
  const summary = getSummary(records, persons);

  return (
    <div className="app">
      <Header title="Özetler" back={goBack} />

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
          Sabit Gider
          <b>{money(summary.totalFixedExpense)}</b>
        </div>

        <div>
          Aldım
          <b>{money(summary.totalReceived)}</b>
        </div>

        <div>
          Ödeme
          <b>{money(summary.totalPayment)}</b>
        </div>

        <div>
          Borç
          <b>{money(summary.totalDebt)}</b>
        </div>

        <div>
          Emanet Para
          <b>{money(summary.totalBorrowed)}</b>
        </div>

        <div>
          TR’deki Para
          <b>{money(summary.totalTurkeyMoney, "TRY")}</b>
        </div>

        <div>
          Ödenmesi Gereken
          <b>{money(summary.mustPay)}</b>
        </div>

        <div>
          Varlıklarım
          <b>{money(summary.normalPocketMoney)}</b>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;