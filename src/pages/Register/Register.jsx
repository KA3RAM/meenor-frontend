
import styles from "./Register.module.css"
import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div className={styles.register_wrapper}>
            <h1 className={styles.title_reg}>ثبت‌ نام</h1>
            <p className={styles.subtitle_reg}>حساب کاربری جدید بسازید و وارد دنیای مینور شوید ✨</p>
            <form id={styles.register}>
                {/* name */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>نام</p>
                    <div className={styles["input-wrap"]}>
                        <input name="name" type="text" required />
                    </div>
                </label>


                {/* last name */}
                <label className={styles.reg_field}>
                    <p className={styles.label}> نام خانوادگی</p>
                    <div className={styles["input-wrap"]}>
                        <input type="text" name="last-name" required />
                    </div>
                </label>

                {/* username */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>نام کاربری</p>
                    <div className={styles["input-wrap"]}>
                        <input type="username" name="username" placeholder="مثلاً: ali_reza"  autocomplete="username" required />
                        
                    </div>
                </label>

                {/* email */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>ایمیل</p>
                    <div className={styles["input-wrap"]}>
                        <input type="email" name="email" placeholder="you@example.com" autocomplete="email" required />
                    </div>
                </label>

                {/* password */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>گذرواژه</p>
                    <div className={styles["input-wrap"]}>
                        <input type="password" placeholder="********" name="password" autoComplete="password" required/>
                    </div>
                </label>

                <button type="submit" className={styles.btn}>ایجاد حساب</button>
                <p className={styles.meta}>
                قبلاً حساب دارید؟{" "}
                <Link to="/login">ورود</Link>
                </p>
            </form>
        </div>
    )
}