package com.back_end.repository;

import com.back_end.model.ReportReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IReportReasonRepository extends JpaRepository<ReportReason, Long> {
}
