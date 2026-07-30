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



/* ------------------------- comparison table + spec sheet ------------------------- */

// لیبل فارسی برای فیلدهایی که از قبل می‌شناسیم (چه عددی چه متنی).
// هر فیلد جدیدی که بک‌اند به مدل محصول اضافه کرد، اگه اینجا نباشه هم مشکلی نیست —
// خودکار با یه لیبل ساخته‌شده از اسم فیلد (prettifyKey) نمایش داده می‌شه.
const FIELD_LABELS = {
    // فیلدهای عددی
    display_refresh_rate: "نرخ رفرش نمایشگر (Hz)",
    display_brightness: "روشنایی نمایشگر (nit)",
    battery_size: "ظرفیت باتری (mAh)",
    wired_charging_speed: "سرعت شارژ سیمی (وات)",
    price: "قیمت",
    AnTuTu: "امتیاز AnTuTu",
    GeekBench: "امتیاز GeekBench",
    // فیلدهای متنی
    network_technology: "فناوری شبکه",
    announced: "تاریخ معرفی",
    body_dimensions: "ابعاد بدنه",
    body_weight: "وزن بدنه",
    body_build: "بدنه و متریال",
    SIM: "نوع سیم‌کارت",
    display_type: "نوع نمایشگر",
    display_resolution: "رزولوشن نمایشگر",
    display_protection: "محافظ نمایشگر",
    operating_system: "سیستم‌عامل",
    chipset: "چیپست",
    CPU: "پردازنده (CPU)",
    GPU: "پردازنده گرافیکی (GPU)",
    memory_card_slot: "اسلات کارت حافظه",
    internal_memory: "حافظه داخلی",
    back_camera: "دوربین پشت",
    back_camera_features: "امکانات دوربین پشت",
    back_camera_video: "ویدیوی دوربین پشت",
    selfie_camera: "دوربین سلفی",
    selfie_camera_video: "ویدیوی دوربین سلفی",
    loudspeaker: "بلندگو",
    headphone_jack: "جک هدفون",
    bluetooth: "بلوتوث",
    positioning: "موقعیت‌یاب (GPS)",
    NFC: "ان‌اف‌سی (NFC)",
    USB: "پورت USB",
    sensors: "سنسورها",
    battery_type: "نوع باتری",
    charging: "شارژ",
    colors: "رنگ‌بندی",
};

// این فیلدها اصلاً وارد مقایسه نمی‌شن چون جای دیگه‌ای (هدر/تصویر) نمایش داده می‌شن یا بی‌معنی‌ان.
const EXCLUDED_FIELDS = new Set(["id", "name", "image_link"]);

// برای این فیلدهای عددی، عدد کمتر یعنی برنده (مثلاً قیمت پایین‌تر بهتره).
// بقیه‌ی فیلدهای عددی پیش‌فرض «عدد بیشتر = برنده» هستن.
const LOWER_IS_BETTER = new Set(["price"]);

// اگه فیلدی توی FIELD_LABELS نبود، از روی اسم خودش یه لیبل خوانا می‌سازه
// (مثلاً "extra_storage_slots" -> "Extra Storage Slots")
function prettifyKey(key) {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fieldLabel(key) {
    return FIELD_LABELS[key] || prettifyKey(key);
}

// یه مقدار "خالی/بی‌معنی" حساب می‌شه اگه نال/undefined/رشته‌ی خالی/آرایه‌ی خالی سریالایز شده باشه
// (توی دیتای نمونه‌مون مثلاً display_size مقدار "[]" داشت که عملاً یعنی خالیه)
function isEmptyValue(v) {
    return (
        v === null ||
        v === undefined ||
        v === "" ||
        v === "[]" ||
        (Array.isArray(v) && v.length === 0)
    );
}

// از روی دو آبجکتِ کاملِ محصول، همه‌ی کلیدهای مشترک/موجود رو به دو گروه تقسیم می‌کنه:
// - numericRows: فیلدهایی که عدد هستن → برای جدول مقایسه‌ای با رنگ‌بندی برنده/بازنده
// - textRows: فیلدهایی که عدد نیستن → برای جدول مشخصات کامل پایین
function buildComparisonSections(productA, productB) {
    if (!productA || !productB) return { numericRows: [], textRows: [] };

    // ترتیب رو اول از روی FIELD_LABELS (فیلدهای شناخته‌شده) می‌سازیم تا نمایش
    // همیشه یه چیدمان قابل‌پیش‌بینی داشته باشه، بعد هر فیلد ناشناخته‌ی دیگه‌ای
    // که توی جیسون بود ولی توی این لیست نبود رو هم به انتها اضافه می‌کنیم.
    const knownKeys = Object.keys(FIELD_LABELS);
    const allKeys = new Set([
        ...knownKeys,
        ...Object.keys(productA),
        ...Object.keys(productB),
    ]);

    const numericRows = [];
    const textRows = [];

    for (const key of allKeys) {
        if (EXCLUDED_FIELDS.has(key)) continue;

        const valueA = productA[key];
        const valueB = productB[key];

        if (isEmptyValue(valueA) && isEmptyValue(valueB)) continue;

        const isNumericField =
            typeof valueA === "number" || typeof valueB === "number";

        if (isNumericField) {
            if (typeof valueA !== "number" || typeof valueB !== "number") continue; // یکی از دو محصول این فیلد رو نداره، قابل مقایسه نیست
            const lowerIsBetter = LOWER_IS_BETTER.has(key);
            let winner = null;
            if (valueA !== valueB) {
                const aIsBetter = lowerIsBetter ? valueA < valueB : valueA > valueB;
                winner = aIsBetter ? "A" : "B";
            }
            numericRows.push({ key, label: fieldLabel(key), valueA, valueB, winner });
        } else {
            if (isEmptyValue(valueA) && isEmptyValue(valueB)) continue;
            textRows.push({
                key,
                label: fieldLabel(key),
                valueA: isEmptyValue(valueA) ? "—" : String(valueA),
                valueB: isEmptyValue(valueB) ? "—" : String(valueB),
            });
        }
    }

    // فیلدهای شناخته‌شده رو طبق ترتیب تعریف‌شده جلو می‌آریم، بقیه (فیلدهای ناشناخته) همون ترتیب طبیعی می‌مونن
    const orderIndex = (k) => {
        const idx = knownKeys.indexOf(k);
        return idx === -1 ? knownKeys.length : idx;
    };
    numericRows.sort((a, b) => orderIndex(a.key) - orderIndex(b.key));
    textRows.sort((a, b) => orderIndex(a.key) - orderIndex(b.key));

    return { numericRows, textRows };
}

function ComparisonBlock({ productA, productB }) {
    if (!productA || !productB) return null;

    const nameA = productA.name;
    const nameB = productB.name;
    const { numericRows, textRows } = buildComparisonSections(productA, productB);

    return (
        <div className={styles.comparisonWrapper}>
            <div className={styles.comparisonHeader}>
                <div className={styles.comparisonHeaderSide}>
                    {productA.image_link && (
                        <img
                            className={styles.comparisonProductImage}
                            src={productA.image_link}
                            alt={nameA}
                        />
                    )}
                    <span className={styles.comparisonHeaderA}>{nameA}</span>
                </div>
                <div className={styles.comparisonHeaderSide}>
                    {productB.image_link && (
                        <img
                            className={styles.comparisonProductImage}
                            src={productB.image_link}
                            alt={nameB}
                        />
                    )}
                    <span className={styles.comparisonHeaderB}>{nameB}</span>
                </div>
            </div>

            {/* نمودار مقایسه‌ای عددی — ساید‌بای‌ساید، رنگ برنده‌ی هر ردیف فیروزه‌ای، بازنده قرمز */}
            {numericRows.length > 0 && (
                <>
                    <h4 className={styles.compareSectionTitle}>مقایسه‌ی مشخصات فنی</h4>
                    <div className={styles.comparisonChart}>
                        {numericRows.map((row) => {
                            // مقیاسِ هر ردیف مستقل از بقیه‌ست، چون واحدها خیلی متفاوتن
                            // (مثلاً AnTuTu میلیونیه ولی نرخ رفرش صددوتاییه) — اگه یه
                            // مقیاس مشترک برای همه‌ی ردیف‌ها استفاده کنیم، بارهای
                            // ردیف‌های با عدد کوچیک عملاً دیده نمی‌شن.
                            const rowMax = Math.max(row.valueA, row.valueB) || 1;

                            const barClassA =
                                row.winner === "A"
                                    ? styles.barWinner
                                    : row.winner === "B"
                                        ? styles.barLoser
                                        : styles.barNeutralA;
                            const barClassB =
                                row.winner === "B"
                                    ? styles.barWinner
                                    : row.winner === "A"
                                        ? styles.barLoser
                                        : styles.barNeutralB;
                            const valueClassA =
                                row.winner === "A"
                                    ? styles.valueWinner
                                    : row.winner === "B"
                                        ? styles.valueLoser
                                        : "";
                            const valueClassB =
                                row.winner === "B"
                                    ? styles.valueWinner
                                    : row.winner === "A"
                                        ? styles.valueLoser
                                        : "";

                            return (
                                <div key={row.key} className={styles.comparisonRow}>
                                    <div className={styles.barSideA}>
                                        <span className={`${styles.barValueA} ${valueClassA}`}>
                                            {row.valueA.toLocaleString()}
                                        </span>
                                        <div
                                            className={`${styles.bar} ${barClassA}`}
                                            style={{ width: `${(row.valueA / rowMax) * 100}%` }}
                                        />
                                    </div>
                                    <div className={styles.comparisonLabel}>{row.label}</div>
                                    <div className={styles.barSideB}>
                                        <div
                                            className={`${styles.bar} ${barClassB}`}
                                            style={{ width: `${(row.valueB / rowMax) * 100}%` }}
                                        />
                                        <span className={`${styles.barValueB} ${valueClassB}`}>
                                            {row.valueB.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* سایر مشخصات (غیرعددی) — همه‌ی فیلدهای متنیِ موجود توی دیتای محصول */}
            {textRows.length > 0 && (
                <>
                    <h4 className={styles.compareSectionTitle}>سایر مشخصات</h4>
                    <table className={styles.specTable}>
                        <thead>
                        <tr>
                            <th>ویژگی</th>
                            <th>{nameA}</th>
                            <th>{nameB}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {textRows.map((row) => (
                            <tr key={row.key}>
                                <td>{row.label}</td>
                                <td className={styles.specValue}>{row.valueA}</td>
                                <td className={styles.specValue}>{row.valueB}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}


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
                        <li className={styles.autocompleteItem}>در حال جستجو...</li>
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
        // برای مقایسه‌ی واقعی، صرفاً متن تایپ‌شده کافی نیست؛ باید کاربر واقعاً
        // یکی از پیشنهادهای dropdown رو انتخاب کرده باشه تا آبجکت کامل محصول
        // (شامل id و مشخصات) رو داشته باشیم. اگه انتخاب نشده، اینجا متوقف می‌شیم.
        if (!selectedProductA || !selectedProductB) return;

        const a = selectedProductA.name;
        const b = selectedProductB.name;

        morphTo("chat", () => {
            onCompare?.(a, b, { productA: selectedProductA, productB: selectedProductB });

            setMessages([
                {
                    id: Date.now(),
                    role: "assistant",
                    type: "comparison",
                    productA: selectedProductA,
                    productB: selectedProductB,
                },
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    type: "text",
                    text: "مقایسه این دو انجام شد ✅",
                },
            ]);
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
                    {messages.map((m) =>
                        m.type === "comparison" ? (
                            <div key={m.id} className={`${styles.comparisonBubble}`}>
                                <ComparisonBlock productA={m.productA} productB={m.productB} />
                            </div>
                        ) : (
                            <div
                                key={m.id}
                                className={m.role === "user" ? styles.userBubble : styles.aiBubble}
                            >
                                {m.text}
                            </div>
                        )
                    )}
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

                        {(productA.trim() && !selectedProductA) ||
                        (productB.trim() && !selectedProductB) ? (
                            <p className={styles.compareHint}>
                                لطفاً محصول رو از لیست پیشنهادها انتخاب کن.
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={!selectedProductA || !selectedProductB}
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
