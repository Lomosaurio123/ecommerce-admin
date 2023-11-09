
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
    try {

      const { productIds, phone, address, totalPrice } = await req.json();

      if (!phone) {
        return new NextResponse("Phone is required", { status: 403 });
      }

      if (!address) {
        return new NextResponse("Address is required", { status: 403 });
      }

      if (!totalPrice) {
        return new NextResponse("Total price is required", { status: 403 });
      }

      if (!productIds || productIds.length === 0) {
        return new NextResponse("Product ids are required", { status: 400 });
      }
    
      const products = await prismadb.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      });
  
    
      const order = await prismadb.order.create({
        data: {
          phone,
          address,
          totalPrice,
          storeId: params.storeId,
          isPaid: false,
          orderItems: {
            create: productIds.map((productId: string) => ({
              product: {
                connect: {
                  id: productId
                }
              }
            }))
          }
        }
      });

      return NextResponse.json( order , {
        headers: corsHeaders
      } )
      
    } catch (error) {
      console.log('[CHECKOUT_POST]', error);
      return new NextResponse("Internal error", { status: 500 });
    }

};