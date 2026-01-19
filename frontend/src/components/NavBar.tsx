import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const navigate = useNavigate();
  const {cart}=useCart();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🍴 FoodApp</Link>
      </div>
      <ul className="navbar-links">
        {!role && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}

        {role === "CUSTOMER" && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Cart <p className="badge">{cart.length}</p></Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/register">Register User</Link></li>
          </>
        )}
        {username&&<li><b> {username}</b><button onClick={handleLogout} className="logout-btn">Logout</button></li>}
      </ul>
    </nav>
  );
}
