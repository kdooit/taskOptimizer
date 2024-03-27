package com.programmers.web.dashboard.controller;

import com.programmers.web.dashboard.common.exception.CustomException;
import com.programmers.web.dashboard.dto.board.*;
import com.programmers.web.dashboard.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    private final BoardService boardService;

    @Autowired
    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    // 게시글 목록 조회
    @GetMapping
    public ResponseEntity<Page<ResBoardListDto>> getAllBoards(Pageable pageable) {
        Page<ResBoardListDto> boards = boardService.findAllBoards(pageable);
        return ResponseEntity.ok(boards);
    }

    // 게시글 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<ResBoardDetailsDto> getBoardById(@PathVariable("id") Long id) {
        ResBoardDetailsDto board = boardService.findBoardById(id);
        return ResponseEntity.ok(board);
    }

    // 게시글 생성
//    @PostMapping
//    public ResponseEntity<ResBoardWriteDto> createBoard(@RequestBody BoardWriteDto boardWriteDto, @AuthenticationPrincipal UserDetails userDetails) {
//        if (userDetails == null) {
//            throw new CustomException("사용자 인증 정보를 찾을 수 없습니다.");
//        } else {
//            String email = userDetails.getUsername();
//            ResBoardWriteDto resBoardWriteDto = boardService.createBoard(BoardWriteDto.ofEntity(boardWriteDto), email);
//            return ResponseEntity.ok(resBoardWriteDto);
//        }
//    }

    @PostMapping
    public ResponseEntity<ResBoardWriteDto> createBoard(@RequestBody BoardWriteDto boardWriteDto, @AuthenticationPrincipal(expression = "username") String email) {
        ResBoardWriteDto resBoardWriteDto = boardService.createBoard(BoardWriteDto.ofEntity(boardWriteDto), email);
        return ResponseEntity.ok(resBoardWriteDto);
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<ResBoardDetailsDto> updateBoard(@PathVariable Long id, @RequestBody BoardUpdateDto boardUpdateDto) {
        ResBoardDetailsDto updatedBoard = boardService.updateBoard(id, boardUpdateDto);
        return ResponseEntity.ok(updatedBoard);
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
        return ResponseEntity.ok().build();
    }

    // 게시글 검색
    @GetMapping("/search")
    public ResponseEntity<Page<ResBoardListDto>> search(SearchBoardData searchBoardData, Pageable pageable) {
        Page<ResBoardListDto> result = boardService.search(searchBoardData, pageable);
        return ResponseEntity.ok(result);
    }
}