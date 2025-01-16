import { PageTitle } from "@/core/components/PageTitle"
import Image from "next/image"

export function MainDashboard() {
  return (
    <>
      <PageTitle content="Dashboard" />
      <Image
        src="/images/dashboardMock.svg"
        alt="dashboard"
        width={1000}
        height={800}
      />
    </>
  )
}
