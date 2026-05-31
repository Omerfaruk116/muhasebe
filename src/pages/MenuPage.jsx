import Header from "../components/Header";

function MenuPage({
  goBack,
  goAdd,
  goCalendar,
  goSummary,
  goMonthly,
  goBorrowed,
  goHistory,
  goAssets,
  goGoals,
  goPassword,
  goBackup,
  deleteAccount,
}) {
  return (
    <div className="app">
      <Header title="Menü" back={goBack} />

      <div className="menu-list">
        <button onClick={goAdd}>İşlem Ekle</button>
        <button onClick={goAssets}>Varlıklarım</button>
        <button onClick={goGoals}>Hedeflerim</button>
        <button onClick={goHistory}>Son İşlemler</button>
        <button onClick={goCalendar}>Para Takvimi</button>
        <button onClick={goMonthly}>Aylık Özet</button>
        <button onClick={goSummary}>Genel Özetler</button>
        <button onClick={goBorrowed}>Emanet Borçlar</button>
        <button onClick={goPassword}>Şifreyi Değiştir</button>
        <button onClick={goBackup}>Yedekleme</button>

        <button
          onClick={deleteAccount}
          style={{
            background: "#7f1d1d",
            color: "#fecaca",
            marginTop: "18px",
          }}
        >
          Hesabı Kaldır
        </button>
      </div>
    </div>
  );
}

export default MenuPage;