package com.back_end.service.serviceIMPL;

import com.back_end.model.ReportReason;
import com.back_end.repository.IReportReasonRepository;
import com.back_end.service.IReportReasonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportReasonServiceIMPL implements IReportReasonService {

    private final IReportReasonRepository reportReasonRepository;

    @Override
    public List<ReportReason> findAll() {
        return reportReasonRepository.findAll();
    }

    @Override
    public Optional<ReportReason> findById(Long id) {
        return reportReasonRepository.findById(id);
    }

    @Override
    public ReportReason save(ReportReason reportReason) {
        return reportReasonRepository.save(reportReason);
    }

    @Override
    public void deleteById(Long id) {
        reportReasonRepository.deleteById(id);
    }
}
