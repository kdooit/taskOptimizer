package com.programmers.web.dashboard.dto.member;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class MemberUpdateDto {

    private String memberName;
    private String currentPassword; // 현재 비밀번호 확인을 위한 필드
    private String newPassword; // 새 비밀번호 설정을 위한 필드

    public MemberUpdateDto(String password, String passwordCheck, String username) {
        this.newPassword = newPassword;
        this.memberName = memberName;
    }
}
