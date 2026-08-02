import { useEffect, useState } from "react";
import { get_poster_profile } from "../services/Axios";

// کش ساده و درون‌حافظه‌ای، بین همه‌ی جاهایی که از این هوک استفاده می‌کنن مشترکه —
// اگه ۱۰ تا پست/کامنت از یه کاربر باشه، پروفایلش فقط یه‌بار گرفته می‌شه، نه ۱۰ بار.
const userProfileCache = new Map();
// اگه یه ریکوئست برای یه userId در حال رفتنه، همون Promise رو به بقیه هم بده
// تا وقتی چند تا PostCard همزمان مونت می‌شن، به تعداد اونا ریکوئست تکراری نره.
const inFlightRequests = new Map();

/**
 * پروفایل عمومی یه کاربر (اسم، نام‌خانوادگی، username، عکس پروفایل) رو با آیدیش می‌گیره.
 * @param {number|string|null|undefined} userId
 * @returns {object|null} پروفایل کاربر، یا null تا وقتی هنوز نیومده/موجود نباشه
 */
export function useUserProfile(userId) {
    const [profile, setProfile] = useState(() =>
        userId ? userProfileCache.get(userId) ?? null : null
    );

    useEffect(() => {
        if (!userId) {
            setProfile(null);
            return;
        }

        if (userProfileCache.has(userId)) {
            setProfile(userProfileCache.get(userId));
            return;
        }

        let cancelled = false;

        let request = inFlightRequests.get(userId);
        if (!request) {
            request = get_poster_profile(userId)
                .then(({ data }) => {
                    userProfileCache.set(userId, data);
                    return data;
                })
                .finally(() => {
                    inFlightRequests.delete(userId);
                });
            inFlightRequests.set(userId, request);
        }

        request
            .then((data) => {
                if (!cancelled) setProfile(data);
            })
            .catch((err) => {
                if (!cancelled) console.error("خطا در گرفتن پروفایل کاربر:", err);
            });

        return () => {
            cancelled = true;
        };
    }, [userId]);

    return profile;
}
