import Header from "../components/Header";

function BackupPage({ accounts, goBack, importAllData }) {
  function downloadBackup() {
    const data = {
      app: "Kolay Muhasebe",
      version: 1,
      createdAt: new Date().toISOString(),
      accounts,
    };

    const file = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kolay-muhasebe-yedek-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function uploadBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);

        const importedAccounts = Array.isArray(parsed)
          ? parsed
          : parsed.accounts;

        if (!Array.isArray(importedAccounts)) {
          alert("Bu dosya geçerli bir yedek dosyası değil.");
          return;
        }

        const ok = window.confirm(
          "Yedek yüklenecek. Mevcut verilerin yerine geçecek. Emin misin?"
        );

        if (!ok) return;

        importAllData(importedAccounts);
        alert("Yedek başarıyla yüklendi.");
      } catch {
        alert("Yedek dosyası okunamadı.");
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="app">
      <Header title="Yedekleme" back={goBack} />

      <div className="helper-card">
        <p>
          Verilerin tarayıcıda saklanır. Telefon değiştirirsen veya tarayıcı
          verilerini silersen gitmemesi için arada yedek al.
        </p>
      </div>

      <div className="backup-card">
        <h2>Yedek Al</h2>
        <p>Bu işlem bütün hesaplarını, kişilerini ve varlıklarını JSON dosyası olarak indirir.</p>
        <button onClick={downloadBackup}>Yedeği İndir</button>
      </div>

      <div className="backup-card">
        <h2>Yedek Yükle</h2>
        <p>Daha önce indirdiğin yedek dosyasını seç.</p>
        <input type="file" accept="application/json" onChange={uploadBackup} />
      </div>
    </div>
  );
}

export default BackupPage;