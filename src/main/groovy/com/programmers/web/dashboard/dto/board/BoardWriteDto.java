package com.programmers.web.dashboard.dto.board;

import com.programmers.web.dashboard.entity.Board;
import com.programmers.web.dashboard.entity.Member;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class BoardWriteDto {

    private Member member;
    private String title;
    private String content;

    public BoardWriteDto(Member member, String title, String content) {
        this.member = member;
        this.title = title;
        this.content = content;
    }

    @Builder
    public static Board ofEntity(BoardWriteDto dto) {
        return Board.builder()
                .member(dto.member)
                .title(dto.title)
                .content(dto.content)
                .build();
    }
}
