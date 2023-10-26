"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface  CategoryClientProps {
    data : CategoryColumn[]
}

export const CategoryClient : React.FC<CategoryClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return(
        <>
            <div className="flex items-center justify-between">

                <Heading title={`Categorias (${data.length})`} description="Maneja tus categorias" /> 

                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>

            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name"/>
            <Heading title="API" description="Llamadas a API para las categorias"/>
            <Separator />
            <ApiList entityName="categories" entityIdName="categoryId"/>
        </>
    );

}