package com.programmers.web.dashboard.service;

import com.programmers.web.dashboard.entity.Member;
import com.programmers.web.dashboard.entity.Authority;
import com.programmers.web.dashboard.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(email + " -> 데이터베이스에서 찾을 수 없습니다."));

        List<SimpleGrantedAuthority> grantedAuthorities = member.getAuthorities().stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                .collect(Collectors.toList());

        return new User(member.getEmail(), member.getPassword(), grantedAuthorities);
    }


// DB 에 User 값이 존재한다면 UserDetails 객체로 만들어서 리턴
//    private UserDetails createUserDetails(Member member) {
//         Collections<? extends GrantedAuthority>
//        List<SimpleGrantedAuthority> authList = member.getAuthorities()
//                .stream()
//                .map(GrantedAuthority::getAuthority)
//                .map(SimpleGrantedAuthority::new)
//                .collect(Collectors.toList());
//
//        return new User(
//                String.valueOf(member.getId()),
//                member.getPassword(),
//                authList
//        );
//    }

    private UserDetails createUserDetails(Member member) {

        List<SimpleGrantedAuthority> authList = member.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new User(
                member.getEmail(),
                member.getPassword(),
                authList
        );
    }
}