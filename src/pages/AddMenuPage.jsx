import Header from "../components/Header";
import { labels } from "../utils/calculations";

function AddMenuPage({ goBack, openForm }) {
  return (
    <div className="app">
      <Header title="İşlem Ekle" back={goBack} />

      <div className="button-grid">
        {Object.keys(labels).map((type) => (
          <button key={type} onClick={() => openForm(type)}>
            {labels[type]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AddMenuPage;