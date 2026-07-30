import {NavLink} from "react-router-dom";
import styles from "./Navbar.module.css";
import {useState} from "react";

export default function Navbar() {

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || "";
    });
    const [menuOpen, setMenuOpen] = useState(false);

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <nav className={styles.navbar}>

            <button
                type="button"
                className={styles.menuToggle}
                aria-label="باز و بسته کردن منو"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
            >
                <span className={`${styles.burgerBar} ${menuOpen ? styles.burgerBarOpen1 : ""}`} />
                <span className={`${styles.burgerBar} ${menuOpen ? styles.burgerBarOpen2 : ""}`} />
                <span className={`${styles.burgerBar} ${menuOpen ? styles.burgerBarOpen3 : ""}`} />
            </button>

            <div className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}>
                <NavLink
                    to="/"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    خانه
                </NavLink>

                <NavLink
                    to="/contact"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    ارتباط با ما
                </NavLink>

                <NavLink
                    to="/about"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    درباره ما
                </NavLink>

                <NavLink
                    to={token.length > 1 ? "/profile" : "/register"}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        `${styles.profile} ${isActive ? styles.active : styles.link}`
                    }
                >
                    {token.length > 1 ? "پروفایل کاربری" : "ورود/ثبت نام"}
                </NavLink>
            </div>

        </nav>
    );
}