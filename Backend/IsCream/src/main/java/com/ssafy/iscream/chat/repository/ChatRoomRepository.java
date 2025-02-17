package com.ssafy.iscream.chat.repository;

import com.ssafy.iscream.chat.domain.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    List<ChatRoom> findByParticipantIdsContaining(String userId);
    Optional<ChatRoom> findByParticipantIds(List<String> participantIds);


    @Query("{ 'participantIds': { $all: [?0, ?1] } }")
    Optional<ChatRoom> findByParticipants(String user1, String user2);
}