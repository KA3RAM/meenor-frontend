
import { motion } from "framer-motion";
import styles from "./Background.module.css";

export default function Background() {
    return (
        <div className={styles.background}>

            <motion.div
                className={`${styles.orb} ${styles.blue}`}
                animate={{
                    x: [0, 180, -100, 0],
                    y: [0, -120, 80, 0],
                    scale: [1, 1.15, 0.95, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className={`${styles.orb} ${styles.cream}`}
                animate={{
                    x: [0, -150, 120, 0],
                    y: [0, 140, -80, 0],
                    scale: [1, 0.9, 1.2, 1],
                }}
                transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Noise Layer */}
            <div className={styles.noise}></div>

        </div>
    );
}