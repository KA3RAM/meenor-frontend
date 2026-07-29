import { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
// اگر SVGها رو به صورت React Component ایمپورت کنی
import { ReactComponent as SendIcon } from "../../assets/icons/chat/SendIcon.svg";
import { ReactComponent as RefreshIcon } from "../../assets/icons/chat/RefreshIcon.svg";


/* -------------------------------- data -------------------------------- */

// TODO: replace with your real product source (API call / DB query).
// Kept as a flat string list to match how the inputs are used below —
// swap for objects ({ id, name, image, ... }) if you need richer rendering.
const SAMPLE_PRODUCTS = [
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


/* --------------------------- product autocomplete ------------------------ */

function ProductAutocomplete({ value, onChange, placeholder, products }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const query = value.trim();
    const filtered = query.length === 0
        ? products
        : products.filter((p) => p.includes(query));

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function selectProduct(p) {
        onChange(p);
        setOpen(false);
    }

    return (
        <div className={styles.autocompleteWrapper} ref={wrapperRef}>
            {open && filtered.length > 0 && (
                <ul className={styles.autocompleteList}>
                    {filtered.map((p) => (
                        <li key={p}>
                            <button
                                type="button"
                                className={styles.autocompleteItem}
                                // prevent the input from blurring before the click registers
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => selectProduct(p)}
                            >
                                {p}
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
            onCompare?.(a, b);
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
                                onChange={setProductA}
                                placeholder="محصول اول..."
                                products={SAMPLE_PRODUCTS}
                            />
                            <span className={styles.vsBadge}>VS</span>
                            <ProductAutocomplete
                                value={productB}
                                onChange={setProductB}
                                placeholder="محصول دوم..."
                                products={SAMPLE_PRODUCTS}
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