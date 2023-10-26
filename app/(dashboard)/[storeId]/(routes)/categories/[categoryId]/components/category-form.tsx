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
import { Billboard, Category } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    name : z.string().min(1),
    billboardId : z.string().min(1)
});

type CategoryFormValues = z.infer< typeof formSchema >

interface CategoryFormProps {
    initialData : Category | null;
    billboards : Billboard[];
}


export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar categoria" : "Crear categoria";
    const description = initialData ? "Edita la categoria" : "Añade una categoria";
    const toastMessage = initialData ? "Categoria editada." : "Categoria creada.";
    const action = initialData ? "Guardar Cambios" : "Crear";

    const form = useForm<CategoryFormValues>({
        resolver : zodResolver(formSchema),
        defaultValues : initialData || {
            name : '',
            billboardId : ''
        }
    });

    const onSubmit = async ( data: CategoryFormValues ) => {
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


                    <div className="grid grid-cols-3 gap-8">

                        <FormField control={form.control} name="name" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Nombre:</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre de la categoria" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                        <FormField control={form.control} name="billboardId" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Cartelera:</FormLabel>
                                    <FormControl>
                                       <Select disabled = {loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>

                                            <FormControl>
                                                <SelectTrigger>
                                                
                                                    <SelectValue defaultValue={field.value} placeholder="Selecciona el cartel" />

                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {billboards.map((billboard) => (
                                                    <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                                                ))}
                                            </SelectContent>

                                       </Select>
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