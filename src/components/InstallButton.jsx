import { useEffect, useState } from "react";

function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (standalone) {
      setIsInstalled(true);
    }

    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setInstallPrompt(event);
    }

    function handleInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function installApp() {
    if (isInstalled) {
      alert("Uygulama zaten yüklü görünüyor.");
      return;
    }

    if (installPrompt) {
      installPrompt.prompt();

      const result = await installPrompt.userChoice;

      if (result.outcome === "accepted") {
        setIsInstalled(true);
      }

      setInstallPrompt(null);
      return;
    }

    alert(
      "Telefon şu anda direkt yükleme penceresi vermedi.\n\nAndroid: Chrome sağ üst 3 nokta → Uygulamayı yükle veya Ana ekrana ekle.\n\niPhone: Safari → Paylaş → Ana Ekrana Ekle."
    );
  }

  return (
    <button
      onClick={installApp}
      style={{
        width: "100%",
        marginTop: "14px",
        border: "1px solid rgba(34, 197, 94, 0.45)",
        background: "linear-gradient(135deg, #047857, #1d4ed8)",
        color: "white",
        padding: "16px",
        borderRadius: "18px",
        fontWeight: "bold",
        fontSize: "16px",
        boxShadow: "0 14px 34px rgba(34, 197, 94, 0.18)",
      }}
    >
      {isInstalled ? "Uygulama Yüklendi" : "📲 Uygulamayı Yükle"}
    </button>
  );
}

export default InstallButton;