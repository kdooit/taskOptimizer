package com.programmers.web.dashboard.controller;

import com.programmers.web.dashboard.dto.member.MemberRequestDto;
import com.programmers.web.dashboard.dto.member.MemberResponseDto;
import com.programmers.web.dashboard.dto.jwt.TokenDto;
import com.programmers.web.dashboard.dto.jwt.TokenRequestDto;
import com.programmers.web.dashboard.entity.Board;
import com.programmers.web.dashboard.service.AuthService;
import com.programmers.web.dashboard.service.BoardService;
import com.programmers.web.dashboard.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final MemberService memberService;
    private final BoardService boardService;

    @PostMapping("/signup")
    public ResponseEntity<MemberResponseDto> signup(@RequestBody MemberRequestDto memberRequestDto) {
        return ResponseEntity.ok(authService.signup(memberRequestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> login(@RequestBody MemberRequestDto memberRequestDto) {
        return ResponseEntity.ok(authService.login(memberRequestDto));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            memberService.logout(request);
            return ResponseEntity.ok().build();
        } catch (ObjectOptimisticLockingFailureException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("동시 요청으로 인한 충돌이 발생했습니다. 다시 시도해주세요.");
        }
    }

    @PostMapping("/reissue")
    public ResponseEntity<TokenDto> reissue(@RequestBody TokenRequestDto tokenRequestDto) {
        return ResponseEntity.ok(authService.reissue(tokenRequestDto));
    }
}