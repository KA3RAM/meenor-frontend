import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../pages/naghdnegar/Naghdnegar.module.css";
import Art from "../../assets/images/Arthur.jpg";

/* ---------------------------------- SVG COMPONENTS --------------------------------- */
import { ReactComponent as CommentsIcon } from "../../assets/icons/PostImages/Coments.svg";
import { ReactComponent as ViewsIcon } from "../../assets/icons/PostImages/Views.svg";
import { ReactComponent as ThreeDotsIcon } from "../../assets/icons/PostImages/Threedots.svg";
import { ReactComponent as SavesIcon } from "../../assets/icons/PostImages/Saves.svg";
import { ReactComponent as ShareIcon } from "../../assets/icons/PostImages/Share.svg";
import { ReactComponent as LikeIcon } from "../../assets/icons/PostImages/like.svg";
import { ReactComponent as DislikeIcon } from "../../assets/icons/PostImages/dislike.svg";

import { reaction_change_post } from "../../services/Axios";
import { resolveMediaUrl } from "../../utils/resolveMediaUrl";
import { useUserProfile } from "../../utils/useUserProfile";

/* ------------------------------------------------------------------------------ */
/*  PostCard — کارت یه پست تکی، شامل عکس/اسم نویسنده (از useUserProfile)، محتوا،
    عکس پست (در صورت وجود)، الگوریتم لایک/دیسلایک/ذخیره، و هدایت به صفحه‌ی اختصاصیِ
    همون پست با کلیک روی هر جای کارت (به‌جز دکمه‌های تعاملی).

    این کامپوننت مشترکه بین صفحه‌ی نقدنگار (فید/فیلتر) و صفحه‌ی سرچ — دقیقاً همون
    استایل‌های Naghdnegar.module.css رو استفاده می‌کنه تا هیچ فرقی بین رندر پست‌ها
    توی این دو صفحه نباشه.

    نکته‌ی مهم: طبق مستندات API (naghdnegar.xlsx)، خودِ آبجکتی که از feed/ یا
    filter_post/ یا search_post/ برمی‌گرده از قبل شامل user_reaction و
    like_count/dislike_count/comment_count هست — پس نیازی به یه ریکوئست جداگانه‌ی
    get_post برای هر پست نیست؛ همون دیتای اولیه کافیه.                            */
/* ------------------------------------------------------------------------------ */
export default function PostCard({ post }) {
    const navigate = useNavigate();

    const [activeStates, setActiveStates] = useState({
        like: post.user_reaction === "like",
        dislike: post.user_reaction === "dislike",
        save: false, // برای save هیچ endpoint ای توی مستندات فعلی نبود، فعلاً فقط ظاهریه
    });

    const [counts, setCounts] = useState({
        like: post.like_count ?? 0,
        dislike: post.dislike_count ?? 0,
    });

    // پروفایل نویسنده‌ی پست (اسم، username، عکس) — با کش مشترک، پس اگه چند پست
    // از یه نویسنده باشه، فقط یه‌بار ریکوئستش زده می‌شه.
    const author = useUserProfile(post.user);
    const displayName = author
        ? [author.first_name, author.last_name].filter(Boolean).join(" ") ||
          author.username ||
          `کاربر #${post.user}`
        : `کاربر #${post.user}`;
    const avatarSrc = author?.profile_pic ? resolveMediaUrl(author.profile_pic) : Art;

    const postImageUrl = resolveMediaUrl(post.image);

    const [openMenu, setOpenMenu] = useState(null); // null | "dots"
    const [copied, setCopied] = useState(false);

    const dotsRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dotsRef.current && !dotsRef.current.contains(e.target)) {
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

    // مثل توییتر/یوتیوب: با یه کلیک، لینک پست مستقیم توی کلیپ‌بورد کپی می‌شه —
    // بدون هیچ منوی واسطه‌ای.
    const handleShareClick = async (e) => {
        e.stopPropagation(); // که کلیک روی این دکمه باعث نره صفحه‌ی پست باز بشه
        const postUrl = `${window.location.origin}/post/${post.id}`;
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("کپی نشد:", err);
        }
    };

    // هم برای لایک هم دیسلایک استفاده می‌شه؛ طبق مستندات API، بک‌اند خودش «toggle»
    // می‌کنه — یعنی اگه همون واکنش رو دوباره بفرستی، حذفش می‌کنه (نه اینکه ما
    // بخوایم null بفرستیم). ما فقط همیشه kind رو می‌فرستیم.
    const sendReaction = async (kind) => {
        const wasActive = activeStates[kind];
        const opposite = kind === "like" ? "dislike" : "like";
        const wasOppositeActive = activeStates[opposite];

        // آپدیت خوش‌بینانه‌ی UI قبل از جواب سرور
        setActiveStates((prev) => ({ ...prev, [kind]: !wasActive, [opposite]: false }));
        setCounts((prev) => ({
            ...prev,
            [kind]: prev[kind] + (wasActive ? -1 : 1),
            [opposite]: wasOppositeActive ? prev[opposite] - 1 : prev[opposite],
        }));

        try {
            const { data } = await reaction_change_post(post.id, kind);
            // شمارش‌ها رو با جواب واقعی سرور دقیق می‌کنیم (منبع درستِ عددها همونجاست)
            setCounts({ like: data.like_count, dislike: data.dislike_count });
            setActiveStates((prev) => ({
                ...prev,
                like: data.reaction === "like",
                dislike: data.reaction === "dislike",
            }));
        } catch (err) {
            console.error("خطا در ثبت واکنش:", err);
            // در صورت خطا، وضعیت قبل از کلیک رو برگردون
            setActiveStates((prev) => ({ ...prev, [kind]: wasActive, [opposite]: wasOppositeActive }));
            setCounts({ like: post.like_count ?? 0, dislike: post.dislike_count ?? 0 });
        }
    };

    const toggleLike = () => sendReaction("like");
    const toggleDislike = () => sendReaction("dislike");

    const toggleSave = () => {
        setActiveStates(prev => ({ ...prev, save: !prev.save }));
    };

    return (
        <div className={styles.UserPost} onClick={() => navigate(`/post/${post.id}`)}>
            <div className={styles.PostHeader}>
                <div className={styles.HeaderInfo}>
                    <img className={styles.pictureProfile} src={avatarSrc} alt="" />
                    <p className={styles.Name}>{displayName}</p>
                </div>

                {/* -------- دکمه سه‌نقطه + منو -------- */}
                {/* stopPropagation چون این دکمه داخل کارتیه که خودش با کلیک به صفحه‌ی پست می‌ره */}
                <div className={styles.MenuWrapper} ref={dotsRef} onClick={(e) => e.stopPropagation()}>
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
                <p>{post.content}</p>
            </div>

            {postImageUrl && (
                <div className={styles.PostImgWrapper}>
                    <img className={styles.PostImg} src={postImageUrl} alt="" />
                </div>
            )}

            {/* stopPropagation روی کل ردیف، تا کلیک روی لایک/دیسلایک/سیو/کامنت/شیر باعث نره صفحه‌ی پست نشه */}
            <div className={styles.PostStats} onClick={(e) => e.stopPropagation()}>
                <div className={styles.LeftSide}>
                    <button
                        className={`${styles.SavesWrapper} ${activeStates.save ? styles.Active : ""}`}
                        onClick={toggleSave}
                    >
                        <SavesIcon />
                    </button>

                    <button
                        className={`${styles.LikesWrapper} ${activeStates.like ? styles.Active : ""}`}
                        onClick={toggleLike}
                    >
                        <LikeIcon />
                        <p>{counts.like}</p>
                    </button>

                    <button
                        className={`${styles.DislikeWrapper} ${activeStates.dislike ? styles.Active : ""}`}
                        onClick={toggleDislike}
                    >
                        <DislikeIcon />
                        <p>{counts.dislike}</p>
                    </button>

                    <button
                        className={styles.ComentsWrapper}
                        onClick={() => navigate(`/post/${post.id}`)}
                    >
                        <CommentsIcon />
                        <p>{post.comment_count ?? 0}</p>
                    </button>

                    <button className={styles.ViewsWrapper}>
                        <ViewsIcon />
                    </button>
                </div>

                <div className={styles.RightSide}>
                    {/* -------- دکمه شیر: کلیک = کپی مستقیم لینک، بدون منوی واسطه -------- */}
                    <div className={styles.MenuWrapper}>
                        <button
                            className={styles.SharesWrapper}
                            onClick={handleShareClick}
                            aria-label="کپی لینک پست"
                        >
                            <ShareIcon />
                        </button>

                        {copied && <span className={styles.CopiedToast}>لینک کپی شد</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------------------ */
