// app/api/test-resend/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM ?? "Premasse <onboarding@resend.dev>";
  
  console.log("=== Testing Resend Configuration ===");
  console.log("API Key exists:", !!apiKey);
  console.log("API Key value:", apiKey);
  console.log("From email:", fromEmail);
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  
  if (!apiKey) {
    return NextResponse.json({ 
      success: false, 
      error: "RESEND_API_KEY is not set in environment variables" 
    }, { status: 500 });
  }
  
  const resend = new Resend(apiKey);
  
  try {
    // Send to your own email for testing
    const testEmail = "fredtinotenda3@gmail.com"; // Your email
    
    console.log(`Sending test email to: ${testEmail}`);
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [testEmail],
      subject: "Test email from Premasse - Resend is working!",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 20px;">
          <h1 style="color: #1B5E20;">✅ Resend is configured correctly!</h1>
          <p>This test email confirms your API key is working.</p>
          <p>API Key used: ${apiKey.substring(0, 15)}...</p>
          <hr />
          <p style="color: #666;">Premasse Business Services</p>
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
    
    console.log("Email sent successfully:", data);
    
    return NextResponse.json({ 
      success: true, 
      message: "Test email sent! Check your inbox.",
      data 
    });
    
  } catch (err) {
    console.error("Exception:", err);
    return NextResponse.json({ 
      success: false, 
      error: String(err) 
    }, { status: 500 });
  }
}