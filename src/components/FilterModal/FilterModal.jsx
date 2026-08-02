import { useState, useEffect, useRef } from "react";
import styles from "./Filtermodal.module.css";
import { CHB_send_input_good } from "../../services/Axios";

// حداقل تعداد کاراکتری که باید تایپ بشه تا ریکوئست جستجو زده بشه
const MIN_SEARCH_LENGTH = 2;
// مدت زمان صبر بعد از آخرین تایپ کاربر، قبل از زدن ریکوئست (debounce)
const SEARCH_DEBOUNCE_MS = 300;

/**
 * مودال فیلتر محصولات
 *
 * props:
 * - isOpen: boolean -> نمایش/عدم نمایش مودال
 * - onClose: () => void -> بستن مودال (کلیک بیرون، دکمه بستن، Esc)
 * - onApply: (product) => void -> وقتی دکمه «اعمال فیلتر» زده میشه، با کل آبجکت
 *   محصول انتخاب‌شده (شامل id واقعیش) صدا زده می‌شه — نه فقط متن جستجو.
 */
export default function FilterModal({ isOpen, onClose, onApply }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    // نتیجه‌ی جست‌وجوی محصول از بک‌اند (آرایه‌ای از آبجکت‌ها با id/name/...)
    const [results, setResults] = useState([]);
    const [loadingResults, setLoadingResults] = useState(false);
    // آبجکت کامل محصولی که کاربر واقعاً از دراپ‌داون انتخاب کرده (نه فقط متن تایپ‌شده)
    const [selectedProduct, setSelectedProduct] = useState(null);

    const modalRef = useRef(null);
    const inputRef = useRef(null);
    const debounceTimerRef = useRef(null);
    // شماره‌ی هر ریکوئست؛ تا اگه جواب یه ریکوئستِ قدیمی دیر برسه، نادیده گرفته بشه
    const requestIdRef = useRef(0);

    // ریست شدن استیت هر بار که مودال بسته میشه
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm("");
            setShowDropdown(false);
            setResults([]);
            setSelectedProduct(null);
        } else {
            // فوکوس روی اینپوت هنگام باز شدن
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    // بستن با کلیک بیرون از مودال
    useEffect(() => {
        function handleOutsideClick(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen, onClose]);

    // بستن با کلید Esc
    useEffect(() => {
        function handleEsc(e) {
            if (e.key === "Escape") onClose();
        }
        if (isOpen) document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    // جست‌وجوی محصول از بک‌اند — با debounce، هر بار متنِ سرچ عوض بشه
    useEffect(() => {
        const query = searchTerm.trim();

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (query.length < MIN_SEARCH_LENGTH) {
            setResults([]);
            setLoadingResults(false);
            return;
        }

        debounceTimerRef.current = setTimeout(async () => {
            const currentRequestId = ++requestIdRef.current;
            setLoadingResults(true);
            try {
                const { data } = await CHB_send_input_good(query);
                // اگه در همین فاصله کاربر دوباره تایپ کرده و ریکوئست جدیدتری رفته، این جواب رو نادیده بگیر
                if (currentRequestId !== requestIdRef.current) return;
                setResults(data ?? []);
            } catch (err) {
                if (currentRequestId !== requestIdRef.current) return;
                console.error("خطا در جستجوی محصول:", err);
                setResults([]);
            } finally {
                if (currentRequestId === requestIdRef.current) {
                    setLoadingResults(false);
                }
            }
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(debounceTimerRef.current);
    }, [searchTerm]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        setShowDropdown(true);
        // اگه کاربر بعد از انتخاب دوباره دستی تایپ کنه، انتخاب قبلی دیگه معتبر نیست
        setSelectedProduct(null);
    };

    const handleSelect = (product) => {
        setSearchTerm(product.name);
        setShowDropdown(false);
        setSelectedProduct(product);
    };

    const handleReset = () => {
        setSearchTerm("");
        setSelectedProduct(null);
        setResults([]);
        inputRef.current?.focus();
    };

    const handleApply = () => {
        if (!selectedProduct) return;
        onApply?.(selectedProduct);
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef} dir="rtl">
                <div className={styles.header}>
                    <p className={styles.title}>فیلتر محصولات</p>
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="بستن"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className={styles.searchWrapper}>
                    <div className={styles.searchBox}>
                        <svg
                            className={styles.searchIcon}
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            className={styles.searchInput}
                            placeholder="جستجوی محصول..."
                            value={searchTerm}
                            onChange={handleChange}
                            onFocus={() => searchTerm.trim() && setShowDropdown(true)}
                        />
                        {searchTerm && (
                            <button
                                className={styles.clearIcon}
                                onClick={handleReset}
                                aria-label="پاک کردن جستجو"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {showDropdown && searchTerm.trim().length >= MIN_SEARCH_LENGTH && (
                        <div className={styles.dropdown}>
                            {loadingResults ? (
                                <p className={styles.emptyState}>در حال جستجو...</p>
                            ) : results.length > 0 ? (
                                results.map((product) => (
                                    <button
                                        key={product.id}
                                        className={styles.dropdownItem}
                                        onClick={() => handleSelect(product)}
                                    >
                                        {product.image_link && (
                                            <img
                                                src={product.image_link}
                                                alt=""
                                                className={styles.itemImage}
                                            />
                                        )}
                                        <div className={styles.itemInfo}>
                                            <p className={styles.itemName}>
                                                {product.name}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className={styles.emptyState}>محصولی یافت نشد</p>
                            )}
                        </div>
                    )}

                    {searchTerm.trim() && !selectedProduct && (
                        <p className={styles.selectHint}>
                            لطفاً محصول رو از لیست بالا انتخاب کن.
                        </p>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.resetBtn} onClick={handleReset}>
                        پاک کردن
                    </button>
                    <button
                        className={styles.applyBtn}
                        onClick={handleApply}
                        disabled={!selectedProduct}
                    >
                        اعمال فیلتر
                    </button>
                </div>
            </div>
        </div>
    );
}
