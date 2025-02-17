package com.ssafy.iscream.noti.dto.response;

import com.ssafy.iscream.common.util.DateUtil;
import com.ssafy.iscream.noti.domain.Notify;

public record NotifyInfo(
        Integer notifyId,
        String title,
        String content,
        String type,
        Boolean read,
        Integer postId,
        Integer charId,
        String createdAt
) {
    public NotifyInfo(Notify notify) {
        this(
                notify.getNotifyId(),
                notify.getTitle(),
                notify.getContent(),
                notify.getType().name(),
                notify.isRead(),
                notify.getPostId(),
                notify.getChatId(),
                DateUtil.format(notify.getCreatedAt())
        );
    }
}
