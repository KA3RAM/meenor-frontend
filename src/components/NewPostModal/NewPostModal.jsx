// NewPostModal.jsx
import { useState, useRef, useEffect } from "react";
import styles from "./NewPostModal.module.css";
import lock from "../../assets/images/Lock.jpg"

const POST_TOPICS = [
    "آیفون ۱۵",
    "آیفون ۱۵ پرو",
    "آیفون ۱۵ پرو مکس",
    "سامسونگ گلکسی S24",
    "سامسونگ گلکسی S24 اولترا",
    "پلی‌استیشن ۵",
    "ایکس‌باکس سری X",
    "تسلا مدل ۳",
    "تسلا مدل Y",
    "بی‌وای‌دی سیل",
    "مک‌بوک ایر M3",
    "مک‌بوک پرو M3",
    "شیائومی ۱۴",
];

const MAX_CHARS = 10000;

export default function NewPostModal({ isOpen, onClose, onSubmit }) {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null); // { file, previewUrl }
    const [topic, setTopic] = useState("");
    const [topicQuery, setTopicQuery] = useState("");
    const [topicOpen, setTopicOpen] = useState(false);

    const fileInputRef = useRef(null);
    const topicWrapperRef = useRef(null);
    const textareaRef = useRef(null);

    /* بستن با کلیک بیرون از دراپ‌داون موضوع */
    useEffect(() => {
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
            setTopic("");
            setTopicQuery("");
            setTopicOpen(false);
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

    function selectTopic(t) {
        setTopic(t);
        setTopicQuery("");
        setTopicOpen(false);
    }

    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) onClose();
    }

    function handleSubmit() {
        if (!text.trim()) return;
        onSubmit?.({
            text: text.trim(),
            image: image?.file ?? null,
            topic: topic || null,
        });
        onClose();
    }

    const filteredTopics =
        topicQuery.trim().length === 0
            ? POST_TOPICS
            : POST_TOPICS.filter((t) => t.includes(topicQuery.trim()));

    const remaining = MAX_CHARS - text.length;
    const canSubmit = text.trim().length > 0 && remaining >= 0;

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
                    <img className={styles.avatar} src={lock} alt="profile" />

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
                                    {topic || "انتخاب محصول"}
                                </span>
                                <span className={`${styles.chevron} ${topicOpen ? styles.chevronOpen : ""}`}>
                                    ▾
                                </span>
                            </button>

                            {topicOpen && (
                                <div className={styles.dropdown}>
                                    <input
                                        className={styles.dropdownSearch}
                                        placeholder="جست‌وجوی موضوع..."
                                        value={topicQuery}
                                        onChange={(e) => setTopicQuery(e.target.value)}
                                        autoFocus
                                    />
                                    {filteredTopics.length > 0 ? (
                                        <ul className={styles.dropdownList}>
                                            {filteredTopics.map((t) => (
                                                <li key={t}>
                                                    <button
                                                        type="button"
                                                        className={`${styles.dropdownItem} ${
                                                            t === topic ? styles.dropdownItemActive : ""
                                                        }`}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        onClick={() => selectTopic(t)}
                                                    >
                                                        {t}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className={styles.dropdownEmpty}>موردی پیدا نشد</div>
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
                            disabled={!canSubmit}
                            onClick={handleSubmit}
                        >
                            پست
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}