import Header from "../components/Header";
import {
  getBorrowedPeople,
  getBorrowedRemaining,
} from "../utils/calculations";
import { money } from "../utils/money";

function BorrowedPage({ records, goBack }) {
  const people = getBorrowedPeople(records);

  return (
    <div className="app">
      <Header title="Emanet Borçlar" back={goBack} />

      {people.length === 0 && (
        <p className="subtitle">Henüz emanet para kaydı yok.</p>
      )}

      {people.map((person) => (
        <div className="borrowed-person" key={person}>
          <span>{person}</span>

          <b>{money(getBorrowedRemaining(records, person))}</b>
        </div>
      ))}
    </div>
  );
}

export default BorrowedPage;