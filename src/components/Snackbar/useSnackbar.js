import { useCallback, useRef, useState } from "react";

const DEFAULT_DURATION_MS = 4500;

// یه هوک سبک برای مدیریت یه اسنک‌بار در هر لحظه.
// هر بار showSnackbar صدا زده بشه، تایمر قبلی (اگه بود) پاک می‌شه و از نو شروع می‌شه —
// یعنی اگه پشت‌سرهم چند تا خطا بیاد، همیشه آخرین پیام دیده می‌شه و زودتر از موعد بسته نمی‌شه.
export function useSnackbar() {
    const [snackbar, setSnackbar] = useState(null); // { message, type } | null
    const timerRef = useRef(null);

    const closeSnackbar = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setSnackbar(null);
    }, []);

    const showSnackbar = useCallback(
        (message, type = "error", duration = DEFAULT_DURATION_MS) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            setSnackbar({ message, type });
            timerRef.current = setTimeout(() => {
                setSnackbar(null);
            }, duration);
        },
        []
    );

    return { snackbar, showSnackbar, closeSnackbar };
}
