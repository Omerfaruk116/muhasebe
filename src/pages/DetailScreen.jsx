import { useState } from "react";
import BalanceCard from "../components/BalanceCard";
import MenuPage from "./MenuPage";
import AddMenuPage from "./AddMenuPage";
import AddTransactionPage from "./AddTransactionPage";
import CalendarPage from "./CalendarPage";
import SummaryPage from "./SummaryPage";
import BorrowedPage from "./BorrowedPage";
import HistoryPage from "./HistoryPage";
import AssetsPage from "./AssetsPage";
import BackupPage from "./BackupPage";
import MonthlySummaryPage from "./MonthlySummaryPage";
import GoalsPage from "./GoalsPage";
import ChangePasswordPage from "./ChangePasswordPage";
import { getSummary } from "../utils/calculations";

function DetailScreen({
  account,
  accounts,
  goBack,
  updateAccountRecords,
  updateAccountPersons,
  updateAccountGoals,
  updateAccountSecurity,
  deleteAccount,
  importAllData,
}) {
  const [page, setPage] = useState("home");
  const [activeType, setActiveType] = useState("");

  const records = account.records || [];
  const persons = account.persons || [];
  const goals = account.goals || [];
  const summary = getSummary(records, persons);

  function openForm(type) {
    setActiveType(type);
    setPage("form");
  }

  if (page === "menu") {
    return (
      <MenuPage
        goBack={() => setPage("home")}
        goAdd={() => setPage("addMenu")}
        goCalendar={() => setPage("calendar")}
        goSummary={() => setPage("summary")}
        goMonthly={() => setPage("monthly")}
        goBorrowed={() => setPage("borrowed")}
        goHistory={() => setPage("history")}
        goAssets={() => setPage("assets")}
        goGoals={() => setPage("goals")}
        goPassword={() => setPage("password")}
        goBackup={() => setPage("backup")}
        deleteAccount={() => deleteAccount(account.id)}
      />
    );
  }

  if (page === "addMenu") {
    return <AddMenuPage goBack={() => setPage("menu")} openForm={openForm} />;
  }

  if (page === "form") {
    return (
      <AddTransactionPage
        account={account}
        activeType={activeType}
        goBack={() => setPage("addMenu")}
        goHome={() => setPage("home")}
        updateAccountRecords={updateAccountRecords}
      />
    );
  }

  if (page === "calendar") {
    return <CalendarPage records={records} goBack={() => setPage("menu")} />;
  }

  if (page === "summary") {
    return (
      <SummaryPage
        records={records}
        persons={persons}
        goBack={() => setPage("menu")}
      />
    );
  }

  if (page === "monthly") {
    return <MonthlySummaryPage records={records} goBack={() => setPage("menu")} />;
  }

  if (page === "borrowed") {
    return <BorrowedPage records={records} goBack={() => setPage("menu")} />;
  }

  if (page === "history") {
    return (
      <HistoryPage
        account={account}
        records={records}
        goBack={() => setPage("menu")}
        updateAccountRecords={updateAccountRecords}
      />
    );
  }

  if (page === "assets") {
    return (
      <AssetsPage
        account={account}
        goBack={() => setPage("menu")}
        updateAccountPersons={updateAccountPersons}
      />
    );
  }

  if (page === "goals") {
    return (
      <GoalsPage
        account={account}
        goals={goals}
        goBack={() => setPage("menu")}
        updateAccountGoals={updateAccountGoals}
      />
    );
  }

  if (page === "password") {
    return (
      <ChangePasswordPage
        account={account}
        goBack={() => setPage("menu")}
        updateAccountSecurity={updateAccountSecurity}
      />
    );
  }

  if (page === "backup") {
    return (
      <BackupPage
        accounts={accounts}
        goBack={() => setPage("menu")}
        importAllData={importAllData}
      />
    );
  }

  return (
    <div className="app">
      <div className="top">
        <button onClick={() => setPage("menu")}>⋮</button>

        <div>
          <p>Hesap Bilgilerim</p>
          <h1>{account.name}</h1>
        </div>

        <button onClick={goBack}>←</button>
      </div>

      <BalanceCard
        netBalance={summary.netBalance}
        remaining={summary.remaining}
        mustPay={summary.mustPay}
        normalPocketMoney={summary.normalPocketMoney}
        turkeyMoney={summary.totalTurkeyMoney}
      />

      <div className="home-actions">
        <button onClick={() => setPage("addMenu")}>İşlem Ekle</button>
        <button onClick={() => setPage("assets")}>Varlıklarım</button>
      </div>

      <div className="home-actions">
        <button onClick={() => setPage("goals")}>Hedeflerim</button>
        <button onClick={() => setPage("calendar")}>Takvim</button>
      </div>

      <div className="home-actions">
        <button onClick={() => setPage("monthly")}>Aylık Özet</button>
        <button onClick={() => setPage("summary")}>Özetler</button>
      </div>
    </div>
  );
}

export default DetailScreen;