import { useState, useEffect } from "react";
import styles from "./Naghdnegar.module.css"

import { ReactComponent as FilterIcon } from "../../assets/icons/PostImages/Filter.svg"

import { useNavigate } from "react-router-dom";
import FilterModal from "../../components/FilterModal/FilterModal";
import PostCard from "../../components/PostCard/PostCard";
import { feed_post, filter_post } from "../../services/Axios";

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
