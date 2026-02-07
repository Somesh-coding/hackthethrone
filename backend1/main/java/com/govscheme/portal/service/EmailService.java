package com.govscheme.portal.service;

import com.govscheme.portal.model.Scheme;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${app.url}")
    private String appUrl;
    
    @Async
    public void sendOtpEmail(String toEmail, String otp, String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your OTP for Email Verification - Government Scheme Portal");
            
            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1565C0 0%%, #0D47A1 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .otp-box { background: white; border: 2px dashed #1565C0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .otp-code { font-size: 2.5rem; font-weight: bold; color: #1565C0; letter-spacing: 10px; font-family: 'Courier New', monospace; }
                        .warning { background: #FFF3E0; padding: 15px; border-left: 4px solid #FF9800; margin: 20px 0; border-radius: 4px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🇮🇳 भारत सरकार | Government of India</h1>
                            <p>सरकारी योजना पोर्टल | Government Scheme Portal</p>
                        </div>
                        <div class="content">
                            <h2>नमस्ते %s, | Welcome %s!</h2>
                            <p>आपके ईमेल को सत्यापित करने के लिए यहाँ आपका OTP है:</p>
                            <p>Here is your OTP to verify your email:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0; color: #666;">आपका सत्यापन कोड | Your Verification Code</p>
                                <div class="otp-code">%s</div>
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ महत्वपूर्ण | Important:</strong>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>यह OTP केवल <strong>10 मिनट</strong> के लिए वैध है | This OTP is valid for <strong>10 minutes</strong> only</li>
                                    <li>किसी के साथ साझा न करें | Do not share with anyone</li>
                                    <li>लॉगिन पेज पर दर्ज करें | Enter on login page</li>
                                </ul>
                            </div>
                            
                            <p style="color: #666;">
                                यदि आपने यह अनुरोध नहीं किया है, तो कृपया इस ईमेल को अनदेखा करें।<br>
                                If you didn't request this, please ignore this email.
                            </p>
                        </div>
                        <div class="footer">
                            <p>© 2026 भारत सरकार | Government of India</p>
                            <p>सरकारी योजना पोर्टल | Government Scheme Portal</p>
                        </div>
                    </div>
                </body>
                </html>
                """, userName, userName, otp);
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
    
    @Async
    public void sendNewSchemeNotification(String toEmail, String userName, Scheme scheme) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🎯 New Scheme Alert: " + scheme.getName());
            
            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #11998e 0%%, #38ef7d 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .scheme-card { background: white; padding: 20px; border-left: 4px solid #11998e; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                        .button { display: inline-block; padding: 12px 30px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                        .badge { display: inline-block; padding: 5px 10px; background: #38ef7d; color: white; border-radius: 3px; font-size: 12px; margin: 5px 5px 5px 0; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎯 New Scheme Available!</h1>
                            <p>A scheme matching your profile has been added</p>
                        </div>
                        <div class="content">
                            <h2>Dear %s,</h2>
                            <p>Great news! A new government scheme that matches your eligibility criteria has been added to our portal.</p>
                            
                            <div class="scheme-card">
                                <h3>%s</h3>
                                <span class="badge">%s</span>
                                <span class="badge">%s</span>
                                <p><strong>Department:</strong> %s</p>
                                <p>%s</p>
                                <p><strong>Key Benefits:</strong></p>
                                <ul>
                                    %s
                                </ul>
                            </div>
                            
                            <div style="text-align: center;">
                                <a href="%s" class="button">View Full Details</a>
                                <a href="%s" class="button" style="background: #667eea;">Apply Now</a>
                            </div>
                            
                            <p style="margin-top: 20px; color: #666; font-size: 14px;">
                                💡 <strong>Tip:</strong> Don't miss out on this opportunity! Review the eligibility criteria and apply before the deadline.
                            </p>
                        </div>
                        <div class="footer">
                            <p>© 2026 Government Scheme Portal | Stay Updated, Stay Benefited</p>
                            <p>You're receiving this email because you're registered on our portal.</p>
                        </div>
                    </div>
                </body>
                </html>
                """, 
                userName,
                scheme.getName(),
                scheme.getCategory(),
                scheme.getDepartment(),
                scheme.getMinistry() != null ? scheme.getMinistry() : "N/A",
                scheme.getShortDescription(),
                scheme.getBenefits() != null ? String.join("", scheme.getBenefits().stream().map(b -> "<li>" + b + "</li>").toList()) : "",
                appUrl + "/schemes/" + scheme.getId(),
                scheme.getOfficialWebsite() != null ? scheme.getOfficialWebsite() : appUrl + "/schemes/" + scheme.getId()
            );
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send scheme notification email", e);
        }
    }
    
    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to Government Scheme Portal! 🇮🇳");
            
            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
                        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Email Verified Successfully!</h1>
                        </div>
                        <div class="content">
                            <h2>Welcome aboard, %s! 🎉</h2>
                            <p>Your email has been successfully verified. You now have full access to discover government schemes tailored for you.</p>
                            
                            <h3>What you can do now:</h3>
                            <div class="feature">
                                <strong>🎯 Discover Eligible Schemes</strong>
                                <p>View personalized scheme recommendations based on your profile</p>
                            </div>
                            <div class="feature">
                                <strong>🔔 Get Notified</strong>
                                <p>Receive email alerts when new schemes matching your criteria are added</p>
                            </div>
                            <div class="feature">
                                <strong>📝 Track Applications</strong>
                                <p>Keep track of schemes you're interested in and their deadlines</p>
                            </div>
                            
                            <div style="text-align: center;">
                                <a href="%s/dashboard" class="button">Go to Dashboard</a>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """, userName, appUrl);
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }
}
