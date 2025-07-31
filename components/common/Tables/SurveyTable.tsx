"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash2, Search } from "lucide-react"
import { CiFilter } from "react-icons/ci"
import { HiDotsVertical } from "react-icons/hi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Survey } from "@/types"
import { deleteSurvey, createSurvey, updateSurvey, getAllSurveys } from "@/app/services/surveyService"
import { SurveyForm } from "./SurveyForm"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"
import { showToast } from "../Toast"

const StatusBadge = ({ status }: { status: Survey["status"] }) => {
  const statusConfig = {
    Active: {
      className: "text-blue-700",
      dotColor: "bg-blue-500"
    },
    Draft: {
      className: "text-gray-700 dark:text-gray-500",
      dotColor: "bg-gray-500 dark:bg-gray-400"
    },
    Closed: {
      className: "text-red-700",
      dotColor: "bg-red-500"
    }
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Draft

  return (
    <Badge variant="outline" className={`${config.className} flex items-center gap-1.5`}>
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
      {status}
    </Badge>
  )
}


const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}


const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  const renderPaginationItems = () => {
    const items = []

 
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => onPageChange(1)}
          isActive={currentPage === 1}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    )

    
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

   
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

  
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <Pagination className="justify-end w-auto mx-0">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={`bg-secondary text-white hover:bg-secondary/70 dark:hover:bg-secondary/70 cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
          />
        </PaginationItem>

        {renderPaginationItems()}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={`bg-secondary text-white hover:bg-secondary/70 dark:hover:bg-secondary/70 cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function SurveyManagementTable() {
  const [data, setData] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [modal, setModal] = useState<{ mode: "create" | "edit"; survey?: Survey } | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; survey: Survey | null }>({
    open: false,
    survey: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Search states
  const [searchValue, setSearchValue] = useState<string>("")
  const [searchBy, setSearchBy] = useState<string>("name")

  const dataFetched = useRef(false)

  
  const handleEdit = (survey: Survey) => {
    setModal({ mode: "edit", survey })
  }

  const handleDeleteClick = (survey: Survey) => {
    setDeleteDialog({ open: true, survey })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.survey) return

    try {
      setIsDeleting(true)
      await deleteSurvey(deleteDialog.survey._id)
      setData((prev) => prev.filter((x) => x._id !== deleteDialog.survey!._id))
     
      showToast({
        variant:"solid",
        tone: "success",
        children: (
          <>
            <div className="font-medium">Survey deleted</div>
            <div className="text-xs ">
              Survey &quot;{deleteDialog.survey.name}&quot; has been successfully deleted.
            </div>
          </>
        ),
      })
      

      setDeleteDialog({ open: false, survey: null })
    } catch (error) {
      console.error('Error deleting survey:', error)
      showToast({
        variant: "solid", // or "solid" based on your theme
        tone: "error",
        children: (
          <>
            <div className="font-medium">Error deleting survey</div>
            <div className="text-xs">
              There was an error deleting the survey. Please try again.
            </div>
          </>
        ),
      })
      
    } finally {
      setIsDeleting(false)
    }
  }

  const saveSurvey = async (values: Partial<Survey>) => {
    try {
      setIsSubmitting(true)

      if (modal?.mode === "create") {
        const newSurvey = await createSurvey(values)
        setData((prev) => [...prev, newSurvey])
        showToast({
          variant: "solid",
          tone: "success",
          children: (
            <>
              <div className="font-medium">Survey created</div>
              <div className="text-xs ">
                Survey &quot;{values.name}&quot; has been successfully created.
              </div>
            </>
          ),
        })
        
      } else if (modal?.mode === "edit" && modal.survey) {
        const updatedSurvey = await updateSurvey(modal.survey._id, values)
        setData((prev) =>
          prev.map((survey) =>
            survey._id === modal.survey!._id ? updatedSurvey : survey
          )
        )
        showToast({
          variant: "solid",
          tone: "success",
          children: (
            <>
              <div className="font-medium">Survey updated</div>
              <div className="text-xs ">
                Survey &quot;{values.name}&quot; has been successfully updated.
              </div>
            </>
          ),
        })
        
      }

      setModal(null)
    } catch (error) {
      console.error('Error saving survey:', error)
      showToast({
        variant: "solid",
        tone: "error",
        children: (
          <>
            <div className="font-medium">Error saving survey</div>
            <div className="text-xs ">
              There was an error saving the survey. Please try again.
            </div>
          </>
        ),
      })
      
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalCancel = () => {
    setModal(null)
  }

  
  const columns: ColumnDef<Survey>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("code")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Survey Name",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.getValue("status")} />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => {
        const isSorted = column.getIsSorted()
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 flex items-center gap-1"
          >
            Start Date
            {isSorted === "asc" ? (
              <ArrowUpDown className="h-4 w-4 rotate-180" />
            ) : isSorted === "desc" ? (
              <ArrowUpDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-sm">{formatDate(row.getValue("startDate"))}</div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId))
        const dateB = new Date(rowB.getValue(columnId))
        return dateA.getTime() - dateB.getTime()
      },
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => {
        const isSorted = column.getIsSorted()
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 flex items-center gap-1"
          >
            End Date
            {isSorted === "asc" ? (
              <ArrowUpDown className="h-4 w-4 rotate-180" />
            ) : isSorted === "desc" ? (
              <ArrowUpDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-sm">{formatDate(row.getValue("endDate"))}</div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId))
        const dateB = new Date(rowB.getValue(columnId))
        return dateA.getTime() - dateB.getTime()
      },
    },
    {
      accessorKey: "respondents",
      header: () => <div>Respondents</div>,
      cell: ({ row }) => (
        <div className="text-left font-medium">
          {row.getValue("respondents")}
        </div>
      ),
    },
    {
      accessorKey: "cost",
      header: () => <div className="text-right">Cost</div>,
      cell: ({ row }) => {
        const survey = row.original
        const formatCost = (cost: number) => {
          if (cost >= 1000) {
            return `${cost / 1000}K`
          }
          return cost.toString()
        }
        return (
          <div className="text-right font-medium">
            {survey.currency}{formatCost(survey.cost)}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const survey = row.original

        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <HiDotsVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleEdit(survey)} className="group cursor-pointer">
                  <Edit className="h-4 w-4 group-hover:text-white" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteClick(survey)}
                  className="group "
                >
                  <Trash2 className="h-4 w-4 group-hover:text-white" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  
  useEffect(() => {
    if (dataFetched.current) return

    const loadData = async () => {
      try {
        setLoading(true)
        dataFetched.current = true
        const surveyData = await getAllSurveys()
        setData(surveyData)
      } catch (error) {
        console.error('Error fetching survey data:', error)
        showToast({
          variant: "solid",
          tone: "error",
          children: (
            <>
              <div className="font-medium">Error loading surveys</div>
              <div className="text-xs opacity-80">
                There was an error loading the surveys. Please refresh the page.
              </div>
            </>
          ),
        })
        
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])


  useEffect(() => {
    if (statusFilter === "" || statusFilter === "all") {
      table.getColumn("status")?.setFilterValue("")
    } else {
      table.getColumn("status")?.setFilterValue([statusFilter])
    }
  }, [statusFilter, table])

  // Search filter effect
  useEffect(() => {
    if (searchValue.trim() === "") {
      table.getColumn(searchBy)?.setFilterValue("")
    } else {
      table.getColumn(searchBy)?.setFilterValue(searchValue)
    }
  }, [searchValue, searchBy, table])

  const filteredAndSortedData = table.getSortedRowModel().rows
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)


  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageData = filteredAndSortedData.slice(startIndex, endIndex)

 
  useEffect(() => {
    setCurrentPage(1)
  }, [columnFilters, sorting, itemsPerPage])

 
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
  }

  
  const statusOptions = Array.from(new Set(data.map(survey => survey.status)))

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading surveys...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-0 border-0 shadow-none">
        <CardContent className="p-0">
          <div className="flex gap-4 items-center mb-4 dark:pt-4 dark:ps-4 flex-wrap justify-between">
            <div className="flex gap-2 items-center">
              <Select
                value={searchBy}
                onValueChange={setSearchBy}
              >
                <SelectTrigger className="w-[160px] !h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Survey Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search by ${searchBy === 'name' ? 'Survey Name' : 'Category'}...`}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-9 w-[280px] !h-10 dark:border-gray-600 border-2"
                />
              </div>
            </div>
            <div className="flex gap-4 items-center"> 
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px] !h-10">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CiFilter size={35} className="text-secondary" />
            <Dialog open={modal !== null} onOpenChange={(open) => !open && setModal(null)}>
              <DialogTrigger asChild>
                <Button onClick={() => setModal({ mode: "create" })}>+ Create Survey</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {modal?.mode === "create" ? "Create New Survey" : "Edit Survey"}
                  </DialogTitle>
                </DialogHeader>
                <SurveyForm
                  initialData={modal?.survey}
                  onSubmit={saveSurvey}
                  onCancel={handleModalCancel}
                  isLoading={isSubmitting}
                />
              </DialogContent>
            </Dialog>
            </div>
            
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader className="dark:bg-zinc-700">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="py-3 text-zinc-500">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {currentPageData?.length ? (
                  currentPageData.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No surveys found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-4 w-full px-4 dark:pb-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} surveys
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </CardContent>
      </Card>
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, survey: deleteDialog.survey })}
        survey={deleteDialog.survey}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  )
}