package com.kob.backend.controller.user;

/*
spring boot 里有好多层：
pojo层：将数据库中的table转化为class，可以定义属性
mapper/Dao层：对pojo层中的操作转化为sql语句
service层：运用mapper操作，实现具体逻辑
controller层：将前端请求以及参数接收，选择调用哪个service，结果再返回给前端（调度service）
*/

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserMapper userMapper;

    // 查询所有用户
    @GetMapping("/user/all/")
    public List<User> getAll() {
        return userMapper.selectList(null);
    }

    /*
    根据id查用户, PathVariable表示传入的参数
    条件查找：querywrapper：将查询操作封装，之后usermapper用selectOne调用
            比如查询id=userId的用户 -> queryWrapper.eq("id", userId)
    范围查询：比如查询id>=2且id<=3的用户 -> queryWrapper.ge（“id”，2）.le（“id”，3）
    */
    @GetMapping("/user/{userId}/")
    public User getUser(@PathVariable int userId) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", userId);
        return userMapper.selectOne(queryWrapper);
    }

    /*
    添加user：一般用post方法，这里主要是为了调试用get
    数据库中插入user：insert创建好的user
    PasswordEncoder:密码不能是明文（未加密的），所以要用passwordEncoder先加密后创建用户
    数据库存的就是passwordEncoder之后的String
    */
    @GetMapping("/user/add/{userId}/{username}/{password}/")
    public String addUser(
            @PathVariable int userId,
            @PathVariable String username,
            @PathVariable String password) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(userId, username, encodedPassword);
        userMapper.insert(user);
        return "Add User Successfully";
    }

    /*
    删除用户：一般也用post，这里也是调试目的用get
    */
    @GetMapping("user/delete/{userId}/")
    public String deleteUser(@PathVariable int userId) {
        userMapper.deleteById(userId);
        return "Delete User Successfully";
    }
}
