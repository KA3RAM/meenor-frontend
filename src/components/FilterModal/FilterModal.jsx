import { useState, useEffect, useRef } from "react";
import styles from "./Filtermodal.module.css";

/**
 * مودال فیلتر محصولات
 *
 * props:
 * - isOpen: boolean -> نمایش/عدم نمایش مودال
 * - onClose: () => void -> بستن مودال (کلیک بیرون، دکمه بستن، Esc)
 * - products: [{ id, name, price?, image? }] -> لیست محصولات برای جستجو
 * - onSelectProduct: (product) => void -> وقتی کاربر یک محصول رو از دراپ‌باکس انتخاب می‌کنه
 * - onApply: (searchTerm) => void -> وقتی دکمه «اعمال فیلتر» زده میشه
 */
export default function FilterModal({
    isOpen,
    onClose,
    products = [],
    onSelectProduct,
    onApply,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const modalRef = useRef(null);
    const inputRef = useRef(null);

    // ریست شدن استیت هر بار که مودال بسته میشه
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm("");
            setShowDropdown(false);
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

    if (!isOpen) return null;

    const filteredProducts = searchTerm.trim()
        ? products.filter((p) =>
              p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
          )
        : [];

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        setShowDropdown(true);
    };

    const handleSelect = (product) => {
        setSearchTerm(product.name);
        setShowDropdown(false);
        onSelectProduct?.(product);
    };

    const handleApply = () => {
        onApply?.(searchTerm);
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
                                onClick={() => {
                                    setSearchTerm("");
                                    inputRef.current?.focus();
                                }}
                                aria-label="پاک کردن جستجو"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {showDropdown && searchTerm.trim() && (
                        <div className={styles.dropdown}>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        className={styles.dropdownItem}
                                        onClick={() => handleSelect(product)}
                                    >
                                        {product.image && (
                                            <img
                                                src={product.image}
                                                alt=""
                                                className={styles.itemImage}
                                            />
                                        )}
                                        <div className={styles.itemInfo}>
                                            <p className={styles.itemName}>
                                                {product.name}
                                            </p>
                                            {product.price && (
                                                <p className={styles.itemPrice}>
                                                    {product.price}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className={styles.emptyState}>محصولی یافت نشد</p>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button
                        className={styles.resetBtn}
                        onClick={() => setSearchTerm("")}
                    >
                        پاک کردن
                    </button>
                    <button className={styles.applyBtn} onClick={handleApply}>
                        اعمال فیلتر
                    </button>
                </div>
            </div>
        </div>
    );
}