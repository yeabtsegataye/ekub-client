import React from "react";
import logoMini from "../assets/img/logo-mini.png";
import logo from "../assets/img/logo.png";
import { logOut } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import removeCookie from "../auth/removeCookie";
import Notif_Toast from "./Tost";
import { useToast } from "@chakra-ui/react";
const API = import.meta.env.VITE_API_URL;

// import av from "../assets/img/av.png";
// import SideBar from "./SideBar";

const Header = () => {
  const user = useSelector((state) => state.auth.user);

  const toast = useToast()
  const toggleSidebar = (e) => {
    e.preventDefault();
    const body = document.body;

    if (window.innerWidth > 992) {
      body.classList.toggle("side-nav-closed");
      body.classList.toggle("side-nav-minified");
      // Find all elements with the "sidebar-heading" class
      const sidebarHeadings = document.querySelectorAll(".sidebar-heading");
      sidebarHeadings.forEach((element) => {
        if (element.style.display === "none") {
          element.style.display = "block"; // Show element
        } else {
          element.style.display = "none"; // Hide element
        }
      });
    } else {
      body.classList.toggle("side-nav-minified");
      body.classList.toggle("side-nav-initialized");
    }
  };

  /////////////////
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    removeCookie("refresh_token");

    try {
      // Make the request to the logout endpoint
      const response = await axios.post(
        `${API}/auth/log-out`,
        {},
        {
          withCredentials: true, // Include cookies in the request
        }
      );

      if (response.status === 201) {
        // Dispatch the logOut action to clear the Redux state
        dispatch(logOut());
        Notif_Toast(
          toast,
          "Log out successful",
          "You have successfully logged out",
          "success"
        );
        // Navigate to the login page
        navigate("/Login");
      } else {
        console.error("Failed to log out");
        // Handle the error as needed
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle the error as needed
    }
  };
  return (
    <>
      <header className="header bg-body">
        <nav className="navbar flex-nowrap p-0">
          <div className="navbar-brand-wrapper d-flex align-items-center col-auto me-0">
            {/* Logo For Mobile View */}
            <a className="navbar-brand navbar-brand-mobile" href="/">
              <img
                className="img-fluid w-100"
                src={logoMini}
                alt="Graindashboard"
              />
            </a>
            {/* End Logo For Mobile View */}

            {/* Logo For Desktop View */}
            <a className="navbar-brand navbar-brand-desktop" href="/">
              <img
                className="side-nav-show-on-closed"
                src={logoMini}
                alt="Graindashboard"
                style={{ width: "auto", height: "33px" }}
              />
              <img
                className="side-nav-hide-on-closed"
                src={logo}
                alt="Graindashboard"
                style={{ width: "auto", height: "33px" }}
              />
            </a>
            {/* End Logo For Desktop View */}
          </div>
          <div className="header-content col px-md-3">
            <div className="d-flex align-items-center">
              {/* End Side Nav Toggle */}
              {/* Side Nav Toggle */}
              <a
                className="js-side-nav header-invoker d-flex mr-md-2"
                href=""
                onClick={toggleSidebar}
                id="side_icon"
              >
                <i className="gd-align-left"></i>
              </a>
              {/* User Notifications */}
              <div className="dropdown ml-auto">
                <a
                  id="notificationsInvoker"
                  className="header-invoker dropdown-toggle"
                  href="/"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-toggle="dropdown"
                >
                  <span className="indicator indicator-bordered indicator-top-right indicator-primary rounded-circle"></span>
                  <i className="gd-bell"></i>
                </a>

                <div
                  className="dropdown-menu dropdown-menu-center py-0 mt-4 w-18_75rem w-md-22_5rem"
                  aria-labelledby="notificationsInvoker"
                >
                  <div className="card dropdown-item">
                    <div className="card-header d-flex align-items-center border-bottom py-3">
                      <h5 className="mb-0">Notifications</h5>
                      <a className="link small ml-auto" href="/">
                        Clear All
                      </a>
                    </div>

                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item list-group-item-action">
                          <div className="d-flex align-items-center text-nowrap mb-2">
                            <i className="gd-info-alt icon-text text-primary mr-2"></i>
                            <h6 className="font-weight-semi-bold mb-0">
                              New Update
                            </h6>
                            <span className="list-group-item-date text-muted ml-auto">
                              just now
                            </span>
                          </div>
                          <p className="mb-0">
                            Order <strong>#10000</strong> has been updated.
                          </p>
                          <a
                            className="list-group-item-closer text-muted"
                            href="/"
                          >
                            <i className="gd-close"></i>
                          </a>
                        </div>
                        <div className="list-group-item list-group-item-action">
                          <div className="d-flex align-items-center text-nowrap mb-2">
                            <i className="gd-info-alt icon-text text-primary mr-2"></i>
                            <h6 className="font-weight-semi-bold mb-0">
                              New Update
                            </h6>
                            <span className="list-group-item-date text-muted ml-auto">
                              just now
                            </span>
                          </div>
                          <p className="mb-0">
                            Order <strong>#10001</strong> has been updated.
                          </p>
                          <a
                            className="list-group-item-closer text-muted"
                            href="/"
                          >
                            <i className="gd-close"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End User Notifications */}

              {/* User Avatar */}
              <div className="dropdown mx-3 dropdown ml-2">
                <a
                  id="profileMenuInvoker"
                  className="header-complex-invoker"
                  href="#"
                  aria-controls="profileMenu"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-unfold-event="click"
                  data-unfold-target="#profileMenu"
                  data-unfold-type="css-animation"
                  data-unfold-duration="300"
                  data-unfold-animation-in="fadeIn"
                  data-unfold-animation-out="fadeOut"
                >
                  {/* <img
                    className="avatar rounded-circle mr-md-0"
                    style={{ width: "30px", height: "30px" }}
                    src={av}
                    alt="John Doe"
                  /> */}
                  <i className="gd-user"></i>
                  <div className="dropdown">
                    <a
                      id="dropdownPosition"
                      className="btn dropdown-toggle text-black-60"
                      href="#"
                      aria-haspopup="true"
                      aria-expanded="false"
                      data-toggle="dropdown"
                    >
                      <span className="align-middle">{user ? user.email :"---"}</span>
                      <i className="gd-angle-down icon-text icon-text-xs align-middle ml-3"></i>
                    </a>

                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownPosition"
                    >
                      <a className="dropdown-item" href="setting">
                        <span className="unfold-item-icon mr-3">
                          <i className="gd-user"></i>
                        </span>
                        My Profile
                      </a>
                      <a
                        className="dropdown-item"
                        href=""
                        onClick={(e) => handleLogout(e)}
                      >
                        <span className="unfold-item-icon mr-3">
                          <i className="gd-power-off"></i>
                        </span>
                        Sign Out
                      </a>
                    </div>
                  </div>
                </a>

                <ul
                  id="profileMenu"
                  className="unfold unfold-user unfold-light unfold-top unfold-centered position-absolute pt-2 pb-1 mt-4 unfold-css-animation unfold-hidden fadeOut"
                  aria-labelledby="profileMenuInvoker"
                  style={{ animationDuration: "300ms" }}
                >
                  <li className="unfold-item">
                    <a
                      className="unfold-link d-flex align-items-center text-nowrap"
                      href="/setting"
                    >
                      <span className="unfold-item-icon mr-3">
                        <i className="gd-user"></i>
                      </span>
                      My Profile
                    </a>
                  </li>
                  <li className="unfold-item unfold-item-has-divider">
                    <a
                      className="unfold-link d-flex align-items-center text-nowrap"
                      href=""
                      onClick={(e) => handleLogout(e)}
                    >
                      <span className="unfold-item-icon mr-3">
                        <i className="gd-power-off"></i>
                      </span>
                      Sign Out
                    </a>
                  </li>
                </ul>
              </div>
              {/* End User Avatar */}
            </div>
          </div>
        </nav>
      </header>
      {/* <SideBar isOpen={isSidebarOpen} /> */}
    </>
  );
};

export default Header;
