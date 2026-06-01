export const labels = {
  fixedIncome: "Sabit Gelir",
  extraIncome: "Ekstra Gelir",
  fixedExpense: "Sabit Gider",
  received: "Aldım",
  payment: "Ödeme",
  debt: "Borç",
  borrowed: "Emanet Para",
};

export const assetLabels = {
  dollar: "Dolar",
  tl: "Türk Lirası",
  quarterGold: "Çeyrek Altın",
  gramGold: "Gram Altın",
  bracelet: "Bilezik",
  otherGold: "Diğer Altın",
};

export function money(amount, currency = "USD") {
  const value = Number(amount || 0);

  if (currency === "TRY") {
    return `₺${value.toLocaleString("tr-TR", {
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

function sumByType(records, type) {
  return records
    .filter((item) => item.type === type)
    .reduce((total, item) => total + Number(item.amount || 0), 0);
}

function normalizeName(name) {
  return String(name || "").trim().toLowerCase();
}

export function getReceiveTargets(records) {
  const incomeRecords = records.filter(
    (item) => item.type === "fixedIncome" || item.type === "extraIncome"
  );

  const receivedRecords = records.filter((item) => item.type === "received");

  const map = {};

  incomeRecords.forEach((item) => {
    const name = item.title;
    if (!name) return;

    const key = normalizeName(name);

    if (!map[key]) {
      map[key] = {
        name,
        expected: 0,
        received: 0,
        remaining: 0,
      };
    }

    map[key].expected += Number(item.amount || 0);
  });

  receivedRecords.forEach((item) => {
    const name = item.receiveTarget || item.title;
    if (!name) return;

    const key = normalizeName(name);

    if (!map[key]) {
      map[key] = {
        name,
        expected: 0,
        received: 0,
        remaining: 0,
      };
    }

    map[key].received += Number(item.amount || 0);
  });

  return Object.values(map)
    .map((item) => ({
      ...item,
      remaining: Math.max(0, item.expected - item.received),
    }))
    .filter((item) => item.remaining > 0);
}

export function getPaymentTargets(records) {
  const debtRecords = records.filter(
    (item) => item.type === "fixedExpense" || item.type === "debt"
  );

  const paymentRecords = records.filter((item) => item.type === "payment");

  const map = {};

  debtRecords.forEach((item) => {
    const name = item.title;
    if (!name) return;

    const key = normalizeName(name);

    if (!map[key]) {
      map[key] = {
        name,
        debt: 0,
        paid: 0,
        remaining: 0,
      };
    }

    map[key].debt += Number(item.amount || 0);
  });

  paymentRecords.forEach((item) => {
    const name = item.paymentTarget || item.title;
    if (!name) return;

    const key = normalizeName(name);

    if (!map[key]) {
      map[key] = {
        name,
        debt: 0,
        paid: 0,
        remaining: 0,
      };
    }

    map[key].paid += Number(item.amount || 0);
  });

  return Object.values(map)
    .map((item) => ({
      ...item,
      remaining: Math.max(0, item.debt - item.paid),
    }))
    .filter((item) => item.remaining > 0);
}

export function getBorrowedPeople(records) {
  const people = records
    .filter((item) => item.type === "borrowed")
    .map((item) => item.title)
    .filter(Boolean);

  return [...new Set(people)];
}

export function getBorrowedRemaining(records, person) {
  const totalBorrowed = records
    .filter((item) => item.type === "borrowed" && item.title === person)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return totalBorrowed;
}

export function getSummary(records) {
  const totalFixedIncome = sumByType(records, "fixedIncome");
  const totalExtraIncome = sumByType(records, "extraIncome");
  const totalReceived = sumByType(records, "received");

  const totalFixedExpense = sumByType(records, "fixedExpense");
  const totalDebt = sumByType(records, "debt");
  const totalBorrowed = sumByType(records, "borrowed");
  const totalPayment = sumByType(records, "payment");

  const incomeExpected = totalFixedIncome + totalExtraIncome;
  const paymentTargets = getPaymentTargets(records);
  const mustPay = paymentTargets.reduce(
    (sum, item) => sum + Number(item.remaining || 0),
    0
  );

  const remaining = Math.max(0, incomeExpected - totalReceived);
  const netBalance = totalReceived - totalPayment;
  const totalRealDebt = totalFixedExpense + totalDebt;

  return {
    totalFixedIncome,
    totalExtraIncome,
    totalReceived,
    totalFixedExpense,
    totalDebt,
    totalBorrowed,
    totalPayment,
    totalRealDebt,
    incomeExpected,
    remaining,
    mustPay,
    netBalance,
  };
}