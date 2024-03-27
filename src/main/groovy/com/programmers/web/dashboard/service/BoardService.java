package com.programmers.web.dashboard.service;

import com.programmers.web.dashboard.common.exception.ResourceNotFoundException;
import com.programmers.web.dashboard.dto.board.*;
import com.programmers.web.dashboard.entity.Board;
import com.programmers.web.dashboard.entity.Member;
import com.programmers.web.dashboard.repository.BoardRepository;
import com.programmers.web.dashboard.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    @Autowired
    public BoardService(BoardRepository boardRepository, MemberRepository memberRepository) {
        this.boardRepository = boardRepository;
        this.memberRepository = memberRepository;
    }

//     페이징 리스트
    public Page<ResBoardListDto> findAllBoards(Pageable pageable) {
        Page<Board> boards = boardRepository.findAllWithMember(pageable);
        List<ResBoardListDto> list = boards.getContent().stream()
                .map(ResBoardListDto::fromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(list, pageable, boards.getTotalElements());
    }

        public List<Board> findAllBoards() {
        return boardRepository.findAll();
    }

    // 게시글 검색, isEmpty() == ""
    public Page<ResBoardListDto> search(SearchBoardData SearchBoardData, Pageable pageable) {
        Page<Board> result = null;
        if (!SearchBoardData.getTitle().isEmpty()) {
            result = boardRepository.findAllTitleContaining(SearchBoardData.getTitle(), pageable);
        } else if (!SearchBoardData.getContent().isEmpty()) {
            result = boardRepository.findAllContentContaining(SearchBoardData.getContent(), pageable);
        } else if (!SearchBoardData.getWriterName().isEmpty()) {
            result = boardRepository.findAllUsernameContaining(SearchBoardData.getWriterName(), pageable);
        }
        List<ResBoardListDto> list = result.getContent().stream()
                .map(ResBoardListDto::fromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(list, pageable, result.getTotalElements());
    }

    private static final Logger logger = LoggerFactory.getLogger(BoardService.class);

    // 게시글 등록
    public ResBoardWriteDto createBoard(Board board, String email) {
        logCurrentUserInfo();

        Member writerMember = memberRepository.findByEmail(email)
                .orElseThrow(() ->  new ResourceNotFoundException("Member", "email", email));
        board.setMember(writerMember);
        Board savedBoard = boardRepository.save(board);
        return ResBoardWriteDto.fromEntity(savedBoard, writerMember.getUsername());
    }

    private void logCurrentUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            logger.info("Currently authenticated user: ");
            logger.info("Principal: {}", authentication.getPrincipal());
            logger.info("Authorities: {}", authentication.getAuthorities());
            logger.info("Details: {}", authentication.getDetails());
            logger.info("Authenticated: {}", authentication.isAuthenticated());
            logger.info("name: {}", authentication.getName());
            logger.info("Credentials: {}", authentication.getCredentials());
        } else {
            logger.info("No authentication information available.");
        }
    }

    // 게시글 상세보기
    public ResBoardDetailsDto findBoardById(Long boardId) {
        Board findBoard = boardRepository.findByIdWithMemberAndCommentsAndFiles(boardId).orElseThrow(
                () -> new ResourceNotFoundException("Board", "Board Id", String.valueOf(boardId))
        );
        // 조회수 증가
        findBoard.upViewCount();
        return ResBoardDetailsDto.fromEntity(findBoard);
    }

    // 게시글 수정
    public ResBoardDetailsDto updateBoard(Long boardId, BoardUpdateDto boardDTO) {
        Board updateBoard = boardRepository.findByIdWithMemberAndCommentsAndFiles(boardId).orElseThrow(
                () -> new ResourceNotFoundException("Board", "Board Id", String.valueOf(boardId))
        );
        updateBoard.update(boardDTO.getTitle(), boardDTO.getContent());
        return ResBoardDetailsDto.fromEntity(updateBoard);
    }

    // 게시글 삭제
    public void deleteBoard(Long boardId) {
        boardRepository.deleteById(boardId);
    }

//    public List<Board> findAllBoards() {
//        return boardRepository.findAll();
//    }
//
//    public Board findBoardById(Long id) {
//        return boardRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", String.valueOf(id)));
//    }

//    public Board createBoard(Board board, String email) {
//        Member member = memberRepository.findByEmail(email)
//                .orElseThrow(() -> new ResourceNotFoundException("Member", "email", email));
//        board.setMember(member);
//        return boardRepository.save(board);
//    }

//    public Board updateBoard(Long id, Board boardDetails) {
//        Board board = findBoardById(id);
//        board.update(boardDetails.getTitle(), boardDetails.getContent());
//        return boardRepository.save(board);
//    }
//
//    public void deleteBoard(Long id) {
//        Board board = findBoardById(id);
//        if (board != null) {
//            boardRepository.delete(board);
//        }
//    }
}