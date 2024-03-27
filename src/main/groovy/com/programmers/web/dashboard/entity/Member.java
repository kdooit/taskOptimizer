package com.programmers.web.dashboard.entity;

import com.programmers.web.dashboard.dto.member.MemberUpdateDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;
import java.util.stream.Collectors;

import static com.programmers.web.dashboard.entity.AuthorityEnum.ROLE_ADMIN;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Member extends BaseTimeEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(unique = true)
    private String email;

    private String memberName;

    private String password;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Board> boards = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Comment> comments = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "member_authority",
        joinColumns = {@JoinColumn(name="member_id",referencedColumnName = "member_id")},
        inverseJoinColumns = {@JoinColumn(name = "authority_status",referencedColumnName = "authority_status")})
    private Set<Authority> authorities = new HashSet<>();

    @Builder
    public Member(String email, String memberName, String password, Set<Authority> authorities) {
        this.email = email;
        this.memberName = memberName;
        this.password = password;
        this.authorities = authorities;
    }

    public void setPassword(String password) {
        this.password = password; // 이미 존재하거나, 추가적인 로직이 필요한 경우 여기에 구현
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName; // 마찬가지로 필요한 경우 여기에 구현
    }

    // 회원 정보 수정
    public void updateMember(MemberUpdateDto dto, PasswordEncoder passwordEncoder) {
        if(dto.getCurrentPassword() != null) this.password = passwordEncoder.encode(dto.getCurrentPassword());
//        if(dto.getUsername() != null) this.memberName = dto.getUsername();
    }

    public static Member createAdmin(String email, String memberName, String password, PasswordEncoder passwordEncoder, Set<Authority> authorities) {
        Authority authority = Authority.builder()
                .authorityStatus(ROLE_ADMIN)
                .build();
        authorities.add(authority);

        Member admin = Member.builder()
                .email(email)
                .memberName(memberName)
                .password(passwordEncoder.encode(password))
                .authorities(authorities)
                .build();
        return admin;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities.stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                .collect(Collectors.toSet());
    }
}
