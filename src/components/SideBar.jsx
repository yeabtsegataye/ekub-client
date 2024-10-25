import { Link } from "react-router-dom";
import { useState } from "react";

const SideBar = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const sidebarConfig = [
    {
      title: "አባላት",
      iconClass: "gd-user",
      items: [
        { name: "ሙሉ አባላት", link: "/Users" },
        { name: "አዲስ ሰው አስገባ", link: "/adduser" },
      ],
    },
    {
      title: "ማስታወሻ",
      iconClass: "gd-book",
      items: [{ name: "ያለፉ እቁቦች", link: "/history" }],
    },
    {
      title: "የግል መረጃ",
      iconClass: "gd-settings",
      items: [{ name: "ለመቀየር", link: "/setting" }],
    },
  ];

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <aside
      id="sidebar"
      className="js-custom-scroll side-nav mCustomScrollbar _mCS_1 mCS-autoHide mCS_no_scrollbar"
    >
      <ul id="sideNav" className="side-nav-menu side-nav-menu-top-level mb-0">
        <li className="sidebar-heading h6">ጋሞ እቁብ</li>

        <li className="side-nav-menu-item active">
          <Link className="side-nav-menu-link media align-items-center" to="/">
            <span className="side-nav-menu-icon d-flex mr-3">
              <i className="gd-dashboard"></i>
            </span>
            <span className="side-nav-fadeout-on-closed media-body">
              የእቁብ አይነቶች
            </span>
          </Link>
        </li>
        <li className="side-nav-menu-item ">
          <Link className="side-nav-menu-link media align-items-center" to="/newekub">
            <span className="side-nav-menu-icon d-flex mr-3">
              <i className="gd-pin"></i>
            </span>
            <span className="side-nav-fadeout-on-closed media-body">
             አዲስ እቁብ
            </span>
          </Link>
        </li>

        <li className="sidebar-heading h6">መቆጣጠሪያ</li>

        {/* Accordion Sections */}
        {sidebarConfig.map((section, index) => (
          <div key={index} className="accordion-section">
            <header
              onClick={() => handleAccordionClick(index)}
              className="accordion-header cursor-pointer d-flex align-items-center"
              aria-expanded={activeIndex === index}
              aria-controls={`accordion-${index}`}
            >
              <span className="side-nav-menu-icon d-flex mr-3">
                <i className={section.iconClass}></i>
              </span>
              <span className="side-nav-fadeout-on-closed media-body">
                {section.title}
              </span>
              <span className="side-nav-control-icon d-flex ml-auto">
                {/* Conditionally show/hide the arrow icons */}
                {activeIndex === index ? (
                  <i className="gd-angle-up icon-text"></i> // Up arrow when expanded
                ) : (
                  <i className="gd-angle-down icon-text"></i> // Down arrow when collapsed
                )}
              </span>
            </header>

            <div
              id={`accordion-${index}`}
              className={`accordion-collapse ${
                activeIndex === index ? "block" : "hidden"
              }`}
            >
              <ul className="side-nav-menu side-nav-menu-second-level mb-0">
                {section.items.map((item, idx) => (
                  <li
                    className="side-nav-menu-item py-1 text-sm"
                    key={idx}
                  >
                    <Link className="side-nav-menu-link" to={item.link}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
