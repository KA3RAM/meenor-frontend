import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./ManagePost.module.css"

import PostCard from "../../components/PostCard/PostCard"
import Snackbar from "../../components/Snackbar/Snackbar"
import { useSnackbar } from "../../components/Snackbar/useSnackbar"
import { get_users_posts, delete_post } from "../../services/Axios"
import { getErrorMessage } from "../../utils/getErrorMessage"

// دقیقاً همون الگویی که نقدنگار (feed_post / filter_post) برای گرفتن و رندر
// کردن پست‌ها استفاده می‌کنه، فقط منبع دیتا پست‌های خودِ کاربره (user_posts/).
// تنها تفاوتِ ظاهریِ کارت‌ها اینه که PostCard رو با پراپ onDelete صدا می‌زنیم،
// که خودش به‌جای دکمه‌ی سه‌نقطه/گزارش، یه دکمه‌ی حذفِ قرمز نشون می‌ده.
export default function ManagePost() {
    const navigate = useNavigate()
    const { snackbar, showSnackbar, closeSnackbar } = useSnackbar()

    const [posts, setPosts] = useState([])
    const [loadingPosts, setLoadingPosts] = useState(true)

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/register")
        }
    }, [navigate])

    useEffect(() => {
        let cancelled = false
        setLoadingPosts(true)
        get_users_posts()
            .then(({ data }) => {
                if (!cancelled) setPosts(data ?? [])
            })
            .catch((err) => {
                console.error("خطا در گرفتن پست‌های کاربر:", err)
                if (!cancelled) setPosts([])
            })
            .finally(() => {
                if (!cancelled) setLoadingPosts(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    // کلیک روی دکمه‌ی حذف: پست رو برای بک‌اند می‌فرسته و در صورت موفقیت،
    // هم از لیست حذفش می‌کنه هم پیام موفقیت رو نشون می‌ده.
    const handleDeletePost = async (post) => {
        try {
            await delete_post(post.id)
            setPosts((prev) => prev.filter((p) => p.id !== post.id))
            showSnackbar("پست با موفقیت حذف شد.", "success")
        } catch (err) {
            console.error("خطا در حذف پست:", err)
            showSnackbar(getErrorMessage(err), "error")
        }
    }

    return (
        <div className={styles.wrapper}>
            {loadingPosts && <p className={styles.feedStatus}>در حال بارگذاری پست‌ها...</p>}
            {!loadingPosts && posts.length === 0 && (
                <p className={styles.feedStatus}>هنوز پستی ثبت نکردی.</p>
            )}

            {posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
            ))}

            <Snackbar
                message={snackbar?.message}
                type={snackbar?.type}
                onClose={closeSnackbar}
            />
        </div>
    )
}
