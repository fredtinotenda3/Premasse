
// app/api/test-paynow/route.ts
import { NextResponse } from "next/server";
import { createPaynowClient } from "@/lib/paynow";

export async function GET() {
  const integrationId = process.env.PAYNOW_INTEGRATION_ID;
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY;
  
  console.log("=== Testing Paynow Configuration ===");
  console.log("Integration ID present:", !!integrationId);
  console.log("Integration ID value:", integrationId);
  console.log("Integration Key present:", !!integrationKey);
  
  if (!integrationId || !integrationKey) {
    return NextResponse.json({ 
      success: false, 
      error: "PAYNOW_INTEGRATION_ID and PAYNOW_INTEGRATION_KEY must be set" 
    }, { status: 500 });
  }
  
  try {
    // Try to create a client
    const client = createPaynowClient("test-request-id");
    
    return NextResponse.json({ 
      success: true, 
      message: "Paynow client created successfully",
      integrationId: integrationId.substring(0, 10) + "..."
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}