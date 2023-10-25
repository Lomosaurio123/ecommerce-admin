"use client"

import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";


interface SettingsFormProps {
    initialData : Store;
}

const formSchema = z.object({
    name : z.string().min(1)
});

type SettingsFormValues = z.infer< typeof formSchema >

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver : zodResolver(formSchema),
        defaultValues : initialData
    });

    const onSubmit =async ( data: SettingsFormValues ) => {
        console.log(data);
    };

    return (

        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title = "Configuración"
                    description = "Maneja las preferencias de la tienda"
                />
                <Button variant="destructive" size='icon' onClick={() => setOpen(true)} disabled = {loading}>

                    <Trash className="h-4 w-4"/>

                </Button>
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
                                        <Input disabled={loading} placeholder="Nombre de la tienda" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                    </div>

                    <Button disabled = {loading} className="ml-auto" type="submit"> Guardar Cambios </Button>

                </form>

            </Form>
        </>

    );
}