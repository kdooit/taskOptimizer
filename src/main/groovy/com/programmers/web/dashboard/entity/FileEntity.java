package com.programmers.web.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "file")
@Getter
@NoArgsConstructor
public class FileEntity extends BaseTimeEntity {

    @Id @GeneratedValue
    @Column(name = "file_id")
    private Long id;

    @Column(name = "origin_file_name")
    private String originFileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_path")
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    public Board board;

    @Builder
    public FileEntity(Long id, String originFileName, String filePath, String fileType) {
        this.id = id;
        this.originFileName = originFileName;
        this.filePath = filePath;
        this.fileType = fileType;
    }

    public void setMappingBoard(Board board) {
        this.board = board;
    }
}