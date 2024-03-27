package com.programmers.web.dashboard.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class Authority implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "authority_status", nullable = false, unique = true)
    @Enumerated(EnumType.STRING)
    private AuthorityEnum authorityStatus;

    @Override
    public String getAuthority() {
        return this.authorityStatus.name();
    }

    @Builder
    public Authority(AuthorityEnum authorityStatus) {
        this.authorityStatus = authorityStatus;
    }
}

