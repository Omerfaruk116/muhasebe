import { useState } from "react";
import Header from "../components/Header";
import {
  assetLabels,
  getPaymentTargets,
  getSummary,
} from "../utils/calculations";
import { money } from "../utils/money";

function AssetsPage({ account, goBack, updateAccountPersons }) {
  const records = account.records || [];
  const persons = account.persons || [];

  const [page, setPage] = useState("home");
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const [personName, setPersonName] = useState("");
  const [assetKind, setAssetKind] = useState("try");
  const [assetTitle, setAssetTitle] = useState("");
  const [assetAmount, setAssetAmount] = useState("");
  const [assetQuantity, setAssetQuantity] = useState("");
  const [assetDate, setAssetDate] = useState(new Date().toISOString().slice(0, 10));

  const summary = getSummary(records, persons);
  const selectedPerson = persons.find((person) => person.id === selectedPersonId);

  const debtTargets = getPaymentTargets(records, false);
  const incomeTotal = summary.totalFixedIncome + summary.totalExtraIncome;

  function savePersons(nextPersons) {
    updateAccountPersons(account.id, nextPersons);
  }

  function addPerson() {
    if (!personName.trim()) return;

    const newPerson = {
      id: Date.now(),
      name: personName.trim(),
      assets: [],
    };

    savePersons([newPerson, ...persons]);
    setPersonName("");
    setPage("home");
  }

  function openPerson(person) {
    setSelectedPersonId(person.id);
    setPage("person");
  }

  function addAssetToPerson() {
    if (!selectedPerson) return;

    const isMoney = assetKind === "try" || assetKind === "usd";

    if (isMoney && !assetAmount) return;
    if (!isMoney && !assetQuantity) return;

    const newAsset = {
      id: Date.now(),
      kind: assetKind,
      title: assetTitle.trim() || assetLabels[assetKind],
      amount: isMoney ? Number(assetAmount) : 0,
      quantity: isMoney ? 0 : Number(assetQuantity),
      date: assetDate,
    };

    const updatedPersons = persons.map((person) =>
      person.id === selectedPerson.id
        ? {
            ...person,
            assets: [newAsset, ...(person.assets || [])],
          }
        : person
    );

    savePersons(updatedPersons);

    setAssetKind("try");
    setAssetTitle("");
    setAssetAmount("");
    setAssetQuantity("");
    setAssetDate(new Date().toISOString().slice(0, 10));
    setPage("person");
  }

  function removeAssetFromPerson(assetId) {
    if (!selectedPerson) return;

    const ok = window.confirm("Bu varlık geri alındı / silinsin mi?");
    if (!ok) return;

    const updatedPersons = persons.map((person) =>
      person.id === selectedPerson.id
        ? {
            ...person,
            assets: (person.assets || []).filter((asset) => asset.id !== assetId),
          }
        : person
    );

    savePersons(updatedPersons);
  }

  function formatAsset(asset) {
    if (asset.kind === "usd") {
      return money(asset.amount, "USD");
    }

    if (asset.kind === "try") {
      return money(asset.amount, "TRY");
    }

    return `${asset.quantity} ${asset.title || assetLabels[asset.kind]}`;
  }

  function personAssetSummary(person) {
    const result = {
      usd: 0,
      try: 0,
      quarterGold: 0,
      gramGold: 0,
      bracelet: 0,
      otherGold: 0,
      otherAsset: 0,
    };

    (person.assets || []).forEach((asset) => {
      if (asset.kind === "usd") {
        result.usd += Number(asset.amount || 0);
      } else if (asset.kind === "try") {
        result.try += Number(asset.amount || 0);
      } else {
        result[asset.kind] += Number(asset.quantity || 0);
      }
    });

    return result;
  }

  if (page === "addPerson") {
    return (
      <div className="app">
        <Header title="Kişi Ekle" back={() => setPage("home")} />

        <div className="form-card">
          <input
            placeholder="Kişi adı: Annem, Babam, Ahmet..."
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
          />

          <button onClick={addPerson}>Kişiyi Kaydet</button>
        </div>
      </div>
    );
  }

  if (page === "addAsset" && selectedPerson) {
    const isMoney = assetKind === "try" || assetKind === "usd";

    return (
      <div className="app">
        <Header
          title={`${selectedPerson.name} İçin Varlık Ekle`}
          back={() => setPage("person")}
        />

        <div className="form-card">
          <select
            value={assetKind}
            onChange={(e) => {
              setAssetKind(e.target.value);
              setAssetAmount("");
              setAssetQuantity("");
            }}
          >
            {Object.keys(assetLabels).map((key) => (
              <option key={key} value={key}>
                {assetLabels[key]}
              </option>
            ))}
          </select>

          <input
            placeholder="Başlık yazmak istersen"
            value={assetTitle}
            onChange={(e) => setAssetTitle(e.target.value)}
          />

          {isMoney ? (
            <input
              type="number"
              placeholder={assetKind === "try" ? "Tutar yaz (TL)" : "Tutar yaz ($)"}
              value={assetAmount}
              onChange={(e) => setAssetAmount(e.target.value)}
            />
          ) : (
            <input
              type="number"
              placeholder="Adet / miktar yaz"
              value={assetQuantity}
              onChange={(e) => setAssetQuantity(e.target.value)}
            />
          )}

          <input
            type="date"
            value={assetDate}
            onChange={(e) => setAssetDate(e.target.value)}
          />

          <button onClick={addAssetToPerson}>Varlığı Kaydet</button>
        </div>
      </div>
    );
  }

  if (page === "person" && selectedPerson) {
    const s = personAssetSummary(selectedPerson);

    return (
      <div className="app">
        <Header title={selectedPerson.name} back={() => setPage("home")} />

        <div className="asset-overview-card">
          <h2>{selectedPerson.name} Varlıkları</h2>

          <div className="asset-mini-grid">
            <div>
              Dolar
              <b>{money(s.usd, "USD")}</b>
            </div>

            <div>
              Türk Lirası
              <b>{money(s.try, "TRY")}</b>
            </div>

            <div>
              Çeyrek Altın
              <b>{s.quarterGold}</b>
            </div>

            <div>
              Gram Altın
              <b>{s.gramGold}</b>
            </div>

            <div>
              Bilezik
              <b>{s.bracelet}</b>
            </div>

            <div>
              Diğer Altın
              <b>{s.otherGold}</b>
            </div>
          </div>
        </div>

        <div className="home-actions">
          <button onClick={() => setPage("addAsset")}>Varlık Ekle</button>
          <button onClick={() => setPage("home")}>Kişilere Dön</button>
        </div>

        <div className="records">
          <h2>Liste</h2>

          {(selectedPerson.assets || []).length === 0 && (
            <p className="subtitle">Bu kişi için henüz varlık yok.</p>
          )}

          {(selectedPerson.assets || []).map((asset) => (
            <div className="record" key={asset.id}>
              <div>
                <h3>{asset.title || assetLabels[asset.kind]}</h3>
                <p>{assetLabels[asset.kind]} • {asset.date}</p>

                <button
                  onClick={() => removeAssetFromPerson(asset.id)}
                  style={{
                    marginTop: "10px",
                    border: "none",
                    background: "#7f1d1d",
                    color: "white",
                    padding: "9px 12px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Geri Aldım / Sil
                </button>
              </div>

              <strong>{formatAsset(asset)}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header title="Varlıklarım" back={goBack} />

      <div className="asset-main-card">
        <p>Normalde cebimde olması gereken para</p>
        <h2>{money(summary.normalPocketMoney)}</h2>

        <div className="asset-lines">
          <span>Gelirlerim: {money(incomeTotal)}</span>
          <span>Borçlarım: {money(summary.realDebtRemaining)}</span>
          <span>TR’deki Para: {money(summary.totalTurkeyMoney, "TRY")}</span>
        </div>
      </div>

      <div className="helper-card">
        <p>
          Emanet Para bu hesaba katılmaz. TR’deki Para ayrı gösterilir. Altın ve
          kişi bazlı varlıklar ayrıca takip edilir.
        </p>
      </div>

      {debtTargets.length > 0 && (
        <div className="records">
          <h2>Borçlardan Düşülenler</h2>

          {debtTargets.map((item) => (
            <div className="record" key={item.name}>
              <div>
                <h3>{item.name}</h3>
                <p>Kalan borç</p>
              </div>

              <strong>{money(item.remaining)}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="records">
        <div className="section-head">
          <h2>Kişiler</h2>
          <button onClick={() => setPage("addPerson")}>+ Kişi</button>
        </div>

        {persons.length === 0 && (
          <p className="subtitle">
            Henüz kişi yok. Mesela Annem diye kişi ekleyip ona TL, dolar veya
            altın ekleyebilirsin.
          </p>
        )}

        {persons.map((person) => {
          const s = personAssetSummary(person);

          return (
            <div
              key={person.id}
              className="record"
              onClick={() => openPerson(person)}
            >
              <div>
                <h3>{person.name}</h3>
                <p>
                  {money(s.usd, "USD")} • {money(s.try, "TRY")} • Altınlar
                </p>
              </div>

              <strong>→</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AssetsPage;