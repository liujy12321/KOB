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
            context.commit("logout");
        }
    },
    modules: {
    }
}