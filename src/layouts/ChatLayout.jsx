import {Outlet} from "react-router-dom"
import styles from "./ChatLayout.module.css"
import {NavLink, useNavigate} from "react-router-dom";
/* -------------------------------- component ------------------------------- */



import lock from "../assets/images/Lock.jpg"
export default function ChatLayout() {
    return (
        <div className={styles.BlackWrapper}>
            <aside className={styles.sidebar}>


                <div className={styles.links}>
                    <NavLink
                        to="/chat"
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.link
                        }
                    >
                        هوش مصنوعی
                    </NavLink>

   
                    <NavLink
                        to="/naghdnegar"
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.link
                        }
                    >
                        نقد نگار
                    </NavLink>

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


                <button className={styles.SendPostButton}>
                    پست
                </button>
                
                
                
                <div className={styles.ButtomWrapper}>
                    <div className={styles.ButtomProfileCard}>
                        <img className={styles.ProfileCard} src={lock} alt="" />
                    </div>
                    <div className={styles.AccInfoBox}>
                        <p>کسری آقایاری</p>
                        <p>@KA3RAM</p>
                    </div>
                </div>




            </aside>



            <div className={styles.MainContent}>
                <Outlet />
            </div>
        </div>

    )
       
    
}