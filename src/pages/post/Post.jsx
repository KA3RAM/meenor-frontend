import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "./Post.module.css"
import Art from "../../assets/images/Arthur.jpg"
// import lock from "../../assets/images/lock.jpeg"

/* ---------------------------------- SVG COMPONENTS --------------------------------- */
import { ReactComponent as CommentsIcon } from "../../assets/icons/PostImages/Coments.svg"
import { ReactComponent as ViewsIcon } from "../../assets/icons/PostImages/Views.svg"
import { ReactComponent as ThreeDotsIcon } from "../../assets/icons/PostImages/Threedots.svg"
import { ReactComponent as SavesIcon } from "../../assets/icons/PostImages/Nsave.svg"
import { ReactComponent as ShareIcon } from "../../assets/icons/PostImages/Share.svg"
import { ReactComponent as LikeIcon } from "../../assets/icons/PostImages/like.svg"
import { ReactComponent as DislikeIcon } from "../../assets/icons/PostImages/dislike.svg"

import {
    get_post,
    get_comment,
    set_comment,
    reaction_change_post,
    user_profile, get_poster_profile,
} from "../../services/Axios"
import { resolveMediaUrl } from "../../utils/resolveMediaUrl"
import { useUserProfile } from "../../utils/useUserProfile"

const MAX_TEXTAREA_HEIGHT = 200 // بعد از این ارتفاع (به px)، خود باکس اسکرول می‌خوره
const MAX_COMENT_LENGTH = 500 // حداکثر تعداد کاراکتر مجاز برای کامنت

// تاریخ+ساعت دقیق کامنت رو خوانا نشون می‌ده (نه فقط تاریخ، چون بک‌اند ساعت دقیق می‌فرسته)
function formatDateTime(iso) {
    if (!iso) return ""
    try {
        return new Date(iso).toLocaleString("fa-IR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    } catch {
        return ""
    }
}

/* ------------------------------------------------------------------------------ */
/*  CommentItem — هر کامنت پروفایل نویسنده‌ی خودش رو جدا می‌گیره (چون کامنت‌های یه
    پست می‌تونن از کاربرهای مختلف باشن)، با همون هوک مشترکِ کش‌دارِ useUserProfile. */
/* ------------------------------------------------------------------------------ */
function CommentItem({ comment }) {
    const author = useUserProfile(comment.user)
    const displayName = author
        ? [author.first_name, author.last_name].filter(Boolean).join(" ") ||
          author.username ||
          `کاربر #${comment.user}`
        : `کاربر #${comment.user}`
    const handle = author?.username ? `@${author.username}` : ""
    const avatarSrc = author?.profile_pic ? resolveMediaUrl(author.profile_pic) : Art

    return (
        <>
            <div className={styles.ComentsPeopleWrapper}>
                <div className={styles.HeaderInfo}>
                    <img className={styles.pictureProfile} src={avatarSrc} alt="" />
                    <p className={styles.Name}>{displayName}</p>
                    {handle && <p className={styles.Handle}>{handle}</p>}
                    <span className={styles.Dot}>·</span>
                    <p className={styles.Date}>{formatDateTime(comment.created_at)}</p>
                </div>
                <p className={styles.PeopleComentContent}>{comment.content}</p>
            </div>
            <hr className={styles.HrComent} />
        </>
    )
}

export default function Post() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [post, setPost] = useState(null)
    const [loadingPost, setLoadingPost] = useState(true)
    const [postError, setPostError] = useState(false)
    const [posterData,setPosterData] = useState([])

    const [comments, setComments] = useState([])
    const [loadingComments, setLoadingComments] = useState(true)

    const [currentUser, setCurrentUser] = useState(null) // برای عکس پروفایل کنار باکس نوشتن کامنت

    const [comentText, setComentText] = useState("")
    const [submittingComment, setSubmittingComment] = useState(false)
    const textareaRef = useRef(null)

    const [activeStates, setActiveStates] = useState({ like: false, dislike: false, save: false })
    const [counts, setCounts] = useState({ like: 0, dislike: 0 })
    const [copied, setCopied] = useState(false) // فیدبک بصری بعد از کپی لینک پست

    // نویسنده‌ی خودِ پست
    const author = useUserProfile(post?.user)
    const authorName = author
        ? [author.first_name, author.last_name].filter(Boolean).join(" ") ||
          author.username ||
          (post ? `کاربر #${post.user}` : "")
        : post
        ? `کاربر #${post.user}`
        : ""
    const authorHandle = author?.username ? `@${author.username}` : ""
    const authorAvatar = author?.profile_pic ? resolveMediaUrl(author.profile_pic) : Art


    const fetch_get_poster_data = async () => {
        try {
            let {data:data} = await get_poster_profile(post?.user)
            setPosterData(data)
            console.log(data + " " + "lir")
        }
        catch (err) {
            console.log(err)
        }

    }

    /* گرفتن اطلاعات پست */
    useEffect(() => {
        let cancelled = false
        setLoadingPost(true)
        setPostError(false)
        get_post(id)
            .then(({ data }) => {
                if (cancelled) return
                setPost(data)
                setActiveStates({
                    like: data.user_reaction === "like",
                    dislike: data.user_reaction === "dislike",
                    save: false,
                })
                setCounts({ like: data.like_count ?? 0, dislike: data.dislike_count ?? 0 })
            })
            .catch((err) => {
                console.error("خطا در گرفتن پست:", err)
                if (!cancelled) setPostError(true)
            })
            .finally(() => {
                if (!cancelled) setLoadingPost(false)
            })
        return () => {
            cancelled = true
        }
    }, [id])

    /* گرفتن کامنت‌های پست */
    useEffect(() => {
        let cancelled = false
        setLoadingComments(true)
        get_comment(id)
            .then(({ data }) => {
                if (!cancelled) setComments(data ?? [])
                fetch_get_poster_data()
            })
            .catch((err) => {
                console.error("خطا در گرفتن کامنت‌ها:", err)
                if (!cancelled) setComments([])
            })
            .finally(() => {
                if (!cancelled) setLoadingComments(false)
            })
        return () => {
            cancelled = true
        }
    }, [id])

    /* عکس پروفایل خودِ کاربر لاگین‌شده، برای کنار باکس نوشتن کامنت */
    useEffect(() => {
        const fetch_get_users_profile = async () => {
            let {data:data} = await user_profile()
            setCurrentUser(data)

        }
        fetch_get_users_profile()
    }, [])

    /* هم برای لایک هم دیسلایک — بک‌اند خودش toggle می‌کنه (همون منطق نقدنگار) */
    const sendReaction = async (kind) => {
        const wasActive = activeStates[kind]
        const opposite = kind === "like" ? "dislike" : "like"
        const wasOppositeActive = activeStates[opposite]

        setActiveStates((prev) => ({ ...prev, [kind]: !wasActive, [opposite]: false }))
        setCounts((prev) => ({
            ...prev,
            [kind]: prev[kind] + (wasActive ? -1 : 1),
            [opposite]: wasOppositeActive ? prev[opposite] - 1 : prev[opposite],
        }))

        try {
            const { data } = await reaction_change_post(post.id, kind)
            setCounts({ like: data.like_count, dislike: data.dislike_count })
            setActiveStates((prev) => ({
                ...prev,
                like: data.reaction === "like",
                dislike: data.reaction === "dislike",
            }))
        } catch (err) {
            console.error("خطا در ثبت واکنش:", err)
            setActiveStates((prev) => ({ ...prev, [kind]: wasActive, [opposite]: wasOppositeActive }))
            setCounts({ like: post.like_count ?? 0, dislike: post.dislike_count ?? 0 })
        }
    }

    const toggleLike = () => sendReaction("like")
    const toggleDislike = () => sendReaction("dislike")
    const toggleSave = () => setActiveStates((prev) => ({ ...prev, save: !prev.save }))

    // مثل توییتر/یوتیوب: با یه کلیک، لینک همین پست مستقیم کپی می‌شه
    const handleShareClick = async () => {
        const postUrl = `${window.location.origin}/post/${post.id}`
        try {
            await navigator.clipboard.writeText(postUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch (err) {
            console.error("کپی نشد:", err)
        }
    }

    const handleComentChange = (e) => {
        const value = e.target.value.slice(0, MAX_COMENT_LENGTH)
        setComentText(value)

        const el = textareaRef.current
        if (!el) return

        el.style.height = "auto"
        if (el.scrollHeight > MAX_TEXTAREA_HEIGHT) {
            el.style.height = MAX_TEXTAREA_HEIGHT + "px"
            el.style.overflowY = "auto"
            el.scrollTop = el.scrollHeight
        } else {
            el.style.height = el.scrollHeight + "px"
            el.style.overflowY = "hidden"
        }
        el.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    const handleSendComment = async () => {
        const content = comentText.trim()
        if (!content || submittingComment) return
        setSubmittingComment(true)
        try {
            const { data } = await set_comment(post.id, { content })
            // کامنت تازه رو بالای لیست اضافه می‌کنیم، بدون نیاز به رفرش کل لیست
            setComments((prev) => [data, ...prev])
            setPost((prev) => (prev ? { ...prev, comment_count: (prev.comment_count ?? 0) + 1 } : prev))
            setComentText("")
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto"
            }
        } catch (err) {
            console.error("خطا در ارسال کامنت:", err)
        } finally {
            setSubmittingComment(false)
        }
    }

    if (loadingPost) {
        return (
            <div className={styles.wrapper}>
                <p className={styles.stateText}>در حال بارگذاری پست...</p>
            </div>
        )
    }

    if (postError || !post) {
        return (
            <div className={styles.wrapper}>
                <p className={styles.stateText}>این پست پیدا نشد.</p>
            </div>
        )
    }

    const postImageUrl = resolveMediaUrl(post.image)
    const currentUserAvatar = resolveMediaUrl(currentUser?.profile_pic)

    return (
        <div className={styles.wrapper}>

            <div className={styles.UserPost}>

                <div className={styles.PostHeader}>
                    <div className={styles.HeaderInfo}>
                        <img className={styles.pictureProfile} src={authorAvatar} alt="" />
                        <p className={styles.Name}>{authorName}</p>
                        {authorHandle && <p className={styles.Handle}>{authorHandle}</p>}
                    </div>

                    <button className={styles.ThreeDots}>
                        <ThreeDotsIcon />
                    </button>
                </div>

                <div className={styles.PostContentWrapper}>
                    <p>{post.content}</p>
                </div>

                {postImageUrl && (
                    <div className={styles.PostImgWrapper}>
                        <img className={styles.PostImg} src={postImageUrl} alt="" />
                    </div>
                )}

                <div className={styles.PostStats}>
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

                        <button className={styles.ComentsWrapper}>
                            <CommentsIcon />
                            <p>{post.comment_count ?? 0}</p>
                        </button>

                        <button className={styles.ViewsWrapper}>
                            <ViewsIcon />
                        </button>

                    </div>

                    <div className={styles.RightSide}>
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


                <div className={styles.PostSingularComents}>
                    <h3 className={styles.h3}>نظرات</h3>
                    <hr className={styles.hr} />
                    <div className={styles.UserComentWrapper}>
                        <img className={styles.UserProfilePic} src={currentUserAvatar} alt="" />
                        <div className={styles.ComentInputBox}>
                            <textarea
                                ref={textareaRef}
                                className={styles.UserComent}
                                name="coment"
                                rows={1}
                                maxLength={MAX_COMENT_LENGTH}
                                placeholder="پاسخ خود را بنویسید..."
                                value={comentText}
                                onChange={handleComentChange}
                            />
                            <span
                                className={styles.ComentCounter}
                                style={comentText.length >= MAX_COMENT_LENGTH ? { color: "#f4212e" } : undefined}
                            >
                                {comentText.length}/{MAX_COMENT_LENGTH}
                            </span>
                        </div>
                        <button
                            className={styles.SendComent}
                            disabled={!comentText.trim() || submittingComment}
                            onClick={handleSendComment}
                            style={{"cursor": "pointer"}}
                        >
                            {submittingComment ? "..." : "پاسخ"}
                        </button>
                    </div>
                    <hr className={styles.hr} />

                    {loadingComments && <p className={styles.stateText}>در حال بارگذاری نظرات...</p>}
                    {!loadingComments && comments.length === 0 && (
                        <p className={styles.stateText}>هنوز نظری ثبت نشده.</p>
                    )}

                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}

                </div>

            </div>

        </div>
    )
}
