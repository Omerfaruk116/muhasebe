import { useMemo, useState } from "react";
import Header from "../components/Header";
import RecordCard from "../components/RecordCard";
import { labels } from "../utils/calculations";

function formatDate(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function monthName(date) {
  return date.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });
}

function CalendarPage({ records, goBack }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarRecords = records.filter(
    (item) => item.type === "received" || item.type === "payment"
  );

  const selectedRecords = calendarRecords.filter(
    (item) => item.date === selectedDate
  );

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let startBlank = firstDay.getDay() - 1;
    if (startBlank < 0) startBlank = 6;

    const list = [];

    for (let i = 0; i < startBlank; i++) {
      list.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDate(year, month, day);
      const dayRecords = calendarRecords.filter((item) => item.date === dateKey);

      list.push({
        day,
        dateKey,
        hasReceived: dayRecords.some((item) => item.type === "received"),
        hasPayment: dayRecords.some((item) => item.type === "payment"),
      });
    }

    return list;
  }, [year, month, records]);

  function previousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  return (
    <div className="app">
      <Header title="Para Takvimi" back={goBack} />

      <div className="calendar-head">
        <button onClick={previousMonth}>←</button>
        <h2>{monthName(currentDate)}</h2>
        <button onClick={nextMonth}>→</button>
      </div>

      <div className="week-days">
        <span>Pzt</span>
        <span>Sal</span>
        <span>Çar</span>
        <span>Per</span>
        <span>Cum</span>
        <span>Cmt</span>
        <span>Paz</span>
      </div>

      <div className="calendar-grid">
        {days.map((item, index) => {
          if (!item) {
            return <div key={index} className="calendar-empty"></div>;
          }

          return (
            <button
              key={item.dateKey}
              className={
                selectedDate === item.dateKey
                  ? "calendar-day selected-day"
                  : "calendar-day"
              }
              onClick={() => setSelectedDate(item.dateKey)}
            >
              <span>{item.day}</span>

              <div className="day-lines">
                {item.hasReceived && <i className="day-blue"></i>}
                {item.hasPayment && <i className="day-red"></i>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="records">
        <h2>Seçili Gün</h2>
        <p className="subtitle">{selectedDate}</p>

        {selectedRecords.length === 0 && (
          <p className="subtitle">Bu günde işlem yok.</p>
        )}

        {selectedRecords.map((item) => (
          <RecordCard
            key={item.id}
            title={item.title}
            subtitle={`${labels[item.type]} • ${item.date}`}
            amount={item.amount}
            currency={item.currency}
            type={item.type}
          />
        ))}
      </div>
    </div>
  );
}

export default CalendarPage;