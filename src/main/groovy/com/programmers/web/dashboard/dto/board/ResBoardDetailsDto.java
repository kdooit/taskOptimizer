package com.programmers.web.dashboard.dto.board;

import com.programmers.web.dashboard.dto.comment.ResCommentDto;
import com.programmers.web.dashboard.dto.file.ResBoardDetailsFileDto;
import com.programmers.web.dashboard.entity.Board;

import lombok.*;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class ResBoardDetailsDto {

    // board info
    private Long boardId;
    private String title;
    private String content;
    private int viewCount;
    private String writerName;
    private String createdDate;
    private String modifiedDate;

    // comments
    private List<ResCommentDto> comments;

    // file
    private List<ResBoardDetailsFileDto> files;

    @Builder
    public ResBoardDetailsDto(Long boardId, String title, String content, int viewCount, String writerName, String createdDate, String modifiedDate, List<ResCommentDto> comments, List<ResBoardDetailsFileDto> files) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.writerName = writerName;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.comments = comments;
        this.files = files;
    }

    public static ResBoardDetailsDto fromEntity(Board board) {
        return ResBoardDetailsDto.builder()
                .boardId(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .viewCount(board.getViewCount())
                .writerName(board.getMember().getUsername())
                .createdDate(board.getCreatedDate())
                .modifiedDate(board.getModifiedDate())
                .comments(board.getComments().stream()
                        .map(ResCommentDto::fromEntity)
                        .collect(Collectors.toList()))
                .files(board.getFiles().stream()
                        .map(ResBoardDetailsFileDto::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}