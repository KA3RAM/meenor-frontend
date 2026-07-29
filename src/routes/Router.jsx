import {BrowserRouter, Routes, Route} from "react-router-dom"

/* -------------------------------------------------------------------------- */
/*                                    صفحات                                   */
/* -------------------------------------------------------------------------- */
import MainLayout from "../layouts/MainLayout"
import Home from "../pages/Home/Home"
import AboutUs from "../pages/AboutUs/AboutUs"
import Contact from "../pages/Contact/Contact"
import Profile from "../pages/Profile/Profile"



import AuthLayout from "../layouts/AuthLayout"
import Login from "../pages/Login/Login"
import Register from "../pages/Register/Register"


import ChatLayout from "../layouts/ChatLayout"
import Chat from "../pages/Chat/Chat"
import Post from "../pages/post/Post"
import Naghdnegar from "../pages/naghdnegar/Naghdnegar"
import Likes from "../pages/Likes/Likes"
import Saves from "../pages/Saves/Saves"
import Search from "../pages/Search/Search"

export default function Router() {
    return(
        <BrowserRouter>
        
            <Routes>

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} /> 
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={<Profile />} /> 
                </Route> 

                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<ChatLayout />}>
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/naghdnegar" element={<Naghdnegar />} />
                    <Route path="/post" element={<Post />} />
                    <Route path="/likes" element={<Likes />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/bookmarks" element={<Saves />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}