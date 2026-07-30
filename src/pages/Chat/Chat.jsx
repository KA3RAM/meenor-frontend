import { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
// اگر SVGها رو به صورت React Component ایمپورت کنی
import { ReactComponent as SendIcon } from "../../assets/icons/chat/SendIcon.svg";
import { ReactComponent as RefreshIcon } from "../../assets/icons/chat/RefreshIcon.svg";
import { CHB_send_input_good } from "../../services/Axios";

/* --------------------------- product autocomplete ------------------------ */

// حداقل تعداد کاراکتری که باید تایپ بشه تا ریکوئست جستجو زده بشه.
const MIN_SEARCH_LENGTH = 2;
// مدت زمان صبر (میلی‌ثانیه) بعد از آخرین تایپ کاربر، قبل از زدن ریکوئست (debounce).
const SEARCH_DEBOUNCE_MS = 300;

function ProductAutocomplete({ value, onChange, onSelectProduct, placeholder }) {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const wrapperRef = useRef(null);
    const debounceTimerRef = useRef(null);
    // شماره‌ی هر ریکوئست؛ برای اینکه اگه جواب یه ریکوئستِ قدیمی دیر برسه، نادیده گرفته بشه.
    const requestIdRef = useRef(0);

    // بستن dropdown با کلیک بیرون از باکس
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // هر بار متن اینپوت عوض شد، با تاخیر (debounce) به بک‌اند برای لیست محصولات مرتبط درخواست بزن.
    useEffect(() => {
        const query = value.trim();

        // اگه تایمر قبلی هنوز در انتظاره، کنسلش کن (این خودِ منطق debounce هست)
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // اگه متن خیلی کوتاهه، اصلاً ریکوئست نزن و لیست رو خالی کن
        if (query.length < MIN_SEARCH_LENGTH) {
            setProducts([]);
            setLoadingProducts(false);
            return;
        }

        debounceTimerRef.current = setTimeout(async () => {
            const currentRequestId = ++requestIdRef.current;
            setLoadingProducts(true);
            try {
                const response = await CHB_send_input_good(query);
                console.log("RAW RESPONSE:", response?.data);
                // اگه در همین فاصله کاربر دوباره تایپ کرده و ریکوئست جدیدتری رفته، این جواب رو نادیده بگیر
                if (currentRequestId !== requestIdRef.current) return;
                setProducts(response?.data ?? []);
            } catch (err) {
                if (currentRequestId !== requestIdRef.current) return;
                console.error("خطا در جستجوی محصول:", err);
                setProducts([]);
            } finally {
                if (currentRequestId === requestIdRef.current) {
                    setLoadingProducts(false);
                }
            }
        }, SEARCH_DEBOUNCE_MS);

        // پاکسازی: اگه value دوباره عوض بشه یا کامپوننت unmount بشه، تایمر معلق رو پاک کن
        return () => clearTimeout(debounceTimerRef.current);
    }, [value]);

    function selectProduct(product) {
        onChange(product.name);
        // آبجکت کامل محصول (شامل id) رو هم به بیرون می‌فرستیم تا در مرحله‌ی
        // "شروع مقایسه" بشه به‌جای متن، شناسه‌ی واقعی محصول رو به API داد.
        onSelectProduct?.(product);
        setOpen(false);
    }

    return (
        <div className={styles.autocompleteWrapper} ref={wrapperRef}>
            {open && value.trim().length >= MIN_SEARCH_LENGTH && (
                <ul className={styles.autocompleteList}>
                    {loadingProducts && (
                        <li className={styles.autocompleteItem}>در حال جستجو...</li>
                    )}
                    {!loadingProducts && products.length === 0 && (
                        <li className={styles.autocompleteItem}>محصولی یافت نشد</li>
                    )}
                    {!loadingProducts &&
                        products.map((p) => (
                            <li key={p.id}>
                                <button
                                    type="button"
                                    className={styles.autocompleteItem}
                                    // prevent the input from blurring before the click registers
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => selectProduct(p)}
                                >
                                    {[p.name].filter(Boolean).join(" ")}
                                </button>
                            </li>
                        ))}
                </ul>
            )}
            <input
                className={styles.compareInput}
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
            />
        </div>
    );
}

/* --------------------------- placeholder responder ----------------------- */
function fakeAssistantReply(text) {
    return new Promise((resolve) =>
        setTimeout(() => resolve(`(نمونه پاسخ) دریافت شد: «${text}»`), 600)
    );
}

/* ------------------------------- component ------------------------------ */
export default function ChatCompareBox({ onCompare, onSendMessage } = {}) {
    // "compare"  -> two product inputs + autocomplete
    // "chat"     -> single textarea + message list
    const [phase, setPhase] = useState("compare");
    const [morphing, setMorphing] = useState(false);

    const [productA, setProductA] = useState("");
    const [productB, setProductB] = useState("");
    // آبجکت کامل محصول انتخاب‌شده (شامل id) برای هر دو باکس — برای مرحله‌ی بعدی که باید id رو به API مقایسه بفرستیم.
    const [selectedProductA, setSelectedProductA] = useState(null);
    const [selectedProductB, setSelectedProductB] = useState(null);

    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);

    const textareaRef = useRef(null);
    const listEndRef = useRef(null);

    useEffect(() => {
        listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    useEffect(() => {
        if (!textareaRef.current) return;
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }, [chatInput]);

    /* ------------------------------ handlers ------------------------------ */

    function morphTo(nextPhase, after) {
        setMorphing(true);
        window.setTimeout(() => {
            after?.();
            setPhase(nextPhase);
            setMorphing(false);
        }, 220);
    }

    function handleStartCompare(e) {
        e.preventDefault();
        if (!productA.trim() || !productB.trim()) return;

        const a = productA.trim();
        const b = productB.trim();

        morphTo("chat", () => {
            // پیامی به لیست پیام‌ها اضافه نمی‌کنیم — فقط دیتا رو بیرون می‌فرستیم
            // تا خودت بعداً به بک‌اند وصلش کنی.
            onCompare?.(a, b, { productA: selectedProductA, productB: selectedProductB });
        });
    }

    async function handleSendChat(e) {
        e.preventDefault();
        const text = chatInput.trim();
        if (!text || sending) return;

        const userMessage = { id: Date.now(), role: "user", text };
        const history = [...messages, userMessage];
        setMessages(history);
        setChatInput("");
        setSending(true);

        try {
            const reply = onSendMessage
                ? await onSendMessage(text, history)
                : await fakeAssistantReply(text);

            if (reply) {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, role: "assistant", text: reply },
                ]);
            }
        } finally {
            setSending(false);
        }
    }

    function handleNewCompare() {
        morphTo("compare", () => {
            setProductA("");
            setProductB("");
            setSelectedProductA(null);
            setSelectedProductB(null);
            setChatInput("");
            setMessages([]);
        });
    }

    /* -------------------------------- render ------------------------------- */

    return (
        <div className={styles.wrapper}>
            {phase === "chat" && (
                <div className={styles.messages}>
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={m.role === "user" ? styles.userBubble : styles.aiBubble}
                        >
                            {m.text}
                        </div>
                    ))}
                    {sending && (
                        <div className={styles.aiBubble}>...</div>
                    )}
                    <div ref={listEndRef} />
                </div>
            )}

            <div className={styles.dock}>
                {phase === "compare" ? (
                    <form
                        className={`${styles.compareCard} ${morphing ? styles.morphOut : styles.morphIn}`}
                        onSubmit={handleStartCompare}
                    >
                        <div className={styles.compareRow}>
                            <ProductAutocomplete
                                value={productA}
                                onChange={(text) => {
                                    setProductA(text);
                                    // اگه کاربر بعد از انتخاب دوباره دستی تایپ کنه، انتخاب قبلی دیگه معتبر نیست
                                    setSelectedProductA(null);
                                }}
                                onSelectProduct={setSelectedProductA}
                                placeholder="محصول اول..."
                            />
                            <span className={styles.vsBadge}>VS</span>
                            <ProductAutocomplete
                                value={productB}
                                onChange={(text) => {
                                    setProductB(text);
                                    setSelectedProductB(null);
                                }}
                                onSelectProduct={setSelectedProductB}
                                placeholder="محصول دوم..."
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={!productA.trim() || !productB.trim()}
                        >
                            شروع مقایسه
                            <SendIcon />
                        </button>
                    </form>
                ) : (
                    <form
                        className={`${styles.chatCard} ${morphing ? styles.morphOut : styles.morphIn}`}
                        onSubmit={handleSendChat}
                    >
                        <textarea
                            ref={textareaRef}
                            className={styles.chatTextarea}
                            placeholder="سوالت رو در مورد این مقایسه بپرس..."
                            rows={1}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendChat(e);
                                }
                            }}
                        />
                        <div className={styles.chatActions}>
                            <button
                                type="button"
                                className={styles.newCompareButton}
                                onClick={handleNewCompare}
                            >
                                <RefreshIcon />
                                مقایسه جدید
                            </button>
                            <button
                                type="submit"
                                className={styles.sendIconButton}
                                disabled={!chatInput.trim() || sending}
                                aria-label="ارسال"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
