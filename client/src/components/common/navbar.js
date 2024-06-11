import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Logo from "../../images/laptop.png";
import { useOutsideClick } from "../../utilities/utilities";
import Avatar from "../../images/default_avatar.jpg";
import "../../css/navbar.css";

const Navbar = ({ userData }) => {
  const [auth, setAuth] = useState(null);
  const location = useLocation();
  const [profileDropdownClicked, setProfileDropdownClicked] = useState(false);

  useEffect(() => {
    if (userData) {
      setAuth(userData);
    } else {
      setAuth(undefined);
    }
  }, [userData]);

  useEffect(() => {
    const pageRefresh = (event) => {
      if (event.key === "isLoggedIn") {
        window.location.reload(true);
      }
    };
    window.addEventListener("storage", pageRefresh);
    return () => window.removeEventListener("storage", pageRefresh);
  }, [auth]);

  const dropdown = useOutsideClick(() => {
    if (profileDropdownClicked) {
      setProfileDropdownClicked(false);
    }
  });

  const logout = async (event) => {
    localStorage.removeItem("isLoggedIn");
    Cookies.remove("token");
    window.location.reload(true);
  };
  return (
    <div className="navbar">
      <div className="page">
        <Link to="/">
          <img src={Logo} alt="" height={50} width={50} />
        </Link>
        <h1>
          TECH<span>TYPO</span>
        </h1>
        {auth ? (
          <button
            className="site-header__user-profile-icon"
            onClick={() => {
              setProfileDropdownClicked(!profileDropdownClicked);
            }}
          >
            {userData.name[0].toUpperCase()}
          </button>
        ) : auth === undefined ? (
          <Link
            to={`/login?destination=${location.pathname}`}
            className="navbar_login-btn"
          >
            <div>Login</div>
          </Link>
        ) : (
          <span></span>
        )}
        {profileDropdownClicked && (
          <div className="site-header__dropdown-profile" ref={dropdown}>
            <div>
              <img src={Avatar} alt="" />
              <div>
                {" "}
                <h3>{userData.name}</h3>
                <Link to={`/profile`}>View Profile</Link>
              </div>
            </div>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
