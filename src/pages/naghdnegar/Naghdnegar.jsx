import { useState, useRef, useEffect } from "react";
import styles from "./Naghdnegar.module.css"
import Art from "../../assets/images/Arthur.jpg"
import sample1 from "../../assets/images/mobile_samples/sample2.jpeg"

/* ---------------------------------- SVG COMPONENTS --------------------------------- */
import { ReactComponent as CommentsIcon } from "../../assets/icons/PostImages/Coments.svg"
import { ReactComponent as ViewsIcon } from "../../assets/icons/PostImages/Views.svg"
import { ReactComponent as ThreeDotsIcon } from "../../assets/icons/PostImages/Threedots.svg"
import { ReactComponent as SavesIcon } from "../../assets/icons/PostImages/Saves.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/PostImages/Share.svg"
import { ReactComponent as LikeIcon } from "../../assets/icons/PostImages/like.svg"
import { ReactComponent as DislikeIcon } from "../../assets/icons/PostImages/dislike.svg"
import { ReactComponent as FilterIcon } from "../../assets/icons/PostImages/Filter.svg"
// import { ReactComponent as ReportIcon } from "../../assets/icons/PostImages/Report.svg" // آیکون گزارش - اگه نداری می‌تونی حذفش کنی
// import { ReactComponent as CopyIcon } from "../../assets/icons/PostImages/Copy.svg" // آیکون کپی - اگه نداری می‌تونی حذفش کنی

import { useNavigate } from "react-router-dom";
import FilterModal from "../../components/FilterModal/FilterModal";

export default function Naghdnegar() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const navigate = useNavigate();

    const [activeStates, setActiveStates] = useState({
        like: false,
        dislike: false,
        save: false,
    });

    // ---------- منوهای تولتیپ ----------
    const [openMenu, setOpenMenu] = useState(null); // null | "dots" | "share"
    const [copied, setCopied] = useState(false);

    const dotsRef = useRef(null);
    const shareRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                dotsRef.current && !dotsRef.current.contains(e.target) &&
                shareRef.current && !shareRef.current.contains(e.target)
            ) {
                setOpenMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = (menuName) => {
        setOpenMenu(prev => (prev === menuName ? null : menuName));
    };

    const handleReport = () => {
        // اینجا منطق ارسال گزارش رو اضافه کن (مثلا یک درخواست API)
        console.log("گزارش پست ارسال شد");
        setOpenMenu(null);
    };

    const handleCopyLink = async () => {
        const postUrl = `${window.location.origin}/post/${1}`; // آیدی واقعی پست رو جایگزین کن
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("کپی نشد:", err);
        }
        setOpenMenu(null);
    };

    const toggleLike = () => {
        setActiveStates(prev => ({
            ...prev,
            like: !prev.like,
            dislike: false,
        }));
    };

    const toggleDislike = () => {
        setActiveStates(prev => ({
            ...prev,
            dislike: !prev.dislike,
            like: false,
        }));
    };

    const toggleSave = () => {
        setActiveStates(prev => ({
            ...prev,
            save: !prev.save,
        }));
    };

    if (!localStorage.getItem("token")) {
        navigate("/register");
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.Filterwrapper}>
                <button className={styles.filterBTN} onClick={() => setIsFilterOpen(true)}>
                    <FilterIcon className={styles.FilterIconsvg} />
                    <p className={styles.filterp}>فیلتر</p>
                </button>

                <FilterModal
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    products={[
                        { id: 1, name: "محصول نمونه", price: "۱۲۰,۰۰۰ تومان", image: sample1 },
                    ]}
                    onSelectProduct={(p) => console.log("انتخاب شد:", p)}
                    onApply={(term) => console.log("جستجوی نهایی:", term)}
                />
            </div>

            <div className={styles.UserPost}>
                <div className={styles.PostHeader}>
                    <div className={styles.HeaderInfo}>
                        <img className={styles.pictureProfile} src={Art} alt="" />
                        <p className={styles.Name}>Arthur MacWaters</p>
                        <p className={styles.Handle}>@ArthurMacwaters</p>
                        <span className={styles.Dot}>·</span>
                        <p className={styles.Date}>Jul 28</p>
                    </div>

                    {/* -------- دکمه سه‌نقطه + منو -------- */}
                    <div className={styles.MenuWrapper} ref={dotsRef}>
                        <button
                            className={styles.ThreeDots}
                            onClick={() => toggleMenu("dots")}
                        >
                            <ThreeDotsIcon />
                        </button>

                        {openMenu === "dots" && (
                            <div className={styles.TooltipMenu}>
                                <button className={styles.TooltipItem} onClick={handleReport}>
                                    {/* <ReportIcon className={styles.TooltipIcon} /> */}
                                    <span>گزارش پست</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.PostContentWrapper}>
                    <p>I met with the team of the Lockheed Martin defense company – one of the strongest enterprises in the United States, with which we have been cooperating for a long time. Lockheed Martin is the company that produces ATACMS, HIMARS, F-16s, and missiles for Patriot systems.</p>
                </div>

                <div className={styles.PostImgWrapper}>
                    <img className={styles.PostImg} src={sample1} alt="" />
                </div>

                <div className={styles.PostStats}>
                    <div className={styles.LeftSide}>
                        <button
                            className={`${styles.SavesWrapper} ${activeStates.save ? styles.Active : ""}`}
                            onClick={toggleSave}
                        >
                            <SavesIcon />
                            <p>571</p>
                        </button>

                        <button
                            className={`${styles.LikesWrapper} ${activeStates.like ? styles.Active : ""}`}
                            onClick={toggleLike}
                        >
                            <LikeIcon />
                            <p>4.7K</p>
                        </button>

                        <button
                            className={`${styles.DislikeWrapper} ${activeStates.dislike ? styles.Active : ""}`}
                            onClick={toggleDislike}
                        >
                            <DislikeIcon />
                            <p>4.7K</p>
                        </button>

                        <button className={styles.ComentsWrapper}>
                            <CommentsIcon />
                            <p>307</p>
                        </button>

                        <button className={styles.ViewsWrapper}>
                            <ViewsIcon />
                            <p>417K</p>
                        </button>
                    </div>

                    <div className={styles.RightSide}>
                        {/* -------- دکمه شیر + منو -------- */}
                        <div className={styles.MenuWrapper} ref={shareRef}>
                            <button
                                className={styles.SharesWrapper}
                                onClick={() => toggleMenu("share")}
                            >
                                <ShareIcon />
                            </button>

                            {openMenu === "share" && (
                                <div className={`${styles.TooltipMenu} ${styles.TooltipMenuLeft}`}>
                                    <button className={styles.TooltipItem} onClick={handleCopyLink}>
                                        {/* <CopyIcon className={styles.TooltipIcon} /> */}
                                        <span>{copied ? "کپی شد!" : "کپی کردن لینک"}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}