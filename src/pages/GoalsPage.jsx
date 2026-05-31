import { useState } from "react";
import Header from "../components/Header";
import { money } from "../utils/money";

function GoalsPage({ account, goals, goBack, updateAccountGoals }) {
  const [page, setPage] = useState("home");

  const [goalTitle, setGoalTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalNote, setGoalNote] = useState("");
  const [savingInputs, setSavingInputs] = useState({});

  const activeGoals = goals.filter((goal) => goal.status === "active");
  const memoryGoals = goals.filter((goal) => goal.status !== "active");

  function saveGoals(nextGoals) {
    updateAccountGoals(account.id, nextGoals);
  }

  function addGoal() {
    if (!goalTitle.trim()) return;
    if (!goalAmount) return;

    const newGoal = {
      id: Date.now(),
      title: goalTitle.trim(),
      targetAmount: Number(goalAmount),
      savedAmount: 0,
      note: goalNote.trim(),
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
      finishedAt: "",
    };

    saveGoals([newGoal, ...goals]);

    setGoalTitle("");
    setGoalAmount("");
    setGoalNote("");
    setPage("home");
  }

  function addSaving(goalId) {
    const value = Number(savingInputs[goalId] || 0);
    if (!value) return;

    const nextGoals = goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            savedAmount: Number(goal.savedAmount || 0) + value,
          }
        : goal
    );

    saveGoals(nextGoals);

    setSavingInputs({
      ...savingInputs,
      [goalId]: "",
    });
  }

  function markGoal(goalId, status) {
    const nextGoals = goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            status,
            finishedAt: new Date().toISOString().slice(0, 10),
          }
        : goal
    );

    saveGoals(nextGoals);
  }

  function deleteGoal(goalId) {
    const ok = window.confirm("Bu hedef tamamen silinsin mi?");
    if (!ok) return;

    const nextGoals = goals.filter((goal) => goal.id !== goalId);
    saveGoals(nextGoals);
  }

  function progress(goal) {
    if (!goal.targetAmount) return 0;

    const percent =
      (Number(goal.savedAmount || 0) / Number(goal.targetAmount)) * 100;

    return Math.min(Math.round(percent), 100);
  }

  if (page === "add") {
    return (
      <div className="app">
        <Header title="Hedef Ekle" back={() => setPage("home")} />

        <div className="helper-card">
          <p>
            Almak istediğin şeyi buraya ekle. Bu bölüm muhasebeden bağımsızdır.
            Hedef tamamlanınca veya vazgeçince anı olarak kalır.
          </p>
        </div>

        <div className="form-card">
          <input
            placeholder="Hedef adı: Bilgisayar, telefon, araba..."
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Hedef tutarı: 3000"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
          />

          <input
            placeholder="Not: Neden almak istiyorsun?"
            value={goalNote}
            onChange={(e) => setGoalNote(e.target.value)}
          />

          <button onClick={addGoal}>Hedefi Kaydet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header title="Hedeflerim" back={goBack} />

      <div className="goal-hero">
        <p>Bağımsız hedef defteri</p>
        <h2>Almak istediklerin burada dursun</h2>
        <span>
          Para ayır, takip et, tamamlayınca işaretle. Vazgeçsen bile güzel bir
          anı olarak kalsın.
        </span>
      </div>

      <div className="home-actions">
        <button onClick={() => setPage("add")}>+ Hedef Ekle</button>
        <button onClick={goBack}>Menüye Dön</button>
      </div>

      <div className="records">
        <h2>Aktif Hedefler</h2>

        {activeGoals.length === 0 && (
          <p className="subtitle">Henüz aktif hedef yok.</p>
        )}

        {activeGoals.map((goal) => (
          <div className="goal-card" key={goal.id}>
            <div className="goal-top">
              <div>
                <h3>{goal.title}</h3>
                <p>{goal.note || "Not yok"} • {goal.createdAt}</p>
              </div>

              <strong>{money(goal.targetAmount)}</strong>
            </div>

            <div className="goal-progress">
              <div style={{ width: `${progress(goal)}%` }}></div>
            </div>

            <div className="goal-numbers">
              <span>Ayırdığın: {money(goal.savedAmount)}</span>
              <span>Kalan: {money(goal.targetAmount - goal.savedAmount)}</span>
              <span>%{progress(goal)}</span>
            </div>

            <div className="goal-saving-row">
              <input
                type="number"
                placeholder="Para ayır"
                value={savingInputs[goal.id] || ""}
                onChange={(e) =>
                  setSavingInputs({
                    ...savingInputs,
                    [goal.id]: e.target.value,
                  })
                }
              />

              <button onClick={() => addSaving(goal.id)}>Ekle</button>
            </div>

            <div className="goal-actions">
              <button onClick={() => markGoal(goal.id, "completed")}>
                ✓ Tamamlandı
              </button>

              <button onClick={() => markGoal(goal.id, "cancelled")}>
                Vazgeçtim
              </button>

              <button onClick={() => deleteGoal(goal.id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>

      <div className="records">
        <h2>Anı Olarak Kalanlar</h2>

        {memoryGoals.length === 0 && (
          <p className="subtitle">Henüz tamamlanan veya vazgeçilen hedef yok.</p>
        )}

        {memoryGoals.map((goal) => (
          <div className="goal-card memory-goal" key={goal.id}>
            <div className="goal-top">
              <div>
                <h3>
                  {goal.status === "completed" ? "✓ " : "○ "}
                  {goal.title}
                </h3>

                <p>
                  {goal.status === "completed" ? "Tamamlandı" : "Vazgeçildi"} •{" "}
                  {goal.finishedAt}
                </p>
              </div>

              <strong>{money(goal.targetAmount)}</strong>
            </div>

            <div className="goal-numbers">
              <span>Ayırılan: {money(goal.savedAmount)}</span>
              <span>Hedef: {money(goal.targetAmount)}</span>
            </div>

            <button
              className="danger-mini-button"
              onClick={() => deleteGoal(goal.id)}
            >
              Anıdan Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalsPage;