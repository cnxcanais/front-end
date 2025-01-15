import Image from 'next/image'
import { PageHeader } from '@/app/core/components/page-header'

export function MainDashboard () {
  return (
    <>
      <PageHeader headName='Dashboard'/>
      <Image src='/images/dashboardMock.svg' alt="Dashboard" width={1000} height={800}/>
    </>
      
  )
}