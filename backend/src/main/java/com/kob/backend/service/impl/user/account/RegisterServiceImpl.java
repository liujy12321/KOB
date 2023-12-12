package com.kob.backend.service.impl.user.account;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import com.kob.backend.service.user.account.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RegisterServiceImpl implements RegisterService {
    /*注册接口的实现*/

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public Map<String, String> register(String username, String password, String confirmedPassword) {
        Map<String, String> map = new HashMap<>();

        /*如果用户名为空，返回用户名不能为空的信息，并放入map*/
        if (username == null) {
            map.put("error_message", "username cannot be empty");
            return map;
        }

        /*如果密码或确认密码为空，返回密码不能为空的信息，并放入map*/
        if (password == null || confirmedPassword == null) {
            map.put("error_message", "password cannot be empty");
            return map;
        }

        /*删掉用户名首尾的空白字符*/
        username = username.trim();

        /*如果此时用户名长度为0，返回用户名不能为空的信息，并放入map*/
        if (username.length() == 0) {
            map.put("error_message", "username cannot be empty");
            return map;
        }

        /*如果密码长度为0或确认密码长度为0，返回密码不能为空的信息，并放入map*/
        if (password.length() == 0 || confirmedPassword.length() == 0) {
            map.put("error_message", "password cannot be empty");
            return map;
        }

        /*如果用户名长度超过100，返回错误信息，并放入map*/
        if (username.length() > 100) {
            map.put("error_message", "the length of username cannot be larger than 100");
            return map;
        }

        /*如果密码或确认密码长度超过100，返回错误信息，并放入map*/
        if (password.length() > 100 || confirmedPassword.length() > 100) {
            map.put("error_message", "the length of password cannot be larger than 100");
            return map;
        }

        /*如果密码与确认密码不相同，返回错误信息，并放入map*/
        if (!password.equals(confirmedPassword)) {
            map.put("error_message", "the password is not equal to confirmed password");
            return map;
        }

        /*如果用户名重复，需要到数据库中去查询：QueryWrapper
        * QueryWrapper条件：寻找相等的用户名，并用list将找到的相同用户名存起来
        * 若存在这个list，则返回用户名不能重复的信息，并放入map*/
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        List<User> users = userMapper.selectList(queryWrapper);
        if (!users.isEmpty()) {
            map.put("error_message", "username already existed");
            return map;
        }

        /* 以上条件都通过，则可以把用户存到数据库中，需要把密码加密
         * 头像：头像地址
         * 创建user：根据pojo层，user需要传入Id，username，password，image
         * 因为id是自增的，所以null就行
         * 将username，加密后的密码和头像地址传入创建user
         * 创建成功后加入到数据库UserMapper中，并返回成功的信息*/
        String encodedPassword = passwordEncoder.encode(password);
        String image = "https://cdn.acwing.com/media/user/profile/photo/139785_lg_096664c856.jpg";
        User user = new User(null, username, encodedPassword, image);
        userMapper.insert(user);

        map.put("error_message", "success");
        return map;
    }
}
