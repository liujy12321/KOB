package com.kob.backend.controller.user.account;

import com.kob.backend.service.user.account.InfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class InfoController {
    /*注入接口*/
    @Autowired
    private InfoService infoService;

    /*查询信息可以用get方法*/
    @GetMapping("/user/account/info/")
    public Map<String, String> getInfo() {
        return infoService.getinfo();
    }
}
