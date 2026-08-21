// NewPostModal.jsx
import { useState, useRef, useEffect } from "react";
import styles from "./NewPostModal.module.css";
import lock from "../../assets/images/Lock.jpg"
import {CHB_send_input_good, creat_post, user_profile} from "../../services/Axios";
import { resolveMediaUrl } from "../../utils/resolveMediaUrl";
// حداقل تعداد کاراکتری که باید تایپ بشه تا ریکوئست جستجوی محصول زده بشه
const MIN_SEARCH_LENGTH = 2;
// مدت زمان صبر بعد از آخرین تایپ کاربر، قبل از زدن ریکوئست (debounce)
const SEARCH_DEBOUNCE_MS = 300;

const MAX_CHARS = 10000;

export default function NewPostModal({ isOpen, onClose, onSubmit }) {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null); // { file, previewUrl }
    // به‌جای رشته‌ی ساده، حالا کل آبجکت محصول انتخاب‌شده (شامل id واقعیش توی دیتابیس) رو نگه می‌داریم —
    // چون موقع ارسال پست به بک‌اند، باید همون id رو بفرستیم نه فقط اسم نمایشیش.
    const [topic, setTopic] = useState(null);
    const [topicQuery, setTopicQuery] = useState("");
    const [topicOpen, setTopicOpen] = useState(false);
    // نتیجه‌ی جست‌وجوی محصول از بک‌اند (آرایه‌ای از آبجکت‌ها با id/name/...)
    const [responsePhone, setResponsePhone] = useState([]);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [usersProfile, setUsersProfile] = useState({});

    const fileInputRef = useRef(null);
    const topicWrapperRef = useRef(null);
    const textareaRef = useRef(null);

    const debounceTimerRef = useRef(null);
    // شماره‌ی هر ریکوئست؛ تا اگه جواب یه ریکوئستِ قدیمی دیر برسه، نادیده گرفته بشه
    const requestIdRef = useRef(0);

    function DefaultUserIcon() {
        return (
            <div style={{

            }}>
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#faf9f9" style={{width: "24px", height: "24px"}}>
                    <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#ffffff"></path>
                    <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#ffffff"></path>
                </svg>
            </div>
        )
    }

    const fetch_get_user_profile = async () => {
        try{
            let{data:data} = await user_profile()
            setUsersProfile(data)
            console.log("data:", data)
        }
        catch(err){
            console.error("STATUS:", err.response?.status);
            console.error("ERROR DATA:", err.response?.data);
            console.error("ERROR:", err);        }
    }


    /* بستن با کلیک بیرون از دراپ‌داون موضوع */
    useEffect(() => {
        fetch_get_user_profile()
        function handleClickOutside(e) {
            if (topicWrapperRef.current && !topicWrapperRef.current.contains(e.target)) {
                setTopicOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* بستن مودال با Escape + قفل اسکرول پس‌زمینه */
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    /* ریست فرم هر بار که مودال بسته می‌شود */
    useEffect(() => {
        if (!isOpen) {
            setText("");
            setTopic(null);
            setTopicQuery("");
            setTopicOpen(false);
            setResponsePhone([]);
            if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl);
            setImage(null);
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    /* auto-grow textarea */
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    /* جست‌وجوی محصول از بک‌اند — با debounce، هر بار متنِ دراپ‌داون عوض بشه */
    useEffect(() => {
        const query = topicQuery.trim();

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (query.length < MIN_SEARCH_LENGTH) {
            setResponsePhone([]);
            setLoadingTopics(false);
            return;
        }

        debounceTimerRef.current = setTimeout(() => {
            fetch_search_good(query);
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(debounceTimerRef.current);
    }, [topicQuery]);

    if (!isOpen) return null;

    function handleImageSelect(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl);
        setImage({ file, previewUrl: URL.createObjectURL(file) });
        e.target.value = ""; // اجازه انتخاب دوباره همون فایل رو می‌ده
    }   

    function removeImage() {
        if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl);
        setImage(null);
    }

    function selectTopic(product) {
        setTopic(product);
        setTopicQuery("");
        setResponsePhone([]);
        setTopicOpen(false);
    }

    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) onClose();
    }

    // این همون چیزیه که موقع تایپ توی دراپ‌داون، با تاخیر (debounce) صدا زده می‌شه
    const fetch_search_good = async (query) => {
        const currentRequestId = ++requestIdRef.current;
        setLoadingTopics(true);
        try {
            const { data } = await CHB_send_input_good(query);
            // اگه در همین فاصله کاربر دوباره تایپ کرده و ریکوئست جدیدتری رفته، این جواب رو نادیده بگیر
            if (currentRequestId !== requestIdRef.current) return;
            setResponsePhone(data ?? []);
        } catch (err) {
            if (currentRequestId !== requestIdRef.current) return;
            console.error("خطا در جستجوی محصول:", err);
            setResponsePhone([]);
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setLoadingTopics(false);
            }
        }
    };

    // نتیجه‌ی جست‌وجو دقیقاً همون چیزیه که باید توی دراپ‌داون map بشه —
    // دیگه نیازی به فیلتر کردن سمت فرانت نیست چون بک‌اند خودش فیلتر شده برمی‌گردونه.
    const filteredTopics = responsePhone;

    const remaining = MAX_CHARS - text.length;
    // انتخاب یه محصول از دراپ‌داون هم الزامیه، چون بدون id واقعیش نمی‌شه پست رو به بک‌اند وصل کرد
    const canSubmit = text.trim().length > 0 && remaining >= 0 && !!topic;

    const fetch_creat_post = async () => {
        if (!canSubmit || submitting) return;
        setSubmitting(true);
        try {
            const content = text.trim();
            const phoneId = topic.id; // آیدی محصولی که کاربر از دراپ‌داون انتخاب کرده
            const imageFile = image?.file ?? null;

            const { data } = await creat_post(phoneId, imageFile, content);

            onSubmit?.(data);
            onClose();
        } catch (err) {
            console.error("STATUS:", err.response?.status);
            console.error("ERROR DATA:", err.response?.data);
            console.error("ERROR:", err);        } finally {
            setSubmitting(false);
        }
    };



    return (
        <div className={styles.overlay} onMouseDown={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="بستن">
                        ×
                    </button>
                    <span className={styles.headerTitle}>پست جدید</span>
                    <span style={{ width: 34 }} /> {/* برای تعادل هدر */}
                </div>

                <div className={styles.body}>
                    {usersProfile.profile_pic ? (
    <img
        className={styles.avatar}
        src={resolveMediaUrl(usersProfile.profile_pic)}
        alt="profile"
    />
) : (
    <DefaultUserIcon className={styles.avatar} />
)}
                    <div className={styles.composeCol}>
                        <textarea
                            ref={textareaRef}
                            className={styles.textarea}
                            placeholder="چه خبر؟"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            autoFocus
                        />

                        {image && (
                            <div className={styles.imagePreviewWrapper}>
                                <img className={styles.imagePreview} src={image.previewUrl} alt="preview" />
                                <button
                                    type="button"
                                    className={styles.removeImageBtn}
                                    onClick={removeImage}
                                    aria-label="حذف عکس"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <div className={styles.topicWrapper} ref={topicWrapperRef}>
                            <button
                                type="button"
                                className={styles.topicChip}
                                onClick={() => setTopicOpen((v) => !v)}
                            >
                                <span className={!topic ? styles.topicChipPlaceholder : undefined}>
                                    {topic ? topic.name : "انتخاب محصول"}
                                </span>
                                <span className={`${styles.chevron} ${topicOpen ? styles.chevronOpen : ""}`}>
                                    ▾
                                </span>
                            </button>

                            {topicOpen && (
                                <div className={styles.dropdown}>
                                    <input
                                        className={styles.dropdownSearch}
                                        placeholder="جست‌وجوی محصول..."
                                        value={topicQuery}
                                        onChange={(e) => setTopicQuery(e.target.value)}
                                        autoFocus
                                    />
                                    {loadingTopics ? (
                                        <div className={styles.dropdownEmpty}>در حال جستجو...</div>
                                    ) : filteredTopics.length > 0 ? (
                                        <ul className={styles.dropdownList}>
                                            {filteredTopics.map((p) => (
                                                <li key={p.id}>
                                                    <button
                                                        type="button"
                                                        className={`${styles.dropdownItem} ${
                                                            topic?.id === p.id ? styles.dropdownItemActive : ""
                                                        }`}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        onClick={() => selectTopic(p)}
                                                    >
                                                        {p.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : topicQuery.trim().length >= MIN_SEARCH_LENGTH ? (
                                        <div className={styles.dropdownEmpty}>موردی پیدا نشد</div>
                                    ) : (
                                        <div className={styles.dropdownEmpty}>
                                            برای جست‌وجو حداقل {MIN_SEARCH_LENGTH} حرف تایپ کن
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.toolsRow}>
                        <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={() => fileInputRef.current?.click()}
                            aria-label="افزودن عکس"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
                                <circle cx="8.5" cy="9.5" r="1.6" fill="currentColor" />
                                <path
                                    d="M4 17l5-5 3.5 3.5L16 12l4 5"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className={styles.hiddenFileInput}
                            onChange={handleImageSelect}
                        />
                    </div>

                    <div className={styles.submitRow}>
                        <span className={`${styles.charCount} ${remaining < 30 ? styles.charCountWarn : ""}`}>
                            {remaining}
                        </span>
                        <button
                            className={styles.submitBtn}
                            disabled={!canSubmit || submitting}
                            onClick={fetch_creat_post}
                        >
                            {submitting ? "در حال ارسال..." : "پست"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
