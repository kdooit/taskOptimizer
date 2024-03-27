package com.programmers.web.dashboard.dto.member;

import com.programmers.web.dashboard.entity.Authority;
import com.programmers.web.dashboard.entity.Member;
import lombok.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberRequestDto {
    private String email;
    private String password;
    private String memberName;

    public Member toMember(PasswordEncoder passwordEncoder, Set<Authority> authorities) {
        return Member.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .memberName(memberName)
                .authorities(authorities)
                .build();
    }

    public UsernamePasswordAuthenticationToken toAuthentication() {
        return new UsernamePasswordAuthenticationToken(email, password);
    }
}