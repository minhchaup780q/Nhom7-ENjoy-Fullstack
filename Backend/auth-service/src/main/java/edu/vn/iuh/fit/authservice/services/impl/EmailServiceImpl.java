package edu.vn.iuh.fit.authservice.services.impl;

import edu.vn.iuh.fit.authservice.dto.request.EmailDetails;
import edu.vn.iuh.fit.authservice.services.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public String sendOtpHtmlMail(EmailDetails emailDetails) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(sender, "Hệ thống xác thực ENjoy");
            helper.setTo(emailDetails.getRecipient());
            helper.setSubject(emailDetails.getSubject() != null ? emailDetails.getSubject() : "Mã xác thực OTP của bạn");

            String otpCode = emailDetails.getMsgBody();

            // Template HTML chuẩn Email Client với inline CSS
            String htmlContent = """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 10px;">
                        <tr>
                            <td align="center">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #eef2f5;">
                                    
                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color: #1e293b; padding: 24px; text-align: center;">
                                            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">XÁC THỰC TÀI KHOẢN</h1>
                                        </td>
                                    </tr>
                                    
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding: 32px 28px;">
                                            <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                                                Xin chào,
                                            </p>
                                            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                                                Bạn đang thực hiện yêu cầu xác thực. Vui lòng sử dụng mã OTP dưới đây để hoàn tất:
                                            </p>
                                            
                                            <!-- OTP Card Box -->
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                                                <tr>
                                                    <td align="center" style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 18px;">
                                                        <span style="display: block; font-size: 32px; font-weight: 700; color: #0f172a; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                                                            """ + otpCode + """
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5; color: #64748b;">
                                                ⏱️ Mã này có hiệu lực trong vòng <strong>5 phút</strong>.
                                            </p>
                                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #ef4444;">
                                                ⚠️ Vui lòng tuyệt đối không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn.
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f8fafc; padding: 18px 24px; border-top: 1px solid #e2e8f0; text-align: center;">
                                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.4;">
                                                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.<br>
                                                Đây là email tự động, vui lòng không phản hồi.
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """;

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            return "Mail Sent Successfully";
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            return "Error while sending mail: " + e.getMessage();
        }
    }

    @Override
    public void sendFamilyInviteMail(String recipientEmail, String parentName, String otpCode) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(sender, "Hệ thống xác thực ENjoy");
            helper.setTo(recipientEmail);
            helper.setSubject("Mã xác thực liên kết gia đình - Hệ thống ENjoy");

            String displayName = (parentName != null && !parentName.trim().isEmpty()) ? parentName : "Phụ huynh của bạn";

            String htmlTemplate = """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 10px;">
                        <tr>
                            <td align="center">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #eef2f5;">
                                    
                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color: #ff5e97; padding: 24px; text-align: center;">
                                            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">LỜI MỜI LIÊN KẾT GIA ĐÌNH</h1>
                                        </td>
                                    </tr>
                                    
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding: 32px 28px;">
                                            <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                                                Chào bạn,
                                            </p>
                                            <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                                                <strong>{{PARENT_NAME}}</strong> vừa gửi lời mời liên kết tài khoản gia đình trên hệ thống <strong>ENjoy</strong> để cùng đồng hành trong quá trình học tập.
                                            </p>
                                            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                                                Vui lòng mở ứng dụng ENjoy, vào mục <strong>Cài đặt &gt; Liên kết gia đình</strong> và nhập mã xác thực dưới đây:
                                            </p>
                                            
                                            <!-- OTP Card Box -->
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                                                <tr>
                                                    <td align="center" style="background-color: #fff2f6; border: 2px dashed #ff5e97; border-radius: 12px; padding: 18px;">
                                                        <span style="display: block; font-size: 32px; font-weight: 700; color: #ff5e97; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                                                            {{OTP_CODE}}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>
 
                                            <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5; color: #64748b;">
                                                ⏱️ Mã xác thực này có hiệu lực trong vòng <strong>24 giờ</strong>.
                                            </p>
                                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #ef4444;">
                                                ⚠️ Vui lòng không chia sẻ mã này nếu bạn không quen biết người gửi.
                                            </p>
                                        </td>
                                    </tr>
 
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f8fafc; padding: 18px 24px; border-top: 1px solid #e2e8f0; text-align: center;">
                                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.4;">
                                                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.<br>
                                                Đây là email tự động từ hệ thống ENjoy, vui lòng không phản hồi.
                                            </p>
                                        </td>
                                    </tr>
 
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """;

            String htmlContent = htmlTemplate
                    .replace("{{PARENT_NAME}}", displayName)
                    .replace("{{OTP_CODE}}", otpCode);

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            System.out.println("📧 [auth-service] Gửi email lời mời gia đình thành công đến: " + recipientEmail + " (OTP: " + otpCode + ")");
        } catch (Exception e) {
            System.err.println("❌ [auth-service] Lỗi khi gửi email lời mời: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi gửi email: " + e.getMessage(), e);
        }
    }
}
