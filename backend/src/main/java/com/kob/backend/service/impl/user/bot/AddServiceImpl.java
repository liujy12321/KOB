package com.kob.backend.service.impl.user.bot;

import com.kob.backend.mapper.BotMapper;
import com.kob.backend.pojo.Bot;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.service.user.bot.AddService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AddServiceImpl implements AddService {

    @Autowired
    private BotMapper botMapper;

    @Override
    public Map<String, String> add(Map<String, String> data) {
        // get user info
        UsernamePasswordAuthenticationToken authenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticationToken.getPrincipal();
        User user = loginUser.getUser();

        String title = data.get("title");
        String description = data.get("description");
        String content = data.get("content");

        Map<String, String> map = new HashMap<>();

        if (title == null || title.length() == 0) {
            map.put("error_message", "title cannot be empty");
            return map;
        }

        if (title.length() > 100) {
            map.put("error_message", "the length of title cannot be larger than 100");
            return map;
        }

        if (description == null || description.length() == 0) {
            description = "nothing is in description";
        }

        if (description.length() > 300) {
            map.put("error_message", "the length of description cannot be larger than 300");
            return map;
        }

        if (content == null || content.length() == 0) {
            map.put("error_message", "content cannot be empty");
            return map;
        }

        if (content.length() > 10000) {
            map.put("error_message", "the length of content cannot be larger than 10000");
            return map;
        }

        Date now = new Date();
        Bot bot = new Bot(null, user.getId(), title, description, content, 1500, now, now);

        botMapper.insert(bot);
        map.put("error_message", "success");

        return map;

    }
}
