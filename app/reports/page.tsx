import DashboardLayout from '@/components/Layouts/DashboardLayout'
import React from 'react'
import Reports from './Reports'

const page = () => {
  return (
   <DashboardLayout>
    <Reports />
   </DashboardLayout>
  )
}

export default page