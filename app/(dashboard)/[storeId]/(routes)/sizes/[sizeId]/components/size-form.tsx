"use client"

import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Size } from "@prisma/client";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    name : z.string().min(1),
    value : z.string().min(1)
});

type SizeFormValues = z.infer< typeof formSchema >

interface SizeFormProps {
    initialData : Size | null;
}


export const SizeForm: React.FC<SizeFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar tamaño" : "Crear tamaño";
    const description = initialData ? "Edita el tamaño" : "Añade un tamaño";
    const toastMessage = initialData ? "Tamaño editado." : "Tamaño creado.";
    const action = initialData ? "Guardar Cambios" : "Crear";

    const form = useForm<SizeFormValues>({
        resolver : zodResolver(formSchema),
        defaultValues : initialData || {
            name : '',
            value : ''
        }
    });

    const onSubmit = async ( data: SizeFormValues ) => {
        try {
            setLoading(true);

            if( initialData ){
                await axios.patch( `/api/${ params.storeId }/sizes/${params.sizeId}`, data );
            } else {
                await axios.post( `/api/${ params.storeId }/sizes`, data );
            }

            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Algo salio mal");
        } finally {
            setLoading(false);
        }
    };

    const onDelete =async () => {
        try {
            setLoading(true);
            await axios.delete( `/api/${ params.storeId }/sizes/${params.sizeId}` );
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success('Tamaño eliminado correctamente');
        } catch (error) {
            toast.error("Algo salio mal, asegurate de haber eliminado todos los productos que usan este tamaño");
        } finally {
            setLoading(false);
        }
    };

    return (

        <>
            <AlertModal 
            
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            
            <div className="flex items-center justify-between">
                <Heading 
                    title = {title}
                    description = {description}
                />
                {initialData && (
                    <Button variant="destructive" size='icon' onClick={() => setOpen(true)} disabled = {loading}>

                        <Trash className="h-4 w-4"/>

                    </Button>
                )}
            </div>

            <Separator />

            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    <div className="grid grid-cols-3 gap-8">

                        <FormField control={form.control} name="name" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Nombre:</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre del tamaño" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                        <FormField control={form.control} name="value" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Valor:</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Valor del tamaño" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                    </div>

                    <Button disabled = {loading} className="ml-auto" type="submit"> {action} </Button>

                </form>

            </Form>
            <Separator/>
        </>

    );
}