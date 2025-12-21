import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-badge" aria-hidden="true" />
          <span>What Will You Cook</span>
        </Link>

        <nav className="nav-links">
          <Link className="btn" to="/search">Search</Link>
          <Link className="btn btn-primary" to="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}
