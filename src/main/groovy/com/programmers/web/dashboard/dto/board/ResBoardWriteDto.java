package com.programmers.web.dashboard.dto.board;

import com.programmers.web.dashboard.entity.Board;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class ResBoardWriteDto {

    private Long boardId;
    private String title;
    private String content;
    private String writerName;
    private String createdDate;

    @Builder
    public ResBoardWriteDto(Long boardId, String title, String content, String writerName, String createdDate) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.writerName = writerName;
        this.createdDate = createdDate;
    }

//    public static ResBoardWriteDto fromEntity(Board board, String writerName) {
//        return ResBoardWriteDto.builder()
//                .boardId(board.getId())
//                .title(board.getTitle())
//                .content(board.getContent())
//                .writerName(writerName)
//                .createdDate(board.getCreatedDate())
//                .build();
//    }
public static ResBoardWriteDto fromEntity(Board board, String writerName) {
    return ResBoardWriteDto.builder()
            .boardId(board.getId())
            .title(board.getTitle())
            .content(board.getContent())
            .writerName(writerName)
            .createdDate(board.getCreatedDate())
            .build();
}
}