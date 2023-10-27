"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Productos",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Dirección",
  },
  {
    accessorKey: "totalPrice",
    header: "Precio total",
  },
  {
    accessorKey: "isPaid",
    header: "Status pago",
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
