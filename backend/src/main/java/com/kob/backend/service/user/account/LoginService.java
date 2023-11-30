package com.kob.backend.service.user.account;

import java.util.Map;

/*一般写代码就在三个地方写：controller，service里的interface和service里的implementation
* controller：调用service里的interface
* service：写interface和implementation*/
public interface LoginService {

    /*所有api都会返回一个json（map）
    * 实现login接口：需要username和password*/
    public Map<String, String> getToken(String username, String password) throws Exception;
}
