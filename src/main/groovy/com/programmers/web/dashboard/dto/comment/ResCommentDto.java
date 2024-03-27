package com.programmers.web.dashboard.dto.comment;

import com.programmers.web.dashboard.entity.Comment;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class ResCommentDto {

    private Long commentId;
    private String content;
    private String createdDate;
    private String modifiedDate;
    private String commentWriterName; // 댓글 작성자

    @Builder
    public ResCommentDto(Long commentId, String content, String createdDate, String modifiedDate, String commentWriterName) {
        this.commentId = commentId;
        this.content = content;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.commentWriterName = commentWriterName;
    }

    public static ResCommentDto fromEntity(Comment comment) {
        return ResCommentDto.builder()
                .commentId(comment.getId())
                .content(comment.getContent())
                .createdDate(comment.getCreatedDate())
                .modifiedDate(comment.getModifiedDate())
                .commentWriterName(comment.getMember().getUsername())
                .build();
    }
}