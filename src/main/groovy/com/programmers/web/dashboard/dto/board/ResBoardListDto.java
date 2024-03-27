package com.programmers.web.dashboard.dto.board;

import com.programmers.web.dashboard.entity.Board;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class ResBoardListDto {
    // 작성일, 수정일, 작성자, 댓글 개수만 전체 목록에 대한 데이터로 받으면 됨
    // 상세한 댓글 내용 등은 상세보기에서 처리
    private Long boardId;
    private String title;
    private String content;
    private int viewCount;
    private String createdDate;
    private String modifiedDate;
    private String writerName;

    @Builder
    public ResBoardListDto(Long boardId, String title, String content, int viewCount, String createdDate, String modifiedDate, String writerName) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.writerName = writerName;
    }

    // Entity -> DTO
    public static ResBoardListDto fromEntity(Board board) {
        return ResBoardListDto.builder()
                .boardId(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .viewCount(board.getViewCount())
                .createdDate(board.getCreatedDate())
                .modifiedDate(board.getModifiedDate())
                .writerName(board.getMember().getUsername())
                .build();
    }
}
