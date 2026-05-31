import { useState } from "react";
import Header from "../components/Header";

function ChangePasswordPage({ account, goBack, updateAccountSecurity }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function changePassword() {
    setMessage("");
    setSuccess(false);

    if (!oldPassword.trim()) {
      setMessage("Eski şifreyi yazmalısın.");
      return;
    }

    if (oldPassword !== account.password) {
      setMessage("Eski şifre yanlış.");
      return;
    }

    if (!newPassword.trim()) {
      setMessage("Yeni şifre boş olamaz.");
      return;
    }

    if (newPassword.length < 3) {
      setMessage("Yeni şifre en az 3 karakter olmalı.");
      return;
    }

    if (newPassword !== newPasswordAgain) {
      setMessage("Yeni şifreler aynı değil.");
      return;
    }

    const ok = window.confirm("Şifre değiştirilsin mi?");
    if (!ok) return;

    updateAccountSecurity(account.id, {
      password: newPassword.trim(),
      recoveryLocked: false,
    });

    setOldPassword("");
    setNewPassword("");
    setNewPasswordAgain("");
    setSuccess(true);
    setMessage("Şifre başarıyla değiştirildi.");
  }

  return (
    <div className="app">
      <Header title="Şifreyi Değiştir" back={goBack} />

      <div className="helper-card">
        <p>
          Bu işlem sadece bu profilin şifresini değiştirir. Diğer profillerin
          şifresi etkilenmez.
        </p>
      </div>

      <div className="form-card">
        <input
          type="password"
          placeholder="Eski şifre"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Yeni şifre"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Yeni şifre tekrar"
          value={newPasswordAgain}
          onChange={(e) => setNewPasswordAgain(e.target.value)}
        />

        {message && (
          <p className={success ? "subtitle" : "error-text"}>
            {message}
          </p>
        )}

        <button onClick={changePassword}>Şifreyi Değiştir</button>
      </div>
    </div>
  );
}

export default ChangePasswordPage;