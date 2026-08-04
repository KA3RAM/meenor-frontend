import { useEffect, useState } from "react";
import styles from "./Saves.module.css";
import PostCard from "../../components/PostCard/PostCard";
import { get_all_saved_posts } from "../../services/Axios";

// دقیقاً همون الگویی که نقدنگار و سرچ برای گرفتن و رندر کردن پست‌ها استفاده
// می‌کنن، فقط منبع دیتا به‌جای feed/ یا filter_post/ می‌شه saved_posts/.
export default function Saves() {
    const [posts, setPosts] = useState([]);
    const [loadingSaved, setLoadingSaved] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoadingSaved(true);
        get_all_saved_posts()
            .then(({ data }) => {
                if (!cancelled) setPosts(data ?? []);
            })
            .catch((err) => {
                console.error("خطا در گرفتن پست‌های ذخیره‌شده:", err);
                if (!cancelled) setPosts([]);
            })
            .finally(() => {
                if (!cancelled) setLoadingSaved(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            {loadingSaved && (
                <p className={styles.feedStatus}>در حال بارگذاری پست‌های ذخیره‌شده...</p>
            )}
            {!loadingSaved && posts.length === 0 && (
                <p className={styles.feedStatus}>هنوز پستی ذخیره نکردی.</p>
            )}

            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}
