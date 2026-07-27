    import styles from "./Profile.module.css"
    import image from "../../assets/images/star-wars-the-mandalorian-and-grogu-movie-7l.jpg"
    import image2 from "../../assets/images/Lock.jpg"
    import {
    add_to_wishlist_chatBot, edit_user_profile, edit_user_profile_password,
    get_all_wishlist_laptops,
    get_user_profile,
    login_send_data_token
} from "../../services/Axios";
    import {useEffect, useRef, useState} from "react";



    export default function Profile() {

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




        const fetch_put_user_info = async () => {
            try{
                let data_profile = {
                    first_name: editUserInfoName.first_name,
                    last_name: editUserInfoLastName.last_name,
                    username: editUserInfoUserName.username
                }
                let data_profile_password ={
                    password: editUserInfoPassWord.password
                }

                let {data : data} = await edit_user_profile(data_profile)
                if(editUserInfoPassWord.length > 0){
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
                    let { data: wishlists } = await get_all_wishlist_laptops();
                    setWishlist(wishlists);
                    console.log(wishlists);


                } catch (err) {
                    console.error("An error occurred:", err);
                }


            };

            const fetch_get_users_data = async () => {
                try {
                    let { data: usersInfo} = await get_user_profile();
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
                    <div className={styles.profile_picture_wrapper}>
                        <img className={styles.profile_picture} src={image} alt="profile" />
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
                        </div>

                    :

                        <div className={styles.account_info_wrapper}>
                            <p className={styles.account_info}>{usersInfo.first_name} {usersInfo.last_name}</p>
                            <p className={styles.account_info}>@{usersInfo.username}</p>
                            <button onClick={() => (setIsEditing(true))}>ویرایش</button>
                        </div>
                    }


                </div>
                <div className={styles.buttom_profile_card}>
                    <p className={styles.whishlisttag}>علاقه مندی ها</p>

                    <div className={styles.whishlist_card_wrapper}>

                        {listOfWishlist.map((item, index) => (
                            <div className={styles.whishlist_card}  key={index}>
                                <div className={styles.product_img_wrapper}>
                                    <img className={styles.product_img} src={image2} alt="product_name" />
                                </div>
                                <p>{item.brand} {item.model}</p>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        )
    }