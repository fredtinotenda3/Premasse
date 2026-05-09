import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.payment.updateMany({
      where: {
        requestId: "cmoy4c3vq0002da0h0l15vfwi",
        status: { in: ["PENDING", "AWAITING_PAYMENT"] }
      },
      data: { status: "CANCELLED" }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `Cancelled ${result.count} payment(s)`,
      count: result.count 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    });
  }
}