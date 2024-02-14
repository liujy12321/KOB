package com.kob.backend.controller.user.account;

import com.kob.backend.service.user.account.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class LoginController {

    /*注入接口*/
    @Autowired
    private LoginService loginService;

    /*login用post方法，这样链接里看不到用户相关信息
    * get方法是明文，链接里可以看到相关信息
    * 注意此处是公开的url
    * 从post请求中拿出参数，放到一个map里
    * 从map中取出username和password
    * 调用接口
    * 调试：可以用postman，也可以在前端代码里用ajax调试（具体见前端的App.vue）*/
    @PostMapping("/user/account/token/")
    public Map<String, String> getToken(@RequestParam Map<String, String> map) throws Exception{
        String username = map.get("username");
        String password = map.get("password");
        return loginService.getToken(username, password);
    }
}
