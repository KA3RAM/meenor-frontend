import { useEffect, useRef, useState } from "react"
import styles from "./Seacrh.module.css"
import { ReactComponent as SearchIcon} from "../../assets/icons/PostImages/search.svg"
import { search_post } from "../../services/Axios"
import PostCard from "../../components/PostCard/PostCard"

// حداقل تعداد کاراکتری که باید تایپ بشه تا ریکوئست جستجو زده بشه
const MIN_SEARCH_LENGTH = 2
// مدت زمان صبر بعد از آخرین تایپ کاربر، قبل از زدن ریکوئست (debounce)
const SEARCH_DEBOUNCE_MS = 300

export default function Search() {
    const [query, setQuery] = useState("")
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)

    const debounceTimerRef = useRef(null)
    // شماره‌ی هر ریکوئست؛ تا اگه جواب یه ریکوئستِ قدیمی دیر برسه، نادیده گرفته بشه
    const requestIdRef = useRef(0)

    // جست‌وجوی پست از بک‌اند — با debounce، هر بار متن سرچ عوض بشه
    useEffect(() => {
        const q = query.trim()

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        if (q.length < MIN_SEARCH_LENGTH) {
            setPosts([])
            setLoading(false)
            return
        }

        debounceTimerRef.current = setTimeout(async () => {
            const currentRequestId = ++requestIdRef.current
            setLoading(true)
            try {
                const { data } = await search_post(q)
                // اگه در همین فاصله کاربر دوباره تایپ کرده و ریکوئست جدیدتری رفته، این جواب رو نادیده بگیر
                if (currentRequestId !== requestIdRef.current) return
                setPosts(data ?? [])
            } catch (err) {
                if (currentRequestId !== requestIdRef.current) return
                console.error("خطا در جستجوی پست:", err)
                setPosts([])
            } finally {
                if (currentRequestId === requestIdRef.current) {
                    setLoading(false)
                }
            }
        }, SEARCH_DEBOUNCE_MS)

        return () => clearTimeout(debounceTimerRef.current)
    }, [query])

    return (
        <div className={styles.SearchWholeWrapper}>
            <div className={styles.searchbox}>
                <SearchIcon/>
                <input
                    type="text"
                    placeholder="سرچ کنید..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {loading && <p className={styles.searchStatus}>در حال جستجو...</p>}

            {!loading && query.trim().length >= MIN_SEARCH_LENGTH && posts.length === 0 && (
                <p className={styles.searchStatus}>پستی پیدا نشد.</p>
            )}

            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}
