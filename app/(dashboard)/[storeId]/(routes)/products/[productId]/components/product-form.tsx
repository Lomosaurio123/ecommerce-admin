"use client";

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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Image, Product, Color, Category, Size } from "@prisma/client";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    wholesalePrice: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    amount: z.coerce.number().min(1)
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product & {
        images: Image[];
    } | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    colors,
    sizes
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar producto" : "Crear producto";
    const description = initialData ? "Edita el producto" : "Añade un producto";
    const toastMessage = initialData ? "Producto editado." : "Producto creado.";
    const action = initialData ? "Guardar Cambios" : "Crear";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                  ...initialData,
                  price: parseFloat(String(initialData.price)),
                  wholesalePrice: parseFloat(String(initialData.price)),
                  amount: parseInt(String(initialData.amount))
              }
            : {
                  name: "",
                  images: [],
                  price: 0,
                  wholesalePrice: 0,
                  categoryId: "",
                  colorId: "",
                  sizeId: "",
                  isFeatured: false,
                  isArchived: false,
                  amount: 0
              }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }

            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Algo salió mal");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Producto eliminado correctamente");
        } catch (error) {
            toast.error("Algo salió mal");
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

                    <FormField control={form.control} name="images" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Imagenes del producto: (Puedes subir varias)</FormLabel>
                                    <FormControl>
                                        <ImageUpload 
                                            value={field.value.map( (image) => image.url )}
                                            disabled={loading}
                                            onChange={(url) => field.onChange([...field.value, {url}])}
                                            onRemove={(url) => field.onChange([...field.value.filter(( current ) => current.url !== url)])}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                    <div className="grid grid-cols-3 gap-8">

                        <FormField control={form.control} name="name" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Nombre:</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre del producto" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                        <FormField control={form.control} name="price" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Precio:</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                        <FormField control={form.control} name="wholesalePrice" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Precio Mayoreo:</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                        <FormField control={form.control} name="amount" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Cantidad:</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="0" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                        <FormField control={form.control} name="categoryId" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Categoria:</FormLabel>
                                    <FormControl>
                                       <Select disabled = {loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>

                                            <FormControl>
                                                <SelectTrigger>
                                                
                                                    <SelectValue defaultValue={field.value} placeholder="Selecciona la categoria" />

                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                                ))}
                                            </SelectContent>

                                       </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                        <FormField control={form.control} name="sizeId" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Tamaño:</FormLabel>
                                    <FormControl>
                                       <Select disabled = {loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>

                                            <FormControl>
                                                <SelectTrigger>
                                                
                                                    <SelectValue defaultValue={field.value} placeholder="Selecciona el tamaño" />

                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {sizes.map((size) => (
                                                    <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                                ))}
                                            </SelectContent>

                                       </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                        <FormField control={form.control} name="colorId" 
                            render={ ( { field } ) => (

                                <FormItem>
                                    <FormLabel>Color:</FormLabel>
                                    <FormControl>
                                       <Select disabled = {loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>

                                            <FormControl>
                                                <SelectTrigger>
                                                
                                                    <SelectValue defaultValue={field.value} placeholder="Selecciona el color" />

                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {colors.map((color) => (
                                                    <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                                                ))}
                                            </SelectContent>

                                       </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                 
                            ) } 
                        />

                        <FormField control={form.control} name="isFeatured" 
                            render={ ( { field } ) => (

                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />

                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Principal
                                        </FormLabel>
                                        <FormDescription>
                                            Este producto aparecerá en el HomePage
                                        </FormDescription>
                                    </div>
                                </FormItem>
                                 
                            ) } 
                        />


                        <FormField control={form.control} name="isArchived" 
                            render={ ( { field } ) => (

                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />

                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archivar
                                        </FormLabel>
                                        <FormDescription>
                                            Este producto estará archivado y no aparecerá en la tienda
                                        </FormDescription>
                                    </div>
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