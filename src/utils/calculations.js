export const labels = {
  fixedIncome: "Sabit Gelir",
  extraIncome: "Ekstra Gelir",
  fixedExpense: "Sabit Gider",
  received: "Aldım",
  payment: "Ödeme",
  debt: "Borç",
  borrowed: "Emanet Para",
  turkeyMoney: "TR’deki Para",
};

export const assetLabels = {
  try: "Türk Lirası",
  usd: "Dolar",
  quarterGold: "Çeyrek Altın",
  gramGold: "Gram Altın",
  bracelet: "Bilezik",
  otherGold: "Diğer Altın",
  otherAsset: "Diğer Varlık",
};

export function totalByType(records, type) {
  return records
    .filter((item) => item.type === type)
    .reduce((sum, item) => sum + Number(item.amount), 0);
}

export function groupByTitle(records, types) {
  const groups = {};

  records
    .filter((item) => types.includes(item.type))
    .forEach((item) => {
      const name = item.title || "İsimsiz";

      if (!groups[name]) {
        groups[name] = {
          name,
          total: 0,
          type: item.type,
        };
      }

      groups[name].total += Number(item.amount);
    });

  return Object.values(groups);
}

export function getReceiveTargets(records) {
  const sources = groupByTitle(records, ["fixedIncome", "extraIncome"]);

  return sources.map((source) => {
    const received = records
      .filter(
        (item) =>
          item.type === "received" && item.receiveTarget === source.name
      )
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      ...source,
      received,
      remaining: Math.max(source.total - received, 0),
    };
  });
}

export function getPaymentTargets(records, includeBorrowed = true) {
  const types = includeBorrowed
    ? ["fixedExpense", "debt", "borrowed"]
    : ["fixedExpense", "debt"];

  const targets = groupByTitle(records, types);

  return targets.map((target) => {
    const paid = records
      .filter(
        (item) =>
          item.type === "payment" && item.paymentTarget === target.name
      )
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      ...target,
      paid,
      remaining: Math.max(target.total - paid, 0),
    };
  });
}

export function getBorrowedPeople(records) {
  const people = records
    .filter((item) => item.type === "borrowed")
    .map((item) => item.title);

  return [...new Set(people)];
}

export function getBorrowedRemaining(records, person) {
  const borrowedTotal = records
    .filter((item) => item.type === "borrowed" && item.title === person)
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const paidBackTotal = records
    .filter(
      (item) => item.type === "payment" && item.paymentTarget === person
    )
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return Math.max(borrowedTotal - paidBackTotal, 0);
}

export function getPersonAssetsSummary(persons = []) {
  const summary = {
    usd: 0,
    try: 0,
    quarterGold: 0,
    gramGold: 0,
    bracelet: 0,
    otherGold: 0,
    otherAsset: 0,
  };

  persons.forEach((person) => {
    (person.assets || []).forEach((asset) => {
      if (asset.kind === "usd") {
        summary.usd += Number(asset.amount || 0);
      } else if (asset.kind === "try") {
        summary.try += Number(asset.amount || 0);
      } else {
        summary[asset.kind] += Number(asset.quantity || 0);
      }
    });
  });

  return summary;
}

export function getSummary(records, persons = []) {
  const totalFixedIncome = totalByType(records, "fixedIncome");
  const totalExtraIncome = totalByType(records, "extraIncome");
  const totalFixedExpense = totalByType(records, "fixedExpense");
  const totalReceived = totalByType(records, "received");
  const totalPayment = totalByType(records, "payment");
  const totalDebt = totalByType(records, "debt");
  const totalBorrowed = totalByType(records, "borrowed");
  const totalTurkeyMoney = totalByType(records, "turkeyMoney");

  const incomeExpected = totalFixedIncome + totalExtraIncome;
  const remaining = Math.max(incomeExpected - totalReceived, 0);

  const paymentTargetsWithBorrowed = getPaymentTargets(records, true);
  const mustPay = paymentTargetsWithBorrowed.reduce(
    (sum, item) => sum + Number(item.remaining),
    0
  );

  const paymentTargetsWithoutBorrowed = getPaymentTargets(records, false);
  const realDebtRemaining = paymentTargetsWithoutBorrowed.reduce(
    (sum, item) => sum + Number(item.remaining),
    0
  );

  const normalPocketMoney = incomeExpected - realDebtRemaining;
  const netBalance = totalReceived - totalPayment;

  const personAssets = getPersonAssetsSummary(persons);

  return {
    totalFixedIncome,
    totalExtraIncome,
    totalFixedExpense,
    totalReceived,
    totalPayment,
    totalDebt,
    totalBorrowed,
    totalTurkeyMoney,
    incomeExpected,
    remaining,
    mustPay,
    realDebtRemaining,
    normalPocketMoney,
    netBalance,
    personAssets,
  };
}