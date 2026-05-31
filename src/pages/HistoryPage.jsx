import { useMemo, useState } from "react";
import Header from "../components/Header";
import { labels } from "../utils/calculations";
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

function HistoryPage({ account, records, goBack, updateAccountRecords }) {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editReceiveMethod, setEditReceiveMethod] = useState("bank");

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const text = `${item.title} ${labels[item.type] || ""} ${item.date} ${
        item.receiveTarget || ""
      } ${item.paymentTarget || ""}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesMonth = month ? item.date?.startsWith(month) : true;

      return matchesSearch && matchesMonth;
    });
  }, [records, search, month]);

  function startEdit(record) {
    setEditingRecord(record);
    setEditTitle(record.receiveTarget || record.paymentTarget || record.title || "");
    setEditAmount(record.amount || "");
    setEditDate(record.date || new Date().toISOString().slice(0, 10));
    setEditReceiveMethod(record.receiveMethod || "bank");
  }

  function cancelEdit() {
    setEditingRecord(null);
    setEditTitle("");
    setEditAmount("");
    setEditDate("");
    setEditReceiveMethod("bank");
  }

  function saveEdit() {
    if (!editingRecord) return;
    if (!editAmount) return;
    if (!editTitle.trim()) return;

    const methodLabel =
      editReceiveMethod === "cash" ? "Cash / Nakit" : "Bank / Banka";

    const updatedRecords = records.map((record) => {
      if (record.id !== editingRecord.id) return record;

      if (record.type === "received") {
        return {
          ...record,
          title: `${editTitle.trim()} → ${methodLabel}`,
          receiveTarget: editTitle.trim(),
          receiveMethod: editReceiveMethod,
          amount: Number(editAmount),
          date: editDate,
        };
      }

      if (record.type === "payment") {
        return {
          ...record,
          title: editTitle.trim(),
          paymentTarget: editTitle.trim(),
          amount: Number(editAmount),
          date: editDate,
        };
      }

      return {
        ...record,
        title: editTitle.trim(),
        amount: Number(editAmount),
        date: editDate,
      };
    });

    updateAccountRecords(account.id, updatedRecords);
    cancelEdit();
  }

  function deleteRecord(recordId) {
    const ok = window.confirm("Bu kaydı silmek istediğine emin misin?");
    if (!ok) return;

    const updatedRecords = records.filter((record) => record.id !== recordId);
    updateAccountRecords(account.id, updatedRecords);
  }

  if (editingRecord) {
    return (
      <div className="app">
        <Header title="Kaydı Düzenle" back={cancelEdit} />

        <div className="helper-card">
          <p>
            Bu ekrandan yanlış girdiğin kaydı düzeltebilirsin. Kaydet deyince
            eski kayıt güncellenir.
          </p>
        </div>

        <div className="form-card">
          <input
            placeholder={
              editingRecord.type === "received"
                ? "Kimden aldın?"
                : editingRecord.type === "payment"
                ? "Neyi ödedin?"
                : "Başlık"
            }
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          {editingRecord.type === "received" && (
            <div className="method-box">
              <p>Para sana nasıl verildi?</p>

              <div className="method-buttons">
                <button
                  type="button"
                  className={editReceiveMethod === "cash" ? "method-active" : ""}
                  onClick={() => setEditReceiveMethod("cash")}
                >
                  Cash / Nakit
                </button>

                <button
                  type="button"
                  className={editReceiveMethod === "bank" ? "method-active" : ""}
                  onClick={() => setEditReceiveMethod("bank")}
                >
                  Bank / Banka
                </button>
              </div>
            </div>
          )}

          <input
            type="number"
            placeholder="Tutar"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
          />

          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
          />

          <button onClick={saveEdit}>Değişiklikleri Kaydet</button>
          <button className="danger-mini-button" onClick={cancelEdit}>
            Vazgeç
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header title="Geçmiş Kayıtlar" back={goBack} />

      <div className="filter-card">
        <input
          placeholder="Ara: Kurs, Visa, Annem..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        {(search || month) && (
          <button
            onClick={() => {
              setSearch("");
              setMonth("");
            }}
          >
            Filtreyi Temizle
          </button>
        )}
      </div>

      {filteredRecords.length === 0 && (
        <p className="subtitle">Bu filtreye uygun kayıt yok.</p>
      )}

      {filteredRecords.map((item) => (
        <div
          className="record edit-record"
          key={item.id}
          style={{
            borderLeft: `6px solid ${recordColors[item.type] || "#334155"}`,
          }}
        >
          <div>
            <h3>{item.title}</h3>
            <p>{labels[item.type] || "İşlem"} • {item.date}</p>
            <p>{money(item.amount, item.currency)}</p>
            {item.monthlyRepeat && <p>Aylık tekrar açık</p>}
            {item.autoGenerated && <p>Otomatik oluşturuldu</p>}

            <div className="record-actions">
              <button onClick={() => startEdit(item)}>Düzenle</button>
              <button onClick={() => deleteRecord(item.id)}>Sil</button>
            </div>
          </div>

          <strong>{money(item.amount, item.currency)}</strong>
        </div>
      ))}
    </div>
  );
}

export default HistoryPage;