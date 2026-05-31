function Header({ title, back }) {
  return (
    <div className="top">
      <button onClick={back}>←</button>

      <div>
        <p>Sayfa</p>
        <h1>{title}</h1>
      </div>

      <span></span>
    </div>
  );
}

export default Header;