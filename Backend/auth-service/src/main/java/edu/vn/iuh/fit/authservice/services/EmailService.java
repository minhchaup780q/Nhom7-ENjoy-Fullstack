package edu.vn.iuh.fit.authservice.services;

import edu.vn.iuh.fit.authservice.dto.request.EmailDetails;

public interface EmailService {
    String sendOtpHtmlMail(EmailDetails emailDetails);
    void sendFamilyInviteMail(String recipientEmail, String parentName, String otpCode);
}
