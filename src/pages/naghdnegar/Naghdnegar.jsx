import { useState, useRef, useEffect } from "react";
import styles from "./Naghdnegar.module.css"
import Art from "../../assets/images/Arthur.jpg"

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
import { feed_post, filter_post, reaction_change_post } from "../../services/Axios";
import { resolveMediaUrl } from "../../utils/resolveMediaUrl";
import { useUserProfile } from "../../utils/useUserProfile";

/* ------------------------------------------------------------------------------ */
/*  PostCard — یه پست تکی. قبلاً همه‌ی این منطق مستقیم داخل Naghdnegar بود و برای یه
    پست هاردکد شده کار می‌کرد؛ حالا که چند تا پست داریم، جداش کردم تا هر پست state
    مستقل خودش (منوی بازشده، وضعیت لایک/دیسلایک و ...) رو داشته باشه.

    نکته‌ی مهم: طبق مستندات API (naghdnegar.xlsx)، خودِ آبجکتی که از feed/ یا
    filter_post/ برمی‌گرده از قبل شامل user_reaction و like_count/dislike_count/
    comment_count هست — پس نیازی به یه ریکوئست جداگانه‌ی get_post برای هر پست
    نیست؛ همون دیتای اولیه‌ی feed کافیه.                                          */
/* ------------------------------------------------------------------------------ */
function PostCard({ post }) {
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
        const postUrl = `${window.location.origin}/post/${post.id}`;
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("کپی نشد:", err);
        }
        setOpenMenu(null);
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
    );
}

/* ------------------------------------------------------------------------------ */

export default function Naghdnegar() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loadingFeed, setLoadingFeed] = useState(true);
    // محصولی که فیلترِ فعلی روش اعمال شده؛ اگه null باشه یعنی داریم فید عمومی رو می‌بینیم
    const [activeFilterProduct, setActiveFilterProduct] = useState(null);

    // چک لاگین بودن باید داخل useEffect باشه، نه مستقیم توی بدنه‌ی رندر —
    // وگرنه هر بار این کامپوننت رندر بشه، navigate() هم دوباره صدا زده می‌شه.
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/register");
        }
    }, [navigate]);

    const loadFeed = async () => {
        setLoadingFeed(true);
        try {
            const { data } = await feed_post();
            setPosts(data ?? []);
            setActiveFilterProduct(null);
        } catch (err) {
            console.error("خطا در گرفتن فید:", err);
            setPosts([]);
        } finally {
            setLoadingFeed(false);
        }
    };

    // بار اول که صفحه باز می‌شه، پست‌های فید عمومی رو می‌گیریم
    useEffect(() => {
        loadFeed();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // وقتی کاربر توی مودال فیلتر یه محصول رو انتخاب و روی «اعمال فیلتر» کلیک کرد
    const handleApplyFilter = async (product) => {
        if (!product) return;
        setIsFilterOpen(false);
        setLoadingFeed(true);
        try {
            const { data } = await filter_post(product.id);
            // پست‌های قبلی (چه فید عمومی چه فیلتر قبلی) کاملاً با نتیجه‌ی تازه جایگزین می‌شن —
            // یعنی هر بار فیلتر جدیدی اعمال بشه، از صفر شروع می‌شه، نه اضافه‌شدن به قبلی‌ها.
            setPosts(data ?? []);
            setActiveFilterProduct(product);
        } catch (err) {
            console.error("خطا در فیلتر پست‌ها:", err);
            setPosts([]);
        } finally {
            setLoadingFeed(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.Filterwrapper}>
                <button className={styles.filterBTN} onClick={() => setIsFilterOpen(true)}>
                    <FilterIcon className={styles.FilterIconsvg} />
                    <p className={styles.filterp}>فیلتر</p>
                </button>

                {activeFilterProduct && (
                    <button className={styles.filterBTN} onClick={loadFeed}>
                        <p className={styles.filterp}>حذف فیلتر</p>
                    </button>
                )}

                <FilterModal
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApply={handleApplyFilter}
                />
            </div>

            {loadingFeed && <p className={styles.feedStatus}>در حال بارگذاری پست‌ها...</p>}
            {!loadingFeed && posts.length === 0 && (
                <p className={styles.feedStatus}>پستی پیدا نشد.</p>
            )}

            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}
