import {Outlet} from "react-router-dom"
import Footer from "../components/Footer/Footer"
import Background from "../components/Background/Background"
import Navbar from "../components/Navbar/Navbar"

import styles from "./MainLayout.module.css"

export default function MainLayout () {
    return(
        <>
            <Background />
            
            <main className={styles.container}>
                <Navbar/>
                <Outlet/>
                <Footer/>
            </main>
            
        </>
    )
}