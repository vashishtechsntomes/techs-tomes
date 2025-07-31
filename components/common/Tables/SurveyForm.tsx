import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Survey } from "@/types"

const surveySchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Survey name is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Active", "Draft", "Closed"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  respondents: z.string().min(1, "Respondents is required"),
  cost: z.number().min(0, "Cost must be 0 or greater"),
  currency: z.enum(["₹", "$", "€", "£"]),
})  

type SurveyFormData = z.infer<typeof surveySchema>

interface SurveyFormProps {
  initialData?: Survey
  onSubmit: (data: Partial<Survey>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function SurveyForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: SurveyFormProps) {
  
  const formatCostForDisplay = (cost: number): string => {
    if (cost >= 1000) {
      return (cost / 1000).toString()
    }
    return cost.toString()
  }

  
  const parseCostFromDisplay = (displayValue: string): number => {
    const numericValue = parseFloat(displayValue)
    if (isNaN(numericValue)) return 0
    return numericValue >= 1 ? numericValue * 1000 : numericValue
  }

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      category: initialData?.category || "",
      status: initialData?.status || "Draft",
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
      respondents: initialData?.respondents || "",
      cost: initialData?.cost || 0,
      currency: initialData?.currency || "₹",
    },
  })

  const handleSubmit = async (data: SurveyFormData) => {
    try {
      
      const submitData = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      }
      await onSubmit(submitData)
    } catch (error) {
      console.error("Error submitting survey:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter survey code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Survey Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter survey name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="respondents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Respondents</FormLabel>
                <FormControl>
                  <Input placeholder="Enter respondents" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost (in K)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    placeholder="4 (for 4K)"
                    value={formatCostForDisplay(field.value)}
                    onChange={(e) => {
                      const displayValue = e.target.value
                      const actualCost = displayValue === '' ? 0 : parseCostFromDisplay(displayValue)
                      field.onChange(actualCost)
                    }}
                  />
                </FormControl>
                <FormMessage />
                <div className="text-xs text-muted-foreground">
                  Enter value in thousands (e.g., 4 = 4K = 4000)
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="₹">₹ (INR)</SelectItem>
                    <SelectItem value="$">$ (USD)</SelectItem>
                    <SelectItem value="€">€ (EUR)</SelectItem>
                    <SelectItem value="£">£ (GBP)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Survey" : "Create Survey"}
          </Button>
        </div>
      </form>
    </Form>
  )
}