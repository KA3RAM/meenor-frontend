// ChatLayout.jsx (updated)
import {Outlet, useNavigate} from "react-router-dom";
import styles from "./ChatLayout.module.css";
import { NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import NewPostModal from "../components/NewPostModal/NewPostModal";
/* ---------------------------------- icons --------------------------------- */
import Home from "../assets/icons/Sidebar/home.svg";
import Search from "../assets/icons/Sidebar/search.svg";
import Saves from "../assets/icons/Sidebar/saves.svg";
import Ai from "../assets/icons/Sidebar/ai.svg";
import Contact from "../assets/icons/Sidebar/contact.svg";
import AboutUs from "../assets/icons/Sidebar/about-us.svg";
import Naghdnegar from "../assets/icons/Sidebar/nn.svg"; 
import Likes from "../assets/icons/Sidebar/Likes.svg"
import ChatSvg from "../assets/icons/Sidebar/chat.svg"
import {user_profile} from "../services/Axios";
import { label } from "framer-motion/client";

export default function ChatLayout() {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    function handleCreatePost({ text, image, topic }) {
        // اینجا درخواست به API رو بزن
        console.log({ text, image, topic });
    }
    const navLinks = [
        { to: "/", label: "خانه", icon: Home },
        { to: "/search", label: "جست و جو", icon: Search },
        { to: "/chat", label: " مقایسه با هوش مصنوعی", icon: Ai },
        { to: "/naghdnegar", label: "نقد نگار", icon: ChatSvg },
        { to: "/bookmarks", label: "ذخیره‌ها", icon: Saves },
        { to: "/ManagePost", label: "مدیریت پست ها", icon: Naghdnegar},
        { to: "/profile", label: "علاقه مندی ها", icon: Likes },
        { to: "/contact", label: "ارتباط با ما", icon: Contact },
        { to: "/about", label: "درباره ما", icon: AboutUs },
        
    ];
    const [userProfile, setUserProfile] = useState({});

    function DefaultUserIcon() {
        return (
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#faf9f9" style={{width: "24px", height: "24px"}}>
                    <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#ffffff"></path>
                    <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#ffffff"></path>
                </svg>
            </div>
        )
    }

    const navigate = useNavigate();
    const goToProfile = () => {
        navigate("/profile");
    }

    useEffect(() => {
        const fetch_get_user_profile_short = async () =>{
            try{

                let {data : data} = await user_profile()
                setUserProfile(data)

            }
            catch(err){
                console.error("STATUS:", err.response?.status);
                console.error("ERROR DATA:", err.response?.data);
                console.error("ERROR:", err);
            }
        }
        fetch_get_user_profile_short()
    }, []);

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

                <div className={styles.ButtomWrapper} onClick={goToProfile}>
                    <div className={styles.ButtomProfileCard}>
                        {userProfile.profile_pic ? (
                            <img
                                className={styles.ProfileCard}
                                src={`http://127.0.0.1:8000${userProfile.profile_pic}`}
                                alt="profile"
                            />
                        ) : (
                            <DefaultUserIcon className={styles.ProfileCard} />
                        )}
                    </div>
                    <div className={styles.AccInfoBox}>
                        <p className={styles.username}>{userProfile.first_name + " " + userProfile.last_name}</p>
                        <p className={styles.handle}>{userProfile.username}</p>
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