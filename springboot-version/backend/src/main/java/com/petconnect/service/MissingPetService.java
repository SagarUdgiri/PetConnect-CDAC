package com.petconnect.service;

import com.petconnect.dto.MissingPetRequest;
import com.petconnect.dto.MissingPetResponse;
import com.petconnect.dto.ContactResponse;
import java.util.List;

public interface MissingPetService {
        MissingPetResponse createReport(Long reporterId, MissingPetRequest request);

        List<MissingPetResponse> getNearbyReports(Long userId, Double radiusKm);

        String contactReporter(Long reportId, Long userId, String message);

        List<ContactResponse> getContactsForReport(Long reportId, Long userId);
        
        List<MissingPetResponse> getReportsByUser(Long userId);

        void deleteReport(Long reportId, Long userId);

}
