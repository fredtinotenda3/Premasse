// app/api/test-resend/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM ?? "Premasse <onboarding@resend.dev>";
  
  if (!apiKey) {
    return NextResponse.json({ 
      success: false, 
      error: "RESEND_API_KEY is not set" 
    }, { status: 500 });
  }
  
  const resend = new Resend(apiKey);
  const testEmail = "fredtinotenda3@gmail.com";
  
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [testEmail],
      subject: "📧 TEST: Premasse Email Configuration",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 20px;">
          <h1 style="color: #1B5E20;">✅ Resend is working!</h1>
          <p>This test email confirms your API key is configured correctly.</p>
          
          <div style="background: #E8F5E9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>📧 If you can't see this email:</strong><br>
            1. Check your <strong>Spam/Junk folder</strong><br>
            2. Mark this email as "Not Spam"<br>
            3. Add <strong>noreply@resend.dev</strong> to your contacts
          </div>
          
          <p style="color: #666; font-size: 12px;">Sent from: ${fromEmail}</p>
          <hr />
          <p style="color: #666; font-size: 12px;">Premasse Business Services</p>
        </div>
      `,
    });
    
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Test email sent! Check your inbox AND spam folder.",
      from: fromEmail,
      to: testEmail,
      data 
    });
    
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      error: String(err) 
    }, { status: 500 });
  }
}