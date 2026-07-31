import styles from "./Snackbar.module.css";

const ICONS = {
    error: "✕",
    success: "✓",
    info: "ℹ",
};


export default function Snackbar({ message, type = "error", onClose }) {
    if (!message) return null;

    return (
        <div className={`${styles.snackbar} ${styles[type] ?? styles.info}`} role="alert">
            <span className={styles.icon}>{ICONS[type] ?? ICONS.info}</span>
            <span className={styles.message}>{message}</span>
            <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="بستن پیام"
            >
                ×
            </button>
        </div>
    );
}
