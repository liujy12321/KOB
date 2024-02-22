/* 
全局信息：需要存当前的用户是谁
主要会存以下信息:
state：存用户的信息，jwt token以及login状态
getters：一般用不到
mutations：修改数据，辅助函数updateUser：将存入的user信息放入state中；updateToken：将token的信息放入state中; logout：登出
actions：  
    登录login：用ajax；用户名和密码从data里传，登录成功的话需要将token存下来，actions里调用mutations的函数需要用commit
    动态获取用户信息getinfo：ajax； 
*/
import $ from 'jquery'

export default {
    state: {
        id: "",
        username: "",
        image: "",
        token: "",
        is_login: false,
        
        /* 
            当前是否在获取信息当中，用于优化网页刷新时会一闪而过登录页面
            因为每次刷新都会闪过登录页面，因此优化一下，先让登录页面不展示出来
            方法：
                全局变量中state里定义pulling_info，表示当前是否正在云端拉取信息，先为true
                mutations里加入辅助函数updatePullingInfo(state, pulling_info)：将state中的pulling_info更新为传入的pulling_info
                在UserAccountLoginView的template里的contentField加入v-if：只有!$store.state.user.pulling_info（没拉取信息）的时候，才展示，拉取信息的时候不展示
                当token过期了，本地没有token或成功获得token后，意味着无法拉取信息或信息拉取结束，所以三种情况下store里pulling_info都变为false
                navbar：当没有拉取信息（!$store.state.user.pulling_info）的时候，再去显示登录信息
        */
        pulling_info: true, 
    },
    getters: {
    },
    mutations: {
        updateUser(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.image = user.image;
            state.is_login = user.is_login;
        },
        updateToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.id = "";
            state.username = "";
            state.image = "";
            state.token = "";
            state.is_login = false;
        },
        updatePullingInfo(state, pulling_info) {
            state.pulling_info = pulling_info;
        }
    },
    actions: {
        login(context, data) {
            $.ajax({
                url: "http://localhost:3000/user/account/token/",
                type: "post",
                data: {
                  username: data.username,
                  password: data.password,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        /* 
                            登录信息持久化：刷新后不会退出登录
                            方法：
                                将token存到local storage中
                                由于每次刷新的时候不会自动取出token，所以同时在login的时候需要在local storage中判断是否有token
                                如果存在，则取出并判断是否过期，没过期则不需要重新登录，直接跳转到首页
                            localStorage：字典，映射到resp中的token中
                            登出logout的时候需要去除
                         */
                        localStorage.setItem("jwt_token", resp.token);
                        context.commit("updateToken", resp.token);
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                },
                error(resp) {
                  data.error(resp);
                }
            });
        },

        getinfo(context, data) {
            $.ajax({
                url: "http://localhost:3000/user/account/info/",
                type: "get",
                /* 这里需要传入一个header，不需要传数据
                header需要传入到Authorization里
                注意这里Bearer后面有一个空格 */
                headers: {
                    Authorization: "Bearer " + context.state.token,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        context.commit("updateUser", {
                            ...resp, //解构resp，包括state里的东西，放到当前对象里
                            is_login: true,
                        }); //更新用户信息
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                    
                },
                error(resp) {
                    data.error(resp);
                }
            })
        },

        logout(context) {
            localStorage.removeItem("jwt_token");
            context.commit("logout");
        }
    },
    modules: {
    }
}