package com.ssafy.iscream.chat.repository;

import com.ssafy.iscream.chat.domain.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    void deleteByRoomId(String roomId);
    Page<ChatMessage> findByRoomId(String roomId, Pageable pageable);
}
