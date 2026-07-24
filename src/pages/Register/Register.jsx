
import styles from "./Register.module.css"
import {Link, useNavigate} from "react-router-dom";
import {useRef} from "react";
import {login_send_data_token, register_send_data_axios} from "../../services/Axios";

export default function Register() {
    const navigate = useNavigate();
    const goToHome = () => {
        navigate("/");

    }

    const username_ref = useRef(null);
    const firstname_ref = useRef(null);
    const lastname_ref = useRef(null);
    const email_ref = useRef(null);
    const password_ref = useRef(null);


    const fetch_send_input_data = async () => {
        try {
            let data_register ={
                first_name: firstname_ref.current.value,
                last_name: lastname_ref.current.value,
                username: username_ref.current.value,
                email: email_ref.current.value,
                password: password_ref.current.value,

            }
            let data_login ={
                username: username_ref.current.value,
                password: password_ref.current.value,
            }
            await register_send_data_axios(data_register);


            await fetch_get_token(data_login);

        } catch (err) {
            console.error("An error occurred:", err);
        }


    };

    const fetch_get_token = async (input_pass_and_user) => {
        try {
            let { data: token } = await login_send_data_token(input_pass_and_user);
            localStorage.setItem("token", token.token);
            goToHome()


        } catch (err) {
            console.error("An error occurred:", err);
        }


    };

    return (
        <div className={styles.register_wrapper}>
            <h1 className={styles.title_reg}>ثبت‌ نام</h1>
            <p className={styles.subtitle_reg}>حساب کاربری جدید بسازید و وارد دنیای مینور شوید ✨</p>
            <form id={styles.register}>
                {/* name */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>نام</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={firstname_ref} name="name" type="text" required />
                    </div>
                </label>


                {/* last name */}
                <label className={styles.reg_field}>
                    <p className={styles.label}> نام خانوادگی</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={lastname_ref} type="text" name="last-name" required />
                    </div>
                </label>

                {/* username */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>نام کاربری</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={username_ref} type="username" name="username" placeholder="مثلاً: ali_reza"  autoComplete="username" required />
                        
                    </div>
                </label>

                {/* email */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>ایمیل</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={email_ref}  type="email" name="email" placeholder="you@example.com" autoComplete="email" required />
                    </div>
                </label>

                {/* password */}
                <label className={styles.reg_field}>
                    <p className={styles.label}>گذرواژه</p>
                    <div className={styles["input-wrap"]}>
                        <input ref={password_ref} type="password" placeholder="********" name="password" autoComplete="password" required/>
                    </div>
                </label>

                <button type="submit" className={styles.btn} onClick={(e) => {
                    e.preventDefault();
                    fetch_send_input_data();
                }}>ایجاد حساب</button>
                <p className={styles.meta}>
                قبلاً حساب دارید؟{" "}
                <Link to="/login">ورود</Link>
                </p>
            </form>
        </div>
    )
}