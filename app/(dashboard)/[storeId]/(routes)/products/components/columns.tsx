"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string
  price: string
  wholesalePrice: string
  amount_wholesalePrice: string
  size: string
  category: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  amount: string
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "isArchived",
    header: "Archivado",
  },
  {
    accessorKey: "isFeatured",
    header: "Principal",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "wholesalePrice",
    header: "Precio Mayoreo",
  },
  {
    accessorKey: "amount_wholesalePrice",
    header: "Cantidad para conciderar mayoreo",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "size",
    header: "Tamaño",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell : ({row}) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor : row.original.color }}/> 
      </div>
    )
  },
  {
    accessorKey: "amount",
    header: "Cantidad",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id : "actions",
    cell : ({ row }) => <CellAction data={row.original} />
  }
]
