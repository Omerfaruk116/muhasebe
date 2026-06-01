import { useMemo, useState } from "react";
import Header from "../components/Header";
import RecordCard from "../components/RecordCard";
import { getSummary, labels, money } from "../utils/calculations";

function MonthlySummaryPage({ records, goBack }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const monthRecords = useMemo(() => {
    return records.filter((item) => item.date?.startsWith(month));
  }, [records, month]);

  const summary = getSummary(monthRecords);

  return (
    <div className="app">
      <Header title="Aylık Özet" back={goBack} />

      <div className="filter-card">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <div className="asset-main-card">
        <p>{month} özeti</p>
        <h2>{money(summary.netBalance)}</h2>

        <div className="asset-lines">
          <span>Almam Gereken: {money(summary.incomeExpected)}</span>
          <span>Aldım: {money(summary.totalReceived)}</span>
          <span>Kalan: {money(summary.remaining)}</span>
          <span>Ödeme: {money(summary.totalPayment)}</span>
          <span>Ödenmesi Gereken: {money(summary.mustPay)}</span>
        </div>
      </div>

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
          Borç
          <b>{money(summary.totalDebt)}</b>
        </div>

        <div>
          Emanet Para
          <b>{money(summary.totalBorrowed)}</b>
        </div>

        <div>
          Ödeme
          <b>{money(summary.totalPayment)}</b>
        </div>
      </div>

      <div className="records">
        <h2>Bu Ayın İşlemleri</h2>

        {monthRecords.length === 0 && (
          <p className="subtitle">Bu ay için kayıt yok.</p>
        )}

        {monthRecords.map((item) => (
          <RecordCard
            key={item.id}
            title={item.title}
            subtitle={`${labels[item.type] || "İşlem"} • ${item.date}`}
            amount={item.amount}
            currency={item.currency}
            type={item.type}
          />
        ))}
      </div>
    </div>
  );
}

export default MonthlySummaryPage;