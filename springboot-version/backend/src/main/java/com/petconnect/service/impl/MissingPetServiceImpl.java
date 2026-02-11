package com.petconnect.service.impl;

import com.petconnect.dto.MissingPetRequest;
import com.petconnect.dto.MissingPetResponse;
import com.petconnect.entity.MissingPetReport;
import com.petconnect.entity.MissingPetReport.ReportStatus;
import com.petconnect.entity.Pet;
import com.petconnect.entity.User;
import com.petconnect.repository.MissingPetReportRepository;
import com.petconnect.repository.PetRepository;
import com.petconnect.repository.UserRepository;
import com.petconnect.service.MissingPetService;
import com.petconnect.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MissingPetServiceImpl implements MissingPetService {
    private final MissingPetReportRepository reportRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final com.petconnect.repository.MissingPetContactRepository contactRepository;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;

    @Override
    public List<MissingPetResponse> getReportsByUser(Long userId) {
        List<MissingPetReport> reports =
                reportRepository.findByReporterId(userId);

        return reports.stream()
                .map(report -> modelMapper.map(report, MissingPetResponse.class))
                .collect(Collectors.toList());
    }
    
    @Override
    public MissingPetResponse createReport(Long reporterId, MissingPetRequest request) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MissingPetReport report = modelMapper.map(request, MissingPetReport.class);
        report.setReporter(reporter);

        if (request.getPetId() != null) {
            Pet pet = petRepository.findById(request.getPetId())
                    .orElseThrow(() -> new RuntimeException("Pet not found"));
            

            if (report.getPetName() == null)
                report.setPetName(pet.getPetName());
            if (report.getSpecies() == null)
                report.setSpecies(pet.getSpecies());
            if (report.getBreed() == null)
                report.setBreed(pet.getBreed());
        }

        MissingPetReport savedReport = reportRepository.save(report);


        if (savedReport.getStatus() == ReportStatus.MISSING) {
            notifyNearbyUsers(savedReport);
        }

        
        checkForMatches(savedReport);

        return modelMapper.map(savedReport, MissingPetResponse.class);
    }

    @Override
    public List<MissingPetResponse> getNearbyReports(Long userId, Double radiusKm) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getLatitude() == null || user.getLongitude() == null) {
            return List.of();
        }

        List<MissingPetReport> allReports = reportRepository.findAll();

        return allReports.stream()
                .map(report -> {
                    double distance = calculateDistance(user.getLatitude(), user.getLongitude(),
                            report.getLatitude(), report.getLongitude());
                    MissingPetResponse response = modelMapper.map(report, MissingPetResponse.class);
                    response.setDistance(Math.round(distance * 100.0) / 100.0);
                    return response;
                })
                .filter(resp -> resp.getDistance() <= radiusKm)
                .sorted(Comparator.comparing(MissingPetResponse::getDistance))
                .collect(Collectors.toList());
    }

    private void notifyNearbyUsers(MissingPetReport report) {
        List<User> allUsers = userRepository.findAll();
        double radiusKm = 5.0; 

        allUsers.stream()
                .filter(u -> !u.getId().equals(report.getReporter().getId()))
                .filter(u -> u.getLatitude() != null && u.getLongitude() != null)
                .forEach(u -> {
                    double dist = calculateDistance(u.getLatitude(), u.getLongitude(),
                            report.getLatitude(), report.getLongitude());
                    if (dist <= radiusKm) {
                        notificationService.createNotification(
                                u.getId(),
                                "URGENT",
                                "MISSING PET NEARBY: " + report.getPetName() + " (" + report.getSpecies()
                                        + ") was last seen near " + report.getLastSeenLocation(),
                                report.getId(),
                                report.getReporter().getId());
                    }
                });
    }

    private void checkForMatches(MissingPetReport newReport) {
        
        ReportStatus lookForStatus = (newReport.getStatus() == ReportStatus.MISSING) ? ReportStatus.FOUND
                : ReportStatus.MISSING;

        List<MissingPetReport> candidates = reportRepository.findByStatus(lookForStatus);

        candidates.stream()
                .filter(c -> c.getSpecies().equalsIgnoreCase(newReport.getSpecies()))
                .filter(c -> c.getBreed() != null && newReport.getBreed() != null
                        && c.getBreed().equalsIgnoreCase(newReport.getBreed()))
                .forEach(match -> {
                    double dist = calculateDistance(newReport.getLatitude(), newReport.getLongitude(),
                            match.getLatitude(), match.getLongitude());
                    if (dist <= 10.0) { 
                        
                        notificationService.createNotification(
                                newReport.getReporter().getId(),
                                "MATCH_FOUND",
                                "A potential match for your "
                                        + (newReport.getStatus() == ReportStatus.MISSING ? "lost" : "found")
                                        + " pet was reported nearby!",
                                newReport.getId(),
                                match.getReporter().getId());

                        notificationService.createNotification(
                                match.getReporter().getId(),
                                "MATCH_FOUND",
                                "A potential match for the pet you reported was just posted!",
                                match.getId(),
                                newReport.getReporter().getId());
                    }
                });
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // KM
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    @Override
    public String contactReporter(Long reportId, Long userId, String message) {
        User contactUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MissingPetReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (report.getReporter().getId().equals(userId)) {
            throw new RuntimeException("You cannot contact yourself");
        }

        com.petconnect.entity.MissingPetContact contact = com.petconnect.entity.MissingPetContact.builder()
                .report(report)
                .contactUser(contactUser)
                .message(message)
                .contactPhone(contactUser.getPhone())
                .contactEmail(contactUser.getEmail())
                .build();

        contactRepository.save(contact);

        
        notificationService.createNotification(
                report.getReporter().getId(),
                "URGENT",
                contactUser.getFullName() + " contacted you about your missing pet report!",
                report.getId(),
                contactUser.getId());

        return "Message sent successfully";
    }

    @Override
    public List<com.petconnect.dto.ContactResponse> getContactsForReport(Long reportId, Long userId) {
        MissingPetReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (!report.getReporter().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Only the reporter can view contacts");
        }

        return contactRepository.findByReportId(reportId).stream()
                .map(contact -> com.petconnect.dto.ContactResponse.builder()
                        .id(contact.getId())
                        .contactUserId(contact.getContactUser().getId())
                        .contactUserName(contact.getContactUser().getFullName())
                        .contactUserImage(contact.getContactUser().getImageUrl())
                        .message(contact.getMessage())
                        .contactPhone(contact.getContactPhone())
                        .contactEmail(contact.getContactEmail())
                        .createdAt(contact.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteReport(Long reportId, Long userId) {
        MissingPetReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (!report.getReporter().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own reports");
        }

        contactRepository.deleteByReportId(reportId);
        reportRepository.delete(report);
    }

}
