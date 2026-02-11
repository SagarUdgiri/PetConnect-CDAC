package com.petconnect.service.impl;

import com.petconnect.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Override
    public void sendOtp(String email, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("PetConnect - Your Security Verification Code");

            String htmlContent = String.format(
                    """
                            <div style='font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 15px;'>
                                <div style='text-align: center; margin-bottom: 30px;'>
                                    <h1 style='color: #ffb703; margin: 0;'>Welcome to PetConnect!</h1>
                                </div>

                                <p style='color: #475569; font-size: 16px; line-height: 1.5;'>Dear Valued User,</p>

                                <p style='color: #475569; font-size: 16px; line-height: 1.5;'>
                                    Thank you for using PetConnect. For your security, please use the following One-Time Password (OTP) to verify your account:
                                </p>

                                <div style='background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 10px; margin: 25px 0;'>
                                    <span style='font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #1e293b; font-family: monospace;'>%s</span>
                                </div>

                                <p style='color: #64748b; font-size: 14px; text-align: center;'>
                                    This code is valid for <strong>5 minutes</strong>.
                                </p>

                                <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;'>

                                <p style='color: #94a3b8; font-size: 12px; font-style: italic;'>
                                    If you did not request this code, please ignore this email or contact our support if you have concerns.
                                </p>
                            </div>
                            """,
                    otp);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("DEBUG: Sending HTML OTP " + otp + " to " + email);
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
