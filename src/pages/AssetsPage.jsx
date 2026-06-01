import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { assetLabels, getSummary, money } from "../utils/calculations";

function normalizeAssetType(type) {
  const clean = String(type || "").toLowerCase();

  if (clean === "usd" || clean === "dolar" || clean === "dollar") return "dollar";
  if (clean === "try" || clean === "tl" || clean === "türk lirası") return "tl";
  if (clean.includes("quarter") || clean.includes("çeyrek")) return "quarterGold";
  if (clean.includes("gram")) return "gramGold";
  if (clean.includes("bilezik")) return "bracelet";
  if (clean.includes("other") || clean.includes("diğer")) return "otherGold";

  return type || "dollar";
}

function getAssetAmount(asset) {
  if (asset.amount !== undefined) return Number(asset.amount || 0);
  if (asset.quantity !== undefined) return Number(asset.quantity || 0);
  return 0;
}

function getPersonTotals(person) {
  const totals = {
    dollar: 0,
    tl: 0,
    quarterGold: 0,
    gramGold: 0,
    bracelet: 0,
    otherGold: 0,
  };

  (person.assets || []).forEach((asset) => {
    const type = normalizeAssetType(asset.type || asset.kind);
    totals[type] += getAssetAmount(asset);
  });

  return totals;
}

function getAllPersonTotals(persons) {
  return persons.reduce(
    (total, person) => {
      const p = getPersonTotals(person);

      return {
        dollar: total.dollar + p.dollar,
        tl: total.tl + p.tl,
        quarterGold: total.quarterGold + p.quarterGold,
        gramGold: total.gramGold + p.gramGold,
        bracelet: total.bracelet + p.bracelet,
        otherGold: total.otherGold + p.otherGold,
      };
    },
    {
      dollar: 0,
      tl: 0,
      quarterGold: 0,
      gramGold: 0,
      bracelet: 0,
      otherGold: 0,
    }
  );
}

function formatDateTime(date) {
  if (!date) return "Bilinmiyor";

  return new Date(date).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AssetsPage({ account, goBack, updateAccountPersons }) {
  const records = account.records || [];
  const persons = account.persons || [];

  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [addingPerson, setAddingPerson] = useState(false);
  const [addingAsset, setAddingAsset] = useState(false);

  const [personName, setPersonName] = useState("");
  const [assetTitle, setAssetTitle] = useState("");
  const [assetType, setAssetType] = useState("dollar");
  const [assetAmount, setAssetAmount] = useState("");
  const [assetDate, setAssetDate] = useState(new Date().toISOString().slice(0, 10));

  const [rates, setRates] = useState(() => {
    const saved = localStorage.getItem("kolayMuhasebeRates");
    return saved
      ? JSON.parse(saved)
      : {
          usdTry: 0,
          gramGoldTry: 0,
          quarterGoldTry: 0,
          updatedAt: null,
          source: "Henüz alınmadı",
        };
  });

  const [rateWarning, setRateWarning] = useState("");

  const summary = getSummary(records);

  const allTotals = useMemo(() => {
    return getAllPersonTotals(persons);
  }, [persons]);

  const selectedPerson = persons.find((person) => person.id === selectedPersonId);
  const selectedTotals = selectedPerson ? getPersonTotals(selectedPerson) : null;

  const goldTry =
    allTotals.gramGold * rates.gramGoldTry +
    allTotals.quarterGold * rates.quarterGoldTry +
    allTotals.bracelet * rates.gramGoldTry +
    allTotals.otherGold * rates.gramGoldTry;

  const tlAsUsd = rates.usdTry ? allTotals.tl / rates.usdTry : 0;
  const goldAsUsd = rates.usdTry ? goldTry / rates.usdTry : 0;

  const estimatedTotalUsd =
    summary.incomeExpected +
    allTotals.dollar +
    tlAsUsd +
    goldAsUsd -
    summary.mustPay;

  useEffect(() => {
    async function fetchRates() {
      try {
        setRateWarning("");

        const usdResponse = await fetch("https://open.er-api.com/v6/latest/USD");
        const usdData = await usdResponse.json();
        const usdTry = Number(usdData?.rates?.TRY || 0);

        let gramGoldTry = 0;

        try {
          const goldResponse = await fetch("https://api.gold-api.com/price/XAU");
          const goldData = await goldResponse.json();
          const ounceUsd = Number(goldData?.price || 0);

          if (ounceUsd && usdTry) {
            gramGoldTry = (ounceUsd / 31.1035) * usdTry;
          }
        } catch {
          gramGoldTry = Number(rates.gramGoldTry || 0);
        }

        const nextRates = {
          usdTry,
          gramGoldTry,
          quarterGoldTry: gramGoldTry * 1.75,
          updatedAt: new Date().toISOString(),
          source: "Anlık piyasa verisi",
        };

        if (!usdTry) {
          throw new Error("Kur alınamadı");
        }

        setRates(nextRates);
        localStorage.setItem("kolayMuhasebeRates", JSON.stringify(nextRates));

        if (!gramGoldTry) {
          setRateWarning("Altın kuru alınamadı, varsa son kayıtlı kur kullanıldı.");
        }
      } catch {
        setRateWarning("Kur alınamadı, son kayıtlı kurla hesaplandı.");
      }
    }

    fetchRates();
  }, []);

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
    setAddingPerson(false);
  }

  function addAsset() {
    if (!selectedPerson) return;
    if (!assetTitle.trim()) return;
    if (!assetAmount) return;

    const newAsset = {
      id: Date.now(),
      title: assetTitle.trim(),
      type: assetType,
      amount: Number(assetAmount),
      date: assetDate,
    };

    const nextPersons = persons.map((person) =>
      person.id === selectedPerson.id
        ? {
            ...person,
            assets: [newAsset, ...(person.assets || [])],
          }
        : person
    );

    savePersons(nextPersons);

    setAssetTitle("");
    setAssetType("dollar");
    setAssetAmount("");
    setAssetDate(new Date().toISOString().slice(0, 10));
    setAddingAsset(false);
  }

  function removeAsset(assetId) {
    if (!selectedPerson) return;

    const ok = window.confirm("Bu varlık geri alındı / silinsin mi?");
    if (!ok) return;

    const nextPersons = persons.map((person) =>
      person.id === selectedPerson.id
        ? {
            ...person,
            assets: (person.assets || []).filter((asset) => asset.id !== assetId),
          }
        : person
    );

    savePersons(nextPersons);
  }

  if (selectedPerson) {
    return (
      <div className="app">
        <Header title={selectedPerson.name} back={() => setSelectedPersonId(null)} />

        <div className="asset-overview-card">
          <h2>{selectedPerson.name} Varlıkları</h2>

          <div className="asset-mini-grid">
            <div>
              Dolar
              <b>{money(selectedTotals.dollar)}</b>
            </div>

            <div>
              Türk Lirası
              <b>{money(selectedTotals.tl, "TRY")}</b>
            </div>

            <div>
              Çeyrek Altın
              <b>{selectedTotals.quarterGold}</b>
            </div>

            <div>
              Gram Altın
              <b>{selectedTotals.gramGold}</b>
            </div>

            <div>
              Bilezik
              <b>{selectedTotals.bracelet}</b>
            </div>

            <div>
              Diğer Altın
              <b>{selectedTotals.otherGold}</b>
            </div>
          </div>
        </div>

        <div className="home-actions">
          <button onClick={() => setAddingAsset(true)}>Varlık Ekle</button>
          <button onClick={() => setSelectedPersonId(null)}>Kişilere Dön</button>
        </div>

        {addingAsset && (
          <div className="form-card">
            <input
              placeholder="Varlık adı: Kamera, para, altın..."
              value={assetTitle}
              onChange={(e) => setAssetTitle(e.target.value)}
            />

            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
            >
              <option value="dollar">Dolar</option>
              <option value="tl">Türk Lirası</option>
              <option value="quarterGold">Çeyrek Altın</option>
              <option value="gramGold">Gram Altın</option>
              <option value="bracelet">Bilezik</option>
              <option value="otherGold">Diğer Altın</option>
            </select>

            <input
              type="number"
              placeholder="Tutar / adet"
              value={assetAmount}
              onChange={(e) => setAssetAmount(e.target.value)}
            />

            <input
              type="date"
              value={assetDate}
              onChange={(e) => setAssetDate(e.target.value)}
            />

            <button onClick={addAsset}>Kaydet</button>

            <button
              className="danger-mini-button"
              onClick={() => setAddingAsset(false)}
            >
              Vazgeç
            </button>
          </div>
        )}

        <div className="records">
          <h2>Liste</h2>

          {(selectedPerson.assets || []).length === 0 && (
            <p className="subtitle">Bu kişide kayıtlı varlık yok.</p>
          )}

          {(selectedPerson.assets || []).map((asset) => {
            const type = normalizeAssetType(asset.type || asset.kind);
            const value = getAssetAmount(asset);
            const isMoney = type === "dollar" || type === "tl";

            return (
              <div className="record edit-record" key={asset.id}>
                <div>
                  <h3>{asset.title}</h3>
                  <p>{assetLabels[type]} • {asset.date}</p>

                  <button
                    className="danger-mini-button"
                    onClick={() => removeAsset(asset.id)}
                  >
                    Geri Aldım / Sil
                  </button>
                </div>

                <strong>
                  {isMoney
                    ? money(value, type === "tl" ? "TRY" : "USD")
                    : value}
                </strong>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header title="Varlıklarım" back={goBack} />

      <div className="asset-main-card">
        <p>Tahmini Toplam Varlıklarım</p>
        <h2>{money(estimatedTotalUsd)}</h2>

        <div className="asset-mini-grid">
          <div>
            Dolar
            <b>{money(allTotals.dollar)}</b>
          </div>

          <div>
            Türk Lirası
            <b>{money(allTotals.tl, "TRY")}</b>
          </div>

          <div>
            Çeyrek Altın
            <b>{allTotals.quarterGold}</b>
          </div>

          <div>
            Gram Altın
            <b>{allTotals.gramGold}</b>
          </div>

          <div>
            Bilezik
            <b>{allTotals.bracelet}</b>
          </div>

          <div>
            Diğer Altın
            <b>{allTotals.otherGold}</b>
          </div>
        </div>

        <div className="asset-lines" style={{ marginTop: "12px" }}>
          <span>Gelirlerim: {money(summary.incomeExpected)}</span>
          <span>Borçlarım: {money(summary.mustPay)}</span>
          <span>USD/TRY: {rates.usdTry ? rates.usdTry.toFixed(2) : "Yok"}</span>
          <span>
            Gram Altın:{" "}
            {rates.gramGoldTry ? money(rates.gramGoldTry, "TRY") : "Yok"}
          </span>
        </div>
      </div>

      <div className="helper-card">
        <p>
          Son güncelleme: {formatDateTime(rates.updatedAt)} • İnternet yoksa son
          kayıtlı kur kullanılır. {rateWarning}
        </p>
      </div>

      <div className="section-head">
        <h2>Kişiler</h2>
        <button onClick={() => setAddingPerson(true)}>+ Kişi</button>
      </div>

      {addingPerson && (
        <div className="form-card">
          <input
            placeholder="Kişi adı: Annem, Soner..."
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
          />

          <button onClick={addPerson}>Kişiyi Kaydet</button>

          <button
            className="danger-mini-button"
            onClick={() => setAddingPerson(false)}
          >
            Vazgeç
          </button>
        </div>
      )}

      <div className="records">
        {persons.length === 0 && <p className="subtitle">Henüz kişi yok.</p>}

        {persons.map((person) => {
          const totals = getPersonTotals(person);
          const goldTotal =
            totals.quarterGold +
            totals.gramGold +
            totals.bracelet +
            totals.otherGold;

          return (
            <div
              className="record"
              key={person.id}
              onClick={() => setSelectedPersonId(person.id)}
            >
              <div>
                <h3>{person.name}</h3>
                <p>
                  {money(totals.dollar)} • {money(totals.tl, "TRY")} • Altınlar:{" "}
                  {goldTotal}
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