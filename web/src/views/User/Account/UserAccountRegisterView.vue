<template>
    <ContentField>
        <!-- 
            和登录页面基本一样
            不同的地方：
                加了一个确认密码
                触发函数：login变为register
         -->
        <div class="row justify-content-md-center">
            <div class="col-3">
                <form @submit.prevent="register">
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input v-model="username" type="text" class="form-control" id="username" aria-describedby="Please enter the Username">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input v-model="password" type="password" class="form-control" id="password" aria-describedby="Please enter the Password">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Confirm Password</label>
                        <input v-model="confirmedPassword" type="password" class="form-control" id="confirmedPassword" aria-describedby="Please re-enter the Password">
                    </div>
                    <div class="error-message">{{ error_message }}</div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </ContentField>
</template>

<script>
import ContentField from '../../../components/ContentField.vue' //在account文件夹下，所以多了一层目录
import { ref } from 'vue' // 引入变量 
/* 
    关于什么时候加大括号：export后面如果有default -> 不用加；
    export后面没有default -> 加；
*/
import router from '../../../router/index'
import $ from 'jquery'

export default {
    components: {
        ContentField
    },
    /* setup函数：包含变量以及触发函数 */
    setup() {
        let username = ref('');
        let password = ref('');
        let confirmedPassword = ref('');
        let error_message = ref('');

        const register = () => {
            /* ajax访问后端api，不会修改state的值，所以不放到user.js里；要修改state，才需要放到user里 */
            $.ajax({
                url: "http://localhost:3000/user/account/register/",
                type: "post",
                /* 
                    data：将后端需要的数据传过去
                    通过查看register controller来确认data里的需要的数据
                 */
                data: {
                    username: username.value,
                    password: password.value,
                    confirmedPassword: confirmedPassword.value,
                },

                /* 
                    字典：关键字里的字符串可以把引号去掉；关键字对应的值是一个函数：可以去掉function简写
                    本来是："success": function(resp)
                    简写：success(resp)
                 */
                /* 
                    若注册成功，则直接跳转到登录页面
                    若失败，则显示错误信息
                 */
                success(resp) {
                    if (resp.error_message === "success") {
                        router.push({name: "user_account_login"});
                    } else {
                        error_message.value = resp.error_message;
                    }
                },
            });
        }

        return {
            username,
            password,
            confirmedPassword,
            error_message,
            register,
        }
    }
}
</script>

<style scoped>
/* 按钮：宽度设为100%，错误信息显示红色 */
button {
    width: 100%;
}
div.error-message {
    color: red;
}
</style>