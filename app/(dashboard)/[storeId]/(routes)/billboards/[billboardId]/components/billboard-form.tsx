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
import { Billboard } from "@prisma/client";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    label : z.string().min(1),
    imageUrl : z.string().min(1)
});

type BillboardFormValues = z.infer< typeof formSchema >

interface BillboardFormProps {
    initialData : Billboard | null;
}


export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar cartelera" : "Crear cartelera";
    const description = initialData ? "Edita la cartelera" : "Añade una cartelera";
    const toastMessage = initialData ? "Cartelera editada." : "Cartelera creada.";
    const action = initialData ? "Guardar Cambios" : "Crear";

    const form = useForm<BillboardFormValues>({
        resolver : zodResolver(formSchema),
        defaultValues : initialData || {
            label : '',
            imageUrl : ''
        }
    });

    const onSubmit = async ( data: BillboardFormValues ) => {
        try {
            setLoading(true);

            if( initialData ){
                await axios.patch( `/api/${ params.storeId }/billboards/${params.billboardId}`, data );
            } else {
                await axios.post( `/api/${ params.storeId }/billboards`, data );
            }

            router.refresh();
            router.push(`/${params.storeId}/billboards`);
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
            await axios.delete( `/api/${ params.storeId }/billboards/${params.billboardId}` );
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success('Cartelera eliminada correctamente');
        } catch (error) {
            toast.error("Algo salio mal, asegurate de haber eliminado todas las categorias que tengan que ver con este poster");
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

                    <FormField control={form.control} name="imageUrl" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Background image:</FormLabel>
                                    <FormControl>
                                        <ImageUpload 
                                            value={field.value ? [field.value] : []}
                                            disabled={loading}
                                            onChange={(url) => field.onChange(url)}
                                            onRemove={() => field.onChange("")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                    <div className="grid grid-cols-3 gap-8">

                        <FormField control={form.control} name="label" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Cartelera:</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre de la cartelera" {...field}/>
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