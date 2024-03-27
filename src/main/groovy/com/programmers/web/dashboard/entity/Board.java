package com.programmers.web.dashboard.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "board")
public class Board extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    private String content;

    @Column(name = "view_count")
    private int viewCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    @JsonIgnore
    public Member member;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    public List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    public List<FileEntity> files = new ArrayList<>();

    @Builder
    public Board(Long id, String title, String content, int viewCount, Member member) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.member = member;
    }

    //== 조회수 증가 ==//
    public void upViewCount() {
        this.viewCount++;
    }

    //== 수정 Dirty Checking ==//
    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    //== Member & Board 연관관계 편의 메소드 ==//
    public void setMember(Member member) {
        this.member = member;
        member.getBoards().add(this);
    }
}
