import axios from "axios";

/*
  آدرس بک‌اند از متغیر محیطی خونده میشه، نه هاردکد.
  - توی توسعه‌ی محلی: فایل .env.development.local بساز با:
      REACT_APP_API_URL=http://127.0.0.1:8000
  - توی پروداکشن (سرور): فایل .env.production.local بساز با:
      REACT_APP_API_URL=http://87.107.153.230
  بعد از هر تغییر توی env، حتماً دوباره `npm run build` بگیر چون CRA
  متغیرها رو موقع build داخل کد "می‌پزه" (bake می‌کنه)، نه موقع اجرا.
*/
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// توکن رو به‌صورت خودکار به هر درخواست اضافه می‌کنه، دیگه لازم نیست
// توی هر تابع جدا خط "authorization" رو بنویسیم.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.authorization = `Token ${token}`;
    }
    return config;
});

/* -------------------------------------------------------------------------- */
/*                                   Chatbot                                  */
/* -------------------------------------------------------------------------- */

// توجه: برای کاهش هزینه، بک‌اند اینجا دیگه مشخصات کامل گوشی رو برنمی‌گردونه —
// فقط یه نسخه‌ی سبک از هر نتیجه شامل id، name و image_link. برای گرفتن
// مشخصات کامل (بعد از اینکه کاربر یکی از نتایج رو انتخاب کرد)، باید id رو
// به get_phone_details داد.
export const CHB_send_input_good = (input) => {
    if (input.length > 0) {
        return api.get(`/chatbot/search_phone/`, { params: { search: input } });
    }
};

export const creat_static_good_cpu = (input) => {
    return api.post(`/chatbot/register_cpu/`, input);
};

export const creat_static_good_gpu = (input) => {
    return api.post(`/chatbot/register_gpu/`, input);
};

export const creat_static_good_phone_details = (input) => {
    return api.post(`/chatbot/register_phone/`, input);
};

export const get_phone_details = (input) => {
    return api.get(`/chatbot/get_phone/${input}/`);
};

export const add_to_wishlist_chatBot = (input) => {
    return api.get(`/chatbot/wishlist_phone/${input}/`);
};

export const delete_wishlist_chatBot = (input) => {
    return api.delete(`/chatbot/wishlist_phone/${input}/`);
};

export const check_if_wishlist_chatBot = (input) => {
    return api.get(`/chatbot/is_wishlisted/${input}/`);
};

export const get_all_wishlist_phone = () => {
    return api.get(`/chatbot/wishlisted_phones/`);
};

export const like_phone_chatbot = (input) => {
    return api.get(`/chatbot/like_phone/${input}/`);
};

export const unlike_phone_chatbot = (input) => {
    return api.delete(`/chatbot/like_phone/${input}/`);
};

export const check_if_like_chatbot = (input) => {
    return api.get(`/chatbot/is_liked/${input}/`);
};

export const ai_response = (input) => {
    return api.post(`/chatbot/ai_chat/`, input);
};

/* -------------------------------------------------------------------------- */
/*                                   Account                                  */
/* -------------------------------------------------------------------------- */

export const register_send_data_axios = (input) => {
    return api.post(`/account/register/`, input);
};

export const login_send_data_token = (input) => {
    return api.post(`/account/login/`, input);
};

export const get_user_profile = () => {
    return api.get(`/account/profile/`);
};

export const edit_user_profile = (f_name, l_name, username, image) => {
    const formData = new FormData();
    formData.append("first_name", f_name);
    formData.append("last_name", l_name);
    formData.append("username", username);
    if (image) formData.append("profile_pic", image);
    return api.put(`/account/update/`, formData);
};

export const edit_user_profile_password = (input_edit_data) => {
    return api.put(`/account/password_update/`, input_edit_data);
};

export const user_profile = () => {
    return api.get(`/account/user_profile/`);
};

// پروفایل عمومیِ یه کاربر دلخواه (نه فقط خودِ کاربر لاگین‌شده) — برای نشون‌دادن
// اسم/عکس نویسنده‌ی هر پست یا کامنت، با آیدی همون کاربر (فیلد "user" که توی
// جواب get_post/get_comments برمی‌گرده).
export const get_poster_profile = (input) => {
    return api.get(`/account/get_profile/${input}/`);
};

/* -------------------------------------------------------------------------- */
/*                                  نقدنگار                                   */
/* -------------------------------------------------------------------------- */

export const creat_post = (phone, image, content) => {
    const formData = new FormData();
    formData.append("phone", phone);
    if (image) formData.append("image", image);
    formData.append("content", content);
    return api.post(`/naghdnegar/create_post/`, formData);
};

export const feed_post = () => {
    return api.get(`/naghdnegar/feed/`);
};

export const get_post = (input) => {
    return api.get(`/naghdnegar/get_post/${input}/`);
};

// دو تا پارامتر جدا می‌گیره: آیدی پست، و مقدار واکنش ("like" یا "dislike").
export const reaction_change_post = (postId, reaction) => {
    return api.post(`/naghdnegar/react_post/${postId}/`, { reaction });
};

export const filter_post = (input) => {
    return api.get(`/naghdnegar/filter_post/${input}/`);
};

export const get_short_phone = (input) => {
    return api.get(`/naghdnegar/get_short_phone/${input}/`);
};

export const get_comment = (input) => {
    return api.get(`/naghdnegar/get_comments/${input}/`);
};

export const set_comment = (postId, input) => {
    return api.post(`/naghdnegar/comment/${postId}/`, input);
};

export const search_post = (input) => {
    return api.get(`/naghdnegar/search_post/`, { params: { search: input } });
};

export const save_post = (input) => {
    return api.get(`/naghdnegar/save_post/${input}/`);
};

export const unsave_post = (input) => {
    return api.delete(`/naghdnegar/save_post/${input}/`);
};

export const check_if_saved_post = (input) => {
    return api.get(`/naghdnegar/is_saved/${input}/`);
};

export const get_all_saved_posts = (input) => {
    return api.get(`/naghdnegar/saved_posts/`);
};

export const get_users_posts = (input) => {
    return api.get(`/naghdnegar/user_posts/`);
};

export const delete_post = (input) => {
    return api.delete(`/naghdnegar/delete_post/${input}/`);
};
