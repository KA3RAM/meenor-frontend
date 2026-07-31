// نگاشت اسم فیلدهای بک‌اند به لیبل فارسی خوانا
const FIELD_LABELS = {
    username: "نام کاربری",
    email: "ایمیل",
    password: "گذرواژه",
    password2: "تکرار گذرواژه",
    first_name: "نام",
    last_name: "نام خانوادگی",
};

// پیام‌های رایج انگلیسیِ جنگو/DRF که بدون توجه به زبان بک‌اند، ترجمه‌ی فارسی‌شون
// همیشه نشون داده بشه. کلیدها با حروف کوچیک و بدون فاصله‌ی اضافه مقایسه می‌شن.
const KNOWN_MESSAGE_TRANSLATIONS = {
    "this field is required.": "این فیلد الزامیه.",
    "this field may not be blank.": "این فیلد نمی‌تونه خالی باشه.",
    "this field may not be null.": "این فیلد نمی‌تونه خالی باشه.",
    "a user with that username already exists.": "کاربری با این نام کاربری قبلاً ثبت‌نام کرده.",
    "user with this username already exists.": "کاربری با این نام کاربری قبلاً ثبت‌نام کرده.",
    "user with this email already exists.": "کاربری با این ایمیل قبلاً ثبت‌نام کرده.",
    "enter a valid email address.": "لطفاً یه ایمیل معتبر وارد کن.",
    "unable to log in with provided credentials.": "نام کاربری یا گذرواژه اشتباهه.",
    "no active account found with the given credentials": "نام کاربری یا گذرواژه اشتباهه.",
    "invalid token.": "نشست شما نامعتبره. دوباره وارد شو.",
    "invalid token": "نشست شما نامعتبره. دوباره وارد شو.",
    "authentication credentials were not provided.": "لطفاً ابتدا وارد حساب کاربریت شو.",
    "this password is too short. it must contain at least 8 characters.":
        "گذرواژه خیلی کوتاهه؛ باید حداقل ۸ کاراکتر باشه.",
    "this password is too common.": "این گذرواژه خیلی رایجه؛ یه گذرواژه‌ی قوی‌تر انتخاب کن.",
    "this password is entirely numeric.": "گذرواژه نباید فقط شامل عدد باشه.",
    "not found.": "موردی پیدا نشد.",
};

// یه پیام خام (فارسی یا انگلیسی) رو می‌گیره و در صورت وجود توی جدول بالا، معادل
// فارسیش رو برمی‌گردونه. اگه پیام از قبل فارسی بود (بک‌اند خودش فارسی برگردونده)،
// همون رو دست‌نخورده نگه می‌داره چون نیازی به ترجمه نداره.
function translateKnownMessage(raw) {
    if (typeof raw !== "string") return null;
    const key = raw.trim().toLowerCase();
    if (KNOWN_MESSAGE_TRANSLATIONS[key]) return KNOWN_MESSAGE_TRANSLATIONS[key];
    // اگه پیام از قبل حاوی حروف فارسی بود، یعنی بک‌اند خودش فارسی برگردونده — همونو نگه دار
    if (/[\u0600-\u06FF]/.test(raw)) return raw;
    return null;
}

// اگه پیام رو نشناختیم و نتونستیم ترجمه‌ش کنیم، به‌جای نشون‌دادن متن خام انگلیسی
// (که برای کاربر فارسی‌زبان قابل‌فهم نیست)، یه پیام عمومیِ فارسیِ مرتبط با همون فیلد می‌سازیم.
function fallbackMessage(fieldLabel) {
    return fieldLabel ? `${fieldLabel} نامعتبره.` : "این مقدار نامعتبره.";
}

function resolveFieldMessage(rawValue, fieldLabel) {
    const messages = Array.isArray(rawValue) ? rawValue : [rawValue];
    return messages
        .map((m) => translateKnownMessage(m) ?? fallbackMessage(fieldLabel))
        .join(" ");
}

/**
 * از روی خطای axios، یه پیام کاملاً فارسیِ آماده‌ی نمایش به کاربر می‌سازه —
 * صرف‌نظر از اینکه بک‌اند خودش فارسی برگردونده یا انگلیسی (پیام‌های شناخته‌شده
 * ترجمه می‌شن، پیام‌های ناشناخته هم جایگزین می‌شن با یه پیام فارسی عمومی).
 *
 * ترتیب اولویت بررسی:
 *   1) اصلاً پاسخی از سرور نیومده (قطعی اینترنت / سرور خاموش / CORS)
 *   2) بک‌اند { detail: "..." } برگردونده (رایج توی DRF برای خطاهای احراز هویت)
 *   3) بک‌اند { non_field_errors: [...] } برگردونده (رایج برای خطای لاگین اشتباه)
 *   4) خطای اعتبارسنجیِ فیلد‌به‌فیلد { username: ["..."], email: ["..."] }
 *   5) در نهایت، بر اساس status code یه پیام عمومی نشون می‌ده
 */
export function getErrorMessage(err) {
    if (!err?.response) {
        return "ارتباط با سرور برقرار نشد. اتصال اینترنتت رو چک کن و دوباره امتحان کن.";
    }

    const { status, data } = err.response;

    if (typeof data?.detail === "string") {
        return translateKnownMessage(data.detail) ?? fallbackMessage();
    }

    if (data?.non_field_errors) {
        return resolveFieldMessage(data.non_field_errors, null);
    }

    if (data && typeof data === "object") {
        const fieldMessages = Object.entries(data)
            .map(([field, value]) => {
                const label = FIELD_LABELS[field] ?? field;
                const message = resolveFieldMessage(value, label);
                return message ? `${label}: ${message}` : null;
            })
            .filter(Boolean);

        if (fieldMessages.length > 0) {
            return fieldMessages.join(" — ");
        }
    }

    switch (status) {
        case 400:
            return "اطلاعات وارد‌شده نامعتبره. لطفاً دوباره بررسی کن.";
        case 401:
            return "نام کاربری یا گذرواژه اشتباهه.";
        case 403:
            return "اجازه‌ی انجام این کار رو نداری.";
        case 404:
            return "سرویس مورد نظر پیدا نشد.";
        case 429:
            return "درخواست‌های زیادی فرستادی. کمی صبر کن و دوباره امتحان کن.";
        case 500:
        case 502:
        case 503:
            return "مشکلی توی سرور پیش اومده. لطفاً بعداً دوباره امتحان کن.";
        default:
            return "یه خطای غیرمنتظره پیش اومد. لطفاً دوباره امتحان کن.";
    }
}
