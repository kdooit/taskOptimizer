package com.programmers.web.dashboard.controller;

import com.programmers.web.dashboard.dto.member.MemberResponseDto;
import com.programmers.web.dashboard.dto.member.MemberUpdateDto;
import com.programmers.web.dashboard.service.MemberService;
import com.programmers.web.dashboard.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/myinfo")
    public ResponseEntity<MemberResponseDto> getMemberInfo() {
        String getCurrentMemberEmail = SecurityUtil.getCurrentMemberEmail();
        if (getCurrentMemberEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        MemberResponseDto memberInfo = memberService.getMyInfo(getCurrentMemberEmail);
        return ResponseEntity.ok(memberInfo);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateMyInfo(@RequestBody MemberUpdateDto request) {
        try {
            memberService.updateMyInfo(request);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            memberService.logout(request); // HttpServletRequest 객체를 전달
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/deleteAccount")
    public void deleteMember() {
        memberService.deleteMember();
    }
}
