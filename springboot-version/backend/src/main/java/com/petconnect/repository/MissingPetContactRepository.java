package com.petconnect.repository;

import com.petconnect.entity.MissingPetContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissingPetContactRepository extends JpaRepository<MissingPetContact, Long> {
    List<MissingPetContact> findByReportId(Long reportId);
    
    void deleteByReportId(Long reportId);
}
