"use client";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OrderColumn } from "./columns";
import { Button } from "@/components/ui/button";

interface CellActionProps {

    data : OrderColumn;

}


export const CellAction : React.FC<CellActionProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    
    const onCopy = (id : string) => {
        navigator.clipboard.writeText( id )
        toast.success("ID Copiado");
    }


    const onChagePaid = async () => {
        try {
            setLoading(true);
            await axios.patch( `/api/${ params.storeId }/orders/${data.id}` );
            router.refresh();
            toast.success('Pago actualizado correctamente');
        } catch (error) {
            toast.error("Algo salio mal");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }


    return (

        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onChagePaid}>
                        <Edit className="mr-2 h-4 w-4" />
                        Cambiar el estado de pago
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </>

    );

};