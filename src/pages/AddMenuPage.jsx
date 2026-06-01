import Header from "../components/Header";

function AddMenuPage({ goBack, openForm }) {
  return (
    <div className="app">
      <Header title="İşlem Ekle" back={goBack} />

      <div className="button-grid">
        <button onClick={() => openForm("fixedIncome")}>Sabit Gelir</button>
        <button onClick={() => openForm("extraIncome")}>Ekstra Gelir</button>
        <button onClick={() => openForm("fixedExpense")}>Sabit Gider</button>
        <button onClick={() => openForm("received")}>Aldım</button>
        <button onClick={() => openForm("payment")}>Ödeme</button>
        <button onClick={() => openForm("debt")}>Borç</button>
        <button onClick={() => openForm("borrowed")}>Emanet Para</button>
      </div>
    </div>
  );
}

export default AddMenuPage;