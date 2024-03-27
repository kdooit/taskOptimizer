package com.programmers.web.dashboard.dto.board;

import lombok.*;

@Getter
@Setter
public class SearchBoardData {

    String title;
    String content;
    String writerName;

    @Builder
    public SearchBoardData(String title, String content, String writerName) {
        this.title = title;
        this.content = content;
        this.writerName = writerName;
    }

    public static SearchBoardData createdSearchBoardData(String title, String content, String writerName) {
        return SearchBoardData.builder()
                .title(title)
                .content(content)
                .writerName(writerName)
                .build();
    }
}