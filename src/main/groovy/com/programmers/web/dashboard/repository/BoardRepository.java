package com.programmers.web.dashboard.repository;

import com.programmers.web.dashboard.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query(value = "SELECT b FROM Board b JOIN FETCH b.member WHERE b.id = :boardId")
    Optional<Board> findByIdWithMemberAndCommentsAndFiles(@Param("boardId") Long boardID);

    // 첫 페이징 화면("/")
    @Query(value = "SELECT b FROM Board b JOIN FETCH b.member")
    Page<Board> findAllWithMember(@Param("member") Pageable pageable);

    // 제목 검색
    @Query(value = "SELECT b FROM Board b JOIN FETCH b.member WHERE b.title LIKE %:title%")
    Page<Board> findAllTitleContaining(@Param("title") String title, Pageable pageable);

    // 내용 검색
    @Query(value = "SELECT b FROM Board b JOIN FETCH b.member WHERE b.content LIKE %:content%")
    Page<Board> findAllContentContaining(@Param("content") String content, Pageable pageable);

    // 작성자 검색
    @Query(value = "SELECT b FROM Board b JOIN FETCH b.member WHERE b.member.memberName LIKE %:memberName%")
    Page<Board> findAllUsernameContaining(@Param("memberName") String username, Pageable pageable);
}
