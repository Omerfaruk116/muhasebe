import { money } from "../utils/money";

function BalanceCard({ netBalance, remaining, mustPay, totalAssets }) {
  return (
    <div className="balance-box">
      <p>Net Bakiye</p>
      <h2>{money(netBalance)}</h2>

      <div className="balance-lines">
        <span>Kalan Alacak: {money(remaining)}</span>
        <span>Ödenmesi Gereken: {money(mustPay)}</span>
        <span>Varlıklarım: {money(totalAssets)}</span>
      </div>
    </div>
  );
}

export default BalanceCard;