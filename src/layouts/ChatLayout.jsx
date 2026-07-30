// ChatLayout.jsx (updated)
import { Outlet } from "react-router-dom";
import styles from "./ChatLayout.module.css";
import { NavLink} from "react-router-dom";
import { useState } from "react";
import lock from "../assets/images/Lock.jpg";
import NewPostModal from "../components/NewPostModal/NewPostModal";
/* ---------------------------------- icons --------------------------------- */
import Home from "../assets/icons/Sidebar/home.svg";
import Search from "../assets/icons/Sidebar/search.svg";
import Saves from "../assets/icons/Sidebar/saves.svg";
import Ai from "../assets/icons/Sidebar/ai.svg";
import Contact from "../assets/icons/Sidebar/contact.svg";
import AboutUs from "../assets/icons/Sidebar/about-us.svg";
import Naghdnegar from "../assets/icons/Sidebar/nn.svg"; 
import Likes from "../assets/icons/Sidebar/likes.svg"

export default function ChatLayout() {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    function handleCreatePost({ text, image, topic }) {
        // اینجا درخواست به API رو بزن
        console.log({ text, image, topic });
    }
    const navLinks = [
        { to: "/", label: "خانه", icon: Home },
        { to: "/search", label: "جست و جو", icon: Search },
        { to: "/likes", label: "لایک‌ها", icon: Likes },
        { to: "/bookmarks", label: "ذخیره‌ها", icon: Saves },
        { to: "/chat", label: "هوش مصنوعی", icon: Ai },
        { to: "/contact", label: "ارتباط با ما", icon: Contact },
        { to: "/about", label: "درباره ما", icon: AboutUs },
        { to: "/naghdnegar", label: "نقد نگار", icon: Naghdnegar },
    ];

    return (
        <div className={styles.BlackWrapper}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <span>نقد‌نگار</span>
                </div>

                <div className={styles.links}>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                isActive ? styles.active : styles.link
                            }
                        >
                            <img 
                                src={link.icon} 
                                alt={link.label} 
                                className={styles.icon}
                            />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </div>

                <button className={styles.SendPostButton}
                    onClick={() => setIsPostModalOpen(true)}>
                    + پست جدید
                </button>

                <div className={styles.ButtomWrapper}>
                    <div className={styles.ButtomProfileCard}>
                        <img className={styles.ProfileCard} src={lock} alt="profile" />
                    </div>
                    <div className={styles.AccInfoBox}>
                        <p className={styles.username}>کسری آقایاری</p>
                        <p className={styles.handle}>@KA3RAM</p>
                    </div>
                </div>
            </aside>

            <div className={styles.MainContent}>
                <Outlet />
            </div>

            <NewPostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onSubmit={handleCreatePost}
            />
        </div>
    );
}