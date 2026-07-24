import {Outlet} from "react-router-dom"
import Footer from "../components/Footer/Footer"
import Background from "../components/Background/Background"
import Navbar from "../components/Navbar/Navbar"

import styles from "./AuthLayout.module.css"


export default function AuthLayout() {
    return(
        <>
            <Background />

            <main className={styles.containerAuth}>
                <Outlet/>
            </main>
        </>
    )
}