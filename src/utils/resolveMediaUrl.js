// همون آدرس پایه‌ای که همه‌جای Axios.js هاردکد شده — بک‌اند بعضی‌وقتا مسیر عکس‌ها رو
// نسبی برمی‌گردونه (مثلاً "posts/images/..."), پس باید این آدرس رو جلوش بچسبونیم
// وگرنه مرورگر می‌ره دنبال این مسیر روی آدرس خودِ فرانت که وجود نداره.
const API_ORIGIN = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
export function resolveMediaUrl(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path; // از قبل کامل بوده
    return `${API_ORIGIN}/${path.replace(/^\/+/, "")}`;
}

