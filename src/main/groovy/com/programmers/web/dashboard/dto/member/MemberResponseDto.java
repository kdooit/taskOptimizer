package com.programmers.web.dashboard.dto.member;

import com.programmers.web.dashboard.entity.Authority;
import com.programmers.web.dashboard.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberResponseDto {
    private String email;
    private String memberName;
    private Set<String> authorities;

    public static MemberResponseDto of(Member member) {
        Set<String> authorities = member.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        return new MemberResponseDto(member.getEmail(), member.getMemberName(), authorities);
    }
}
