package com.programmers.web.dashboard.repository;

import com.programmers.web.dashboard.entity.Authority;
import com.programmers.web.dashboard.entity.AuthorityEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthorityRepository extends JpaRepository<Authority, AuthorityEnum> {
    Optional<Authority> findByAuthorityStatus(AuthorityEnum authorityStatus);
}