import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
    req: Request
  ) {
    try {

      const { phone } = await req.json();
      if (!phone) {
        return new NextResponse("Phone is required", { status: 400 });
      }
  
      const orders = await prismadb.order.findMany({
        where: {
          phone: phone
        }
      });
    
      return NextResponse.json(orders);
    } catch (error) {
      console.log('[ORDERS_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };