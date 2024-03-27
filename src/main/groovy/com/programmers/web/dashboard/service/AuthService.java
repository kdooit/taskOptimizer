package com.programmers.web.dashboard.service;

import com.programmers.web.dashboard.common.exception.CustomException;
import com.programmers.web.dashboard.dto.member.MemberRequestDto;
import com.programmers.web.dashboard.dto.member.MemberResponseDto;
import com.programmers.web.dashboard.dto.jwt.TokenDto;
import com.programmers.web.dashboard.dto.jwt.TokenRequestDto;
import com.programmers.web.dashboard.entity.Authority;
import com.programmers.web.dashboard.entity.AuthorityEnum;
import com.programmers.web.dashboard.entity.Member;
import com.programmers.web.dashboard.entity.RefreshToken;
import com.programmers.web.dashboard.jwt.TokenProvider;
import com.programmers.web.dashboard.repository.AuthorityRepository;
import com.programmers.web.dashboard.repository.MemberRepository;
import com.programmers.web.dashboard.repository.RefreshTokenRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SecurityException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final AuthorityRepository authorityRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * 회원가입
     */
    @Transactional
    public MemberResponseDto signup(MemberRequestDto memberRequestDto) {
        // 이메일 중복 회원 검증
        if (memberRepository.existsByEmail(memberRequestDto.getEmail())) {
            throw new RuntimeException("이미 가입되어 있는 이메일입니다.");
        }

        Authority authority = authorityRepository
                .findByAuthorityStatus(AuthorityEnum.ROLE_USER).orElseThrow(()->new RuntimeException("권한 정보가 없습니다."));

        Set<Authority> set = new HashSet<>();
        set.add(authority);

        Member member = memberRequestDto.toMember(passwordEncoder, set);
        return MemberResponseDto.of(memberRepository.save(member));
    }
    /**
     * 로그인
     */
    @Transactional
    public TokenDto login(MemberRequestDto memberRequestDto) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(memberRequestDto.getEmail(), memberRequestDto.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        TokenDto tokenDto = tokenProvider.generateTokenDto(authentication);

        RefreshToken refreshToken = refreshTokenRepository.findByKey(authentication.getName())
                .map(token -> token.updateValue(tokenDto.getRefreshToken()))
                .orElse(RefreshToken.builder()
                        .key(authentication.getName())
                        .value(tokenDto.getRefreshToken())
                        .build());

        refreshTokenRepository.save(refreshToken);

        return tokenDto;
    }
    /**
     * 재발급
     */
    @Transactional
    public TokenDto reissue(TokenRequestDto tokenRequestDto) {
        // refresh Token 검증
        if (!tokenProvider.validateToken(tokenRequestDto.getRefreshToken())) {
            log.info("Refresh Token 검증 실패");
            throw new RuntimeException();
        }

        // refresh Token 검증
        Authentication authentication;
        try {
            if (!tokenProvider.validateToken(tokenRequestDto.getRefreshToken())) {
                throw new CustomException("Refresh Token 이 유효하지 않습니다.");
            }

            // access Token에서 Authentication객체 가져오기
            authentication = tokenProvider.getAuthentication(tokenRequestDto.getAccessToken());

            // DB에서 member_id를 기반으로 Refresh Token 값 가져옴
            RefreshToken refreshToken = refreshTokenRepository.findByKey(authentication.getName())
                    .orElseThrow(() -> new CustomException("로그아웃 된 사용자입니다."));

            // refresh Token이 다르면
            if (!refreshToken.getValue().equals(tokenRequestDto.getRefreshToken())) {
                throw new CustomException("토큰의 유저 정보가 일치하지 않습니다.");
            }

            // 새로운 토큰 생성
            TokenDto tokenDto = tokenProvider.generateTokenDto(authentication);

            // refreshToken 업데이트
            RefreshToken newRefreshToken = refreshToken.updateValue(tokenDto.getRefreshToken());
            refreshTokenRepository.save(newRefreshToken);

            // 토큰 발급
            return tokenDto;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다. 에러 메시지: {}", e.getMessage());
            throw new CustomException("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다. 에러 메시지: {}", e.getMessage());
            throw new CustomException("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다. 에러 메시지: {}", e.getMessage());
            throw new CustomException("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다. 에러 메시지: {}", e.getMessage());
            throw new CustomException("JWT 토큰이 잘못되었습니다.");
        }
    }
}