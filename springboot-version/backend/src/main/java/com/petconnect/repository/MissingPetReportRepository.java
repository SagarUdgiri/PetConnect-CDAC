package com.petconnect.repository;

import com.petconnect.entity.MissingPetReport;
import com.petconnect.entity.MissingPetReport.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MissingPetReportRepository extends JpaRepository<MissingPetReport, Long> {
    List<MissingPetReport> findByStatus(ReportStatus status);

    List<MissingPetReport> findByReporterId(Long reporterId);
}
