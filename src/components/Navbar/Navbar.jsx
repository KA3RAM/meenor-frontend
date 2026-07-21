import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>

            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    `${styles.profile} ${isActive ? styles.active : styles.link}`
                }
            >
                پروفایل
            </NavLink>

            <div className={styles.links}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    خانه
                </NavLink>

                <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    ارتباط با ما
                </NavLink>

                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    درباره ما
                </NavLink>
            </div>

        </nav>
    );
}