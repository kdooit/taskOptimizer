package com.programmers.web.dashboard.config;

import com.programmers.web.dashboard.entity.Authority;
import com.programmers.web.dashboard.entity.AuthorityEnum;
import com.programmers.web.dashboard.entity.Member;
import com.programmers.web.dashboard.repository.AuthorityRepository;
import com.programmers.web.dashboard.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static io.lettuce.core.GeoArgs.Unit.m;

@Component
public class DataInitializer implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment env;

    // 생성자를 통한 의존성 주입
    public DataInitializer(MemberRepository memberRepository, AuthorityRepository authorityRepository, PasswordEncoder passwordEncoder, Environment env) {
        this.memberRepository = memberRepository;
        this.authorityRepository = authorityRepository;
        this.passwordEncoder = passwordEncoder;
        this.env = env;
    }

@Override
public void run(String... args) throws Exception {
    // 기본 사용자 권한 (ROLE_USER) 생성 및 저장
    Authority userAuthority = authorityRepository.findByAuthorityStatus(AuthorityEnum.ROLE_USER)
            .orElseGet(() -> authorityRepository.save(new Authority(AuthorityEnum.ROLE_USER)));

    // 개발 환경에서만 관리자 계정 생성
    boolean createAdmin = Arrays.asList(env.getActiveProfiles()).contains("dev");
    if (createAdmin) {
        // 관리자 권한 (ROLE_ADMIN) 생성 및 저장
        Authority adminAuthority = authorityRepository.findByAuthorityStatus(AuthorityEnum.ROLE_ADMIN)
                .orElseGet(() -> authorityRepository.save(new Authority(AuthorityEnum.ROLE_ADMIN)));

        Set<Authority> adminAuthorities = new HashSet<>();
        adminAuthorities.add(adminAuthority);

        // 관리자 계정 생성
        memberRepository.findByEmail("admin@gmail.com")
                .orElseGet(() -> memberRepository.save(Member.builder()
                        .email("admin@gmail.com")
                        .memberName("관리자")
                        .password(passwordEncoder.encode("admin123"))
                        .authorities(adminAuthorities)
                        .build()));
    }
}
}