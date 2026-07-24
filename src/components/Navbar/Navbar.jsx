import {NavLink, useNavigate} from "react-router-dom";
import styles from "./Navbar.module.css";
import {useState} from "react";

export default function Navbar() {

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || "";
    });

    return (
        <nav className={styles.navbar}>

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

            
            <NavLink
                to={token.length > 1 ? "/profile" : "/register"}
                className={({ isActive }) =>
                    `${styles.profile} ${isActive ? styles.active : styles.link}`
                }

            >
                {token.length > 1 ? "پروفایل کاربری" : "ورود/ثبت نام"  }
            </NavLink>


        </nav>
    );
}