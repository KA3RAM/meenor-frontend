import styles from "./Profile.module.css"
import image2 from "../../assets/images/lock.jpeg"
import {
    add_to_wishlist_chatBot, edit_user_profile, edit_user_profile_password,
    get_all_wishlist_phone,
    get_user_profile,
    login_send_data_token, user_profile
} from "../../services/Axios";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";


function DefaultUserIcon() {
    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#faf9f9" style={{width: "40%", height: "40%"}}>
                <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#ffffff"></path>
                <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#ffffff"></path>
            </svg>
        </div>
    )
}



export default function Profile() {


    const navigate = useNavigate();
    const goToRegister = () => {
        navigate("/register");

    }
    if (!localStorage.getItem("token")) {
        navigate("/register");
    }



    const [listOfWishlist, setWishlist] = useState([])
    const [usersInfo, setUsersInfo] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [editUserInfoName, setEditUserInfoName] = useState({
        first_name: ""
    });
    const [editUserInfoLastName, setEditUserInfoLastName] = useState({
        last_name: ""
    });
    const [editUserInfoUserName, setEditUserInfoUserName] = useState({
        username: ""
    })
    const [editUserInfoPassWord, setEditUserInfoPassWord] = useState({
        password: ""
    })

    // --- استیت‌های مربوط به عکس پروفایل (فقط UI) ---
    const [profileImagePreview, setProfileImagePreview] = useState(null)
    const fileInputRef = useRef(null)

    const handleAvatarClick = () => {
        if (isEditing) fileInputRef.current?.click()
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setProfileImagePreview(URL.createObjectURL(file))
    }


    const removeToken = () => {
        localStorage.removeItem("token");
        goToRegister()
    }

    const fetch_put_user_info = async () => {
        try{
            const first_name= editUserInfoName.first_name
            const last_name = editUserInfoLastName.last_name
            const username= editUserInfoUserName.username
            const image = fileInputRef.current?.files[0]
            let data_profile_password ={
                password: editUserInfoPassWord.password
            }

            let {data : data} = await edit_user_profile(first_name,last_name,username,image)
            if (editUserInfoPassWord.password?.length > 0){
                try{
                    let {data: dataPassword} = await edit_user_profile_password(data_profile_password)
                    console.log(dataPassword + "" + "Soroush Is God")
                }
                catch (err){
                    console.error("STATUS:", err.response?.status);
                    console.error("ERROR DATA:", err.response?.data);
                    console.error("ERROR:", err);
                }

            }
            console.log(data)

            setUsersInfo(data)

            setIsEditing(false)


        }
        catch(err){
            console.error("STATUS:", err.response?.status);
            console.error("ERROR DATA:", err.response?.data);
            console.error("ERROR:", err);            }
    }

    useEffect(() => {

        const fetch_get_wishlist_laptops = async () => {
            try {
                let { data: wishlists } = await get_all_wishlist_phone();
                setWishlist(wishlists);
                console.log(wishlists);


            } catch (err) {
                console.error("An error occurred:", err);
            }


        };

        const fetch_get_users_data = async () => {
            try {
                let { data: usersInfo} = await user_profile();
                setUsersInfo(usersInfo);
                console.log(usersInfo);

                setEditUserInfoName({
                    first_name: usersInfo.first_name
                });
                setEditUserInfoLastName({
                    last_name: usersInfo.last_name,
                })
                setEditUserInfoUserName({
                    username: usersInfo.username
                })
            }

            catch (err) {
                console.error("An error occurred:", err);
            }
        }
        fetch_get_wishlist_laptops();
        fetch_get_users_data();

    }, []);


    return (
        <div className={styles.profile_wrapper}>
            <div className={`${styles.top_profile_card} ${isEditing ? styles.editing : ""}`}>
                <div
                    className={styles.profile_picture_wrapper}
                    onClick={handleAvatarClick}
                    style={{ cursor: isEditing ? "pointer" : "default" }}
                >
                    {profileImagePreview || usersInfo.profile_pic ? (
                        <img
                            className={styles.profile_picture}
                            src={
                                profileImagePreview ||
                                `http://127.0.0.1:8000${usersInfo.profile_pic}`
                            }
                            alt="profile"
                        />
                    ) : (
                        <DefaultUserIcon />
                    )}

                    {isEditing && (
                        <div className={styles.avatar_overlay}>
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                                <path d="M9 2l-1.5 2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-3.5L15 2H9zm3 6a5 5 0 110 10 5 5 0 010-10z"/>
                            </svg>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                </div>

                {
                isEditing ?

                    <div className={styles.account_info_wrapper}>
                        <input className={styles.account_info_input}
                                value={editUserInfoName.first_name}
                                onChange={(e) => {
                                    setEditUserInfoName({
                                        ...editUserInfoName,
                                        first_name: e.target.value,
                                    });
                                }}>
                        </input>
                        <input className={styles.account_info_input}
                                value={editUserInfoLastName.last_name}
                                onChange={(e) => {
                                    setEditUserInfoLastName({
                                        ...editUserInfoLastName,
                                        last_name: e.target.value
                                    });
                                }}>
                        </input>
                        <input className={styles.account_info_input} value={editUserInfoUserName.username}
                                onChange={(e) => {
                                    setEditUserInfoUserName({
                                        ...editUserInfoUserName,
                                        username: e.target.value
                                    });
                                }}>
                        </input >

                        <input
                            className={styles.account_info_input}
                            placeholder="......"
                            value={editUserInfoPassWord.password ?? ""}
                            onChange={(e) => {
                                setEditUserInfoPassWord({
                                    password: e.target.value || null
                                });
                            }}
                        />
                        <button onClick={() => {
                            fetch_put_user_info()
                        }}>ویرایش</button>

                        <button
                            className={styles.logout_button}
                            onClick={() => {
                                removeToken()
                            }}
                        >
                            خروج از حساب
                        </button>
                    </div>

                :

                    <div className={styles.account_info_wrapper}>
                        <p className={styles.account_info}>{usersInfo.first_name} {usersInfo.last_name}</p>
                        <p className={styles.account_info}>@{usersInfo.username}</p>
                        <button onClick={() => (setIsEditing(true))}>ویرایش</button>
                            <button
                            className={styles.logout_button}
                            onClick={() => {
                                removeToken()
                            }}
                        >
                            خروج از حساب
                        </button>
                    </div>
                }


            </div>



            <div className={styles.buttom_profile_card}>
                <p className={styles.whishlisttag}>علاقه مندی ها</p>

                <div className={styles.whishlist_card_wrapper}>

                    {listOfWishlist.map((item, index) => (
                        <div className={styles.whishlist_card}  key={index}>
                            <div className={styles.product_img_wrapper}>
                                <img
                                className={styles.product_img}
                                src={item.image_link || image2}
                                alt={`${item.brand ?? ""} ${item.model ?? ""}`.trim()}
                            />
                            </div>
                            <p>{item.name}</p>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}