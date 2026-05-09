import { useState } from "react";
import styles from "./navbar.module.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 1, navLink: "Home", route: "/" },
    { id: 2, navLink: "About Us", route: "/about" },
    { id: 3, navLink: "Our Contact", route: "/contact" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <h1>Logo</h1>
          </div>

          {/* Hamburger Icon */}
          <button className={styles.hamburger} onClick={toggleMenu}>
            <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></span>
            <span style={{ opacity: isOpen ? 0 : 1 }}></span>
            <span style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
          </button>

          <div className={`${styles.navContent} ${isOpen ? styles.active : ""}`}>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li className={styles.navItem} key={item.id}>
                  <a href={item.route} onClick={() => setIsOpen(false)}>
                    {item.navLink}
                  </a>
                </li>
              ))}
            </ul>
            <button className={styles.btn}>Login</button>
          </div>
        </div>
      </nav>

      {isOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </>
  );
}

export default Navbar;