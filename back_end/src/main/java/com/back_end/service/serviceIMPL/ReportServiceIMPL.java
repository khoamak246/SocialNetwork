package com.back_end.service.serviceIMPL;

import com.back_end.model.Report;
import com.back_end.repository.IReportRepository;
import com.back_end.service.IReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportServiceIMPL implements IReportService {

    private final IReportRepository reportRepository;

    @Override
    public List<Report> findAll() {
        return reportRepository.findAll();
    }

    @Override
    public Optional<Report> findById(Long id) {
        return reportRepository.findById(id);
    }

    @Override
    public Report save(Report report) {
        return reportRepository.save(report);
    }

    @Override
    public void deleteById(Long id) {
        reportRepository.deleteById(id);
    }
}
