package com.kob.backend.service.impl.user.account;

import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.JwtUtil;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.service.user.account.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl implements LoginService {

    /*验证用户是否登录：需要用到AuthenticationManager API*/
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Map<String, String> getToken(String username, String password) throws Exception {
        /*需要先对用户名和密码进行封装，因为在database里存的不是明文
         * 使用UsernamePasswordAuthenticationToken API封装成一个UsernamePasswordAuthenticationToken类
         * 这样这个类里存的就不是明文，是密文*/
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);

        /*验证加密后是否可以登录
         * 如果登录失败，会自动处理*/
        Map<String, String> map = new HashMap<>();
        try {
            Authentication authenticate = authenticationManager.authenticate(authenticationToken);

            /*登录成功后，取出用户*/
            UserDetailsImpl loginUser = (UserDetailsImpl) authenticate.getPrincipal();
            User user = loginUser.getUser();

            /*将UserId封装成Jwt token*/
            String jwt = JwtUtil.createJWT(user.getId().toString());


            /*返回结果，并将token放入*/
            map.put("error_message", "success");
            map.put("token", jwt);
            return map;
        } catch (AuthenticationException e) {
            map.put("error_message", e.toString());
            return map;
        }
    }
}

