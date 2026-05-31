import { useState } from "react";
import InstallButton from "../components/InstallButton";

const recoveryQuestions = [
  "En sevdiğin öğretmenin kim?",
  "En anlaşamadığın öğretmenin kim?",
  "En sevdiğin sayı nedir?",
  "İlk evcil hayvanının adı neydi?",
  "Sevdiğin motorun modeli nedir?",
  "En sevdiğin yemek nedir?",
  "En sevdiğin içecek nedir?",
  "Çocukken en sevdiğin oyun neydi?",
  "En sevdiğin futbol takımı hangisi?",
  "En sevdiğin şehir neresi?",
  "Doğduğun şehir neresi?",
  "En sevdiğin renk nedir?",
  "En sevdiğin araba modeli nedir?",
  "En sevdiğin film nedir?",
  "En sevdiğin dizi nedir?",
  "En sevdiğin şarkı nedir?",
  "En sevdiğin kitap nedir?",
  "İlk telefon markan neydi?",
  "En sevdiğin tatlı nedir?",
  "En sevdiğin meyve nedir?",
  "En sevdiğin hayvan nedir?",
  "En sevdiğin sporcu kim?",
  "Çocukluk lakabın neydi?",
  "En sevdiğin arkadaşının adı ne?",
  "İlk okulunun adı neydi?",
  "En çok gitmek istediğin ülke neresi?",
  "En sevdiğin ay hangisi?",
  "En sevdiğin gün hangisi?",
  "En sevdiğin oyun hangisi?",
  "Unutmayacağın bir yerin adı ne?",
];

function cleanText(text) {
  return String(text || "").trim().toLocaleLowerCase("tr-TR");
}

function HomeScreen({ accounts, setAccounts, openAccount, resetAllData }) {
  const [page, setPage] = useState("home");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [setupRecovery, setSetupRecovery] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");

  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryPassed, setRecoveryPassed] = useState(false);
  const [recoveryAnswers, setRecoveryAnswers] = useState(["", "", ""]);
  const [recoveryAttempts, setRecoveryAttempts] = useState(3);
  const [recoveryMessage, setRecoveryMessage] = useState(
    "Allah’ın hakkı 3’tür, 3 hakkın kaldı."
  );
  const [newPassword, setNewPassword] = useState("");

  function resetCreateForm() {
    setName("");
    setPassword("");
    setSetupRecovery([
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
    ]);
    setError("");
  }

  function addAccount() {
    setError("");

    if (!name.trim()) {
      setError("Hesap adı boş olamaz.");
      return;
    }

    if (!password.trim()) {
      setError("Şifre boş olamaz.");
      return;
    }

    const selectedQuestions = setupRecovery.map((item) => item.question);
    const selectedAnswers = setupRecovery.map((item) => item.answer);

    if (selectedQuestions.some((q) => !q)) {
      setError("3 tane kurtarma sorusu seçmelisin.");
      return;
    }

    if (new Set(selectedQuestions).size !== 3) {
      setError("Aynı kurtarma sorusunu iki kere seçemezsin.");
      return;
    }

    if (selectedAnswers.some((a) => !a.trim())) {
      setError("Seçtiğin 3 sorunun cevabını da yazmalısın.");
      return;
    }

    const newAccount = {
      id: Date.now(),
      name: name.trim(),
      password: password.trim(),
      recoveryQuestions: setupRecovery.map((item) => ({
        question: item.question,
        answer: cleanText(item.answer),
      })),
      recoveryLocked: false,
      records: [],
      persons: [],
      goals: [],
    };

    setAccounts([newAccount, ...accounts]);
    resetCreateForm();
    setPage("home");
  }

  function openLogin(account) {
    setSelectedAccount(account);
    setLoginPassword("");
    setError("");
    setRecoveryMode(false);
    setRecoveryPassed(false);
    setRecoveryAnswers(["", "", ""]);
    setRecoveryAttempts(3);
    setRecoveryMessage("Allah’ın hakkı 3’tür, 3 hakkın kaldı.");
    setNewPassword("");
    setPage("login");
  }

  function login() {
    if (!selectedAccount) return;

    if (!selectedAccount.password) {
      openAccount(selectedAccount);
      return;
    }

    if (loginPassword === selectedAccount.password) {
      clearRecoveryLock(selectedAccount.id);
      openAccount(selectedAccount);
      return;
    }

    setError("Şifre yanlış.");
  }

  function clearRecoveryLock(accountId) {
    setAccounts(
      accounts.map((account) =>
        account.id === accountId
          ? { ...account, recoveryLocked: false }
          : account
      )
    );
  }

  function lockRecovery(accountId) {
    setAccounts(
      accounts.map((account) =>
        account.id === accountId
          ? { ...account, recoveryLocked: true }
          : account
      )
    );

    setSelectedAccount({
      ...selectedAccount,
      recoveryLocked: true,
    });
  }

  function startRecovery() {
    if (!selectedAccount) return;

    setError("");
    setRecoveryMode(true);
    setRecoveryPassed(false);
    setRecoveryAnswers(["", "", ""]);
    setRecoveryAttempts(3);
    setRecoveryMessage("Allah’ın hakkı 3’tür, 3 hakkın kaldı.");
    setNewPassword("");
  }

  function checkRecoveryAnswers() {
    if (!selectedAccount) return;

    if (selectedAccount.recoveryLocked) {
      setRecoveryMessage(
        "Kurtarma soruları kilitlendi. Artık sadece doğru şifreyle giriş yapılabilir."
      );
      return;
    }

    const questions = selectedAccount.recoveryQuestions || [];

    const correct = questions.every((item, index) => {
      return cleanText(recoveryAnswers[index]) === cleanText(item.answer);
    });

    if (correct) {
      setRecoveryPassed(true);
      setRecoveryMessage("Cevaplar doğru. Şimdi yeni şifre oluşturabilirsin.");
      return;
    }

    const left = recoveryAttempts - 1;
    setRecoveryAttempts(left);

    if (left === 2) {
      setRecoveryMessage("Yanlış cevap. Kaldı 2 hakkın.");
      return;
    }

    if (left === 1) {
      setRecoveryMessage("Baaaaak son hakkın, dikkatli ol!");
      return;
    }

    lockRecovery(selectedAccount.id);
    setRecoveryMessage(
      "Kurtarma hakkın bitti. Şifre doğru yazılana kadar kurtarma soruları kapanmıştır."
    );
  }

  function resetPasswordWithRecovery() {
    if (!selectedAccount) return;

    if (!newPassword.trim()) {
      setRecoveryMessage("Yeni şifre boş olamaz.");
      return;
    }

    const updatedAccount = {
      ...selectedAccount,
      password: newPassword.trim(),
      recoveryLocked: false,
    };

    setAccounts(
      accounts.map((account) =>
        account.id === selectedAccount.id ? updatedAccount : account
      )
    );

    setSelectedAccount(updatedAccount);
    setRecoveryMode(false);
    setRecoveryPassed(false);
    setLoginPassword("");
    setNewPassword("");
    setError("");
    setRecoveryMessage("Şifre değiştirildi. Yeni şifrenle giriş yapabilirsin.");
  }

  if (page === "create") {
    return (
      <div className="app">
        <div className="auth-card">
          <p>Yeni Profil</p>
          <h1>Profil Oluştur</h1>
          <span>
            Her profilin kendi şifresi ve kendi kurtarma soruları olacak.
          </span>
        </div>

        <div className="form-card">
          <input
            placeholder="Profil adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="password"
            placeholder="Bu profil için şifre oluştur"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {setupRecovery.map((item, index) => (
            <div className="helper-card" key={index}>
              <p>{index + 1}. Kurtarma sorusu</p>

              <select
                value={item.question}
                onChange={(e) => {
                  const next = [...setupRecovery];
                  next[index].question = e.target.value;
                  setSetupRecovery(next);
                }}
              >
                <option value="">Soru seç</option>
                {recoveryQuestions.map((question) => (
                  <option key={question} value={question}>
                    {question}
                  </option>
                ))}
              </select>

              <input
                placeholder="Cevabını yaz"
                value={item.answer}
                onChange={(e) => {
                  const next = [...setupRecovery];
                  next[index].answer = e.target.value;
                  setSetupRecovery(next);
                }}
              />
            </div>
          ))}

          {error && <p className="error-text">{error}</p>}

          <button onClick={addAccount}>Profili Kaydet</button>

          <button
            className="danger-mini-button"
            onClick={() => {
              resetCreateForm();
              setPage("home");
            }}
          >
            Vazgeç
          </button>
        </div>
      </div>
    );
  }

  if (page === "login" && selectedAccount) {
    if (recoveryMode) {
      return (
        <div className="app">
          <div className="auth-card">
            <p>{selectedAccount.name}</p>
            <h1>Şifre Kurtarma</h1>
            <span>3 soruyu doğru cevaplarsan yeni şifre oluşturabilirsin.</span>
          </div>

          <div className="form-card">
            {selectedAccount.recoveryLocked && (
              <p className="error-text">
                Kurtarma soruları kilitlendi. Artık sadece doğru şifreyle giriş
                yapılabilir.
              </p>
            )}

            {!selectedAccount.recoveryLocked &&
              !recoveryPassed &&
              (selectedAccount.recoveryQuestions || []).map((item, index) => (
                <div className="helper-card" key={index}>
                  <p>{item.question}</p>

                  <input
                    placeholder="Cevabını yaz"
                    value={recoveryAnswers[index]}
                    onChange={(e) => {
                      const next = [...recoveryAnswers];
                      next[index] = e.target.value;
                      setRecoveryAnswers(next);
                    }}
                  />
                </div>
              ))}

            {!recoveryPassed && (
              <p className={recoveryAttempts <= 1 ? "error-text" : "subtitle"}>
                {recoveryMessage}
              </p>
            )}

            {recoveryPassed && (
              <>
                <input
                  type="password"
                  placeholder="Yeni şifre yaz"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <p className="subtitle">{recoveryMessage}</p>

                <button onClick={resetPasswordWithRecovery}>
                  Yeni Şifreyi Kaydet
                </button>
              </>
            )}

            {!recoveryPassed && !selectedAccount.recoveryLocked && (
              <button onClick={checkRecoveryAnswers}>Cevapları Kontrol Et</button>
            )}

            <button
              className="danger-mini-button"
              onClick={() => {
                setRecoveryMode(false);
                setError("");
              }}
            >
              Giriş Ekranına Dön
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="app">
        <div className="auth-card">
          <p>Profil Girişi</p>
          <h1>{selectedAccount.name}</h1>
          <span>Bu profile girmek için şifreni yaz.</span>
        </div>

        <div className="form-card">
          <input
            type="password"
            placeholder="Profil şifresi"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
          />

          {error && <p className="error-text">{error}</p>}

          <button onClick={login}>Profile Gir</button>

          <button onClick={startRecovery}>Şifremi Unuttum</button>

          <button
            className="danger-mini-button"
            onClick={() => {
              setSelectedAccount(null);
              setPage("home");
            }}
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="brand-card">
        <img
          src="/icon.svg"
          alt="Kolay Muhasebe Logo"
          style={{
            width: "108px",
            height: "108px",
            borderRadius: "28px",
            objectFit: "cover",
            marginBottom: "14px",
            boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
          }}
        />

        <p>Kolay Muhasebe</p>
        <h1>Hesap Bilgilerim</h1>
        <span>Her profil kendi şifresiyle korunur.</span>
      </div>

      <InstallButton />

      <div className="home-actions">
        <button onClick={() => setPage("create")}>+ Profil Oluştur</button>
        <button onClick={resetAllData}>Verileri Sıfırla</button>
      </div>

      <div className="records">
        <h2>Profiller</h2>

        {accounts.length === 0 && (
          <p className="subtitle">
            Henüz profil yok. Başlamak için profil oluştur.
          </p>
        )}

        {accounts.map((account) => (
          <div
            key={account.id}
            className="record"
            onClick={() => openLogin(account)}
          >
            <div>
              <h3>{account.name}</h3>
              <p>Şifreyle giriş yap</p>
            </div>

            <strong>→</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;