import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req : Request,
    { params } : { params: { orderId : string } }
) {

    try {

        const { userId } = auth();

        const body = await req.json();

        var { isPaid } = body;

        if( !userId ) {
            return new NextResponse( "Unauthenticated", { status : 401 } );
        }

        if( !isPaid ) {
            return new NextResponse( "Paid state is required", { status : 400 } );
        }

        if( !params.orderId ) {
            return new NextResponse( "Order id is required", { status : 400 } );
        }

        isPaid = !isPaid; // Cambia el valor de isPaid al valor opuesto

        const order = await prismadb.order.update({
            where : {
                id : params.orderId,
            },
            data : {
                isPaid
            }
        });

        return NextResponse.json( order ); 
        
    } catch (error) {
        console.log('[ORDER_PATCH]', error);
        return new NextResponse("Internal Error", { status : 500 });
    }
    
};

