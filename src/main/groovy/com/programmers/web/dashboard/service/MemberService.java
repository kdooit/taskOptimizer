package com.programmers.web.dashboard.service;

import com.programmers.web.dashboard.dto.member.MemberResponseDto;
import com.programmers.web.dashboard.dto.member.MemberUpdateDto;
import com.programmers.web.dashboard.entity.Member;
import com.programmers.web.dashboard.repository.MemberRepository;
import com.programmers.web.dashboard.repository.RefreshTokenRepository;
import com.programmers.web.dashboard.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final StringRedisTemplate redisTemplate;
    private static final Logger log = LoggerFactory.getLogger(MemberService.class);

    /**
     * 내 정보 조회
     */
    @Transactional(readOnly = true)
    public MemberResponseDto getMyInfo(String currentUserEmail) {
        return memberRepository.findByEmail(SecurityUtil.getCurrentMemberEmail())
                .map(MemberResponseDto::of)
                .orElseThrow(() -> new RuntimeException("로그인 유저 정보가 없습니다."));
    }

    /**
     * 내 정보 수정 (이메일 수정 불가)
     */
//    @Transactional
//    public void updateMyInfo(MemberUpdateDto dto) {
//        Member member = memberRepository
//                .findById(SecurityUtil.getCurrentMemberId())
//                .orElseThrow(() -> new RuntimeException("로그인 유저 정보가 없습니다."));
//
//        member.updateMember(dto,passwordEncoder);
//    }

    @Transactional
    public void updateMyInfo(MemberUpdateDto request) {
        try {
            String email = SecurityUtil.getCurrentMemberEmail(); // 사용자 이메일로 변경
            Member member = memberRepository.findByEmail(email) // 이메일로 사용자 조회
                    .orElseThrow(() -> new RuntimeException("로그인 유저 정보가 없습니다."));

            // 비밀번호 확인 및 업데이트 로직
            if (!passwordEncoder.matches(request.getCurrentPassword(), member.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect.");
            }
            if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
                member.setPassword(passwordEncoder.encode(request.getNewPassword()));
            }
            // 기타 필드 업데이트
            if(request.getMemberName() != null) {
                member.setMemberName(request.getMemberName());
            }
            memberRepository.save(member); // 변경 사항 저장
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new RuntimeException("업데이트 중 충돌이 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    /**
     * 로그아웃
     */
    @Transactional
    public void logout(HttpServletRequest request) {
        // accessToken redisTemplate 블랙리스트 추가
        try {
            String jwt = request.getHeader("Authorization").substring(7);
            ValueOperations<String, String> logoutValueOperations = redisTemplate.opsForValue();
            logoutValueOperations.set(jwt, jwt); // JWT를 블랙리스트에 추가

            // refreshToken 삭제
            String email = SecurityUtil.getCurrentMemberEmail();
            refreshTokenRepository.deleteByKey(email);;
        } catch (ObjectOptimisticLockingFailureException e) {
            log.error("로그아웃 오류: {}", e.getMessage());
            throw new RuntimeException("오류로 인해 로그아웃에 실패했습니다.", e);
        }
    }

    /**
     * 회원 탈퇴
     */
    @Transactional
    public void deleteMember() {
        String email = SecurityUtil.getCurrentMemberEmail();
        if (email == null) {
            throw new RuntimeException("로그인 유저 정보가 없습니다.");
        }
        memberRepository.deleteByEmail(email); // 메서드 호출 부분 변경
    }
}