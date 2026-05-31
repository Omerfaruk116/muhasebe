export function money(amount, currency = "USD") {
  const number = Number(amount || 0).toLocaleString("en-US");

  if (currency === "TRY") {
    return `₺${number}`;
  }

  return `$${number}`;
}