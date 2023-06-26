package com.back_end.controller;

import com.back_end.dto.request.ReportForm;
import com.back_end.dto.response.ResponseMessage;
import com.back_end.model.Post;
import com.back_end.model.Report;
import com.back_end.model.ReportReason;
import com.back_end.model.User;
import com.back_end.security.userPrincipal.UserPrincipal;
import com.back_end.service.IPostService;
import com.back_end.service.IReportReasonService;
import com.back_end.service.IReportService;
import com.back_end.service.IUserService;
import com.back_end.utils.util.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/report")
@RequiredArgsConstructor
public class ReportController {

    private final IUserService userService;
    private final IPostService postService;
    private final IReportReasonService reportReasonService;
    private final IReportService reportService;

    @PostMapping("")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PM', 'USER')")
    public ResponseEntity<ResponseMessage> saveReport(@RequestBody ReportForm reportForm){
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!userPrincipal.getId().equals(reportForm.getUserId())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Utils.buildFailMessage("User not matches!"));
        }

        Optional<User> user = userService.findById(reportForm.getUserId());
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found user at id: " + reportForm.getUserId()));
        }

        Optional<Post> post = postService.findById(reportForm.getPostId());
        if (!post.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found post at id: " + reportForm.getPostId()));
        }

        Optional<ReportReason> reportReason = reportReasonService.findById(reportForm.getReportReason());
        if (!reportReason.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Utils.buildFailMessage("Not found report reason at id: " + reportForm.getReportReason()));
        }

        Report report = Report.builder()
                .reportTime(LocalDate.now().toString())
                .user(user.get())
                .reason(reportReason.get())
                .post(post.get())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(Utils.buildSuccessMessage("Create new report successfully!", reportService.save(report)));
    }
}
