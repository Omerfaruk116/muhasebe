import { money } from "../utils/money";

function BalanceCard({
  netBalance,
  remaining,
  mustPay,
  normalPocketMoney,
  turkeyMoney,
}) {
  return (
    <div className="balance-box">
      <p>Net Bakiye</p>
      <h2>{money(netBalance)}</h2>

      <div className="balance-lines">
        <span>Kalan Alacak: {money(remaining)}</span>
        <span>Ödenmesi Gereken: {money(mustPay)}</span>
        <span>Varlıklarım: {money(normalPocketMoney)}</span>
        <span>TR’deki Para: {money(turkeyMoney, "TRY")}</span>
      </div>
    </div>
  );
}

export default BalanceCard;