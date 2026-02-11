using System.Net;
using System.Net.Mail;

namespace PetConnectAlmost.Services
{
    public class EmailService
    {
        public async Task SendOtp(string toEmail, string otp, string userName = "Valued User") {
            try {
                var mail = new MailMessage();
                mail.From = new MailAddress("gauravb5560@gmail.com", "PetConnectAlmost Team");
                mail.To.Add(toEmail);
                mail.Subject = "PetConnectAlmost - Your Security Verification Code";
                
                mail.IsBodyHtml = true;
                mail.Body = $@"
                <div style='font-family: ""Segoe UI"", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 15px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #ffb703; margin: 0;'>Welcome to PetConnectAlmost!</h1>
                    </div>
                    
                    <p style='color: #475569; font-size: 16px; line-height: 1.5;'>Dear {userName},</p>
                    
                    <p style='color: #475569; font-size: 16px; line-height: 1.5;'>
                        Thank you for using PetConnectAlmost. For your security, please use the following One-Time Password (OTP) to verify your account:
                    </p>
                    
                    <div style='background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 10px; margin: 25px 0;'>
                        <span style='font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #1e293b; font-family: monospace;'>{otp}</span>
                    </div>
                    
                    <p style='color: #64748b; font-size: 14px; text-align: center;'>
                        This code is valid for <strong>5 minutes</strong>.
                    </p>
                    
                    <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;'>
                    
                    <p style='color: #94a3b8; font-size: 12px; font-style: italic;'>
                        If you did not request this code, please ignore this email or contact our support if you have concerns.
                    </p>
                </div>";

                using (var smtp = new SmtpClient("smtp.gmail.com", 587)) {
                    smtp.Credentials = new NetworkCredential("gauravb5560@gmail.com", "hhqu zaqr xprv daxl");
                    smtp.EnableSsl = true;
                    await smtp.SendMailAsync(mail);
                }
            } catch (Exception ex) {
                // Log error
                Console.WriteLine($"Email sending failed: {ex.Message}");
                // We don't throw here to avoid crashing the login process, 
                // but in production you'd want proper logging.
            }
        }
    }
}
