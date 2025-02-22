package com.ssafy.iscream.user.repository;

import com.ssafy.iscream.user.domain.Status;
import com.ssafy.iscream.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Boolean existsByNickname(String nickname);

    Boolean existsByPhone(String phone);

    Optional<User> findByEmailAndUsernameAndPhone(String email, String username, String phone);

    Boolean existsByIdAndStatus(Integer userId, Status status);
}
