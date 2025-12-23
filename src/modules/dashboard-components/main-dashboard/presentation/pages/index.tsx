"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { DashboardIndicators } from "@/modules/propostas-components/propostas/presentation/components/DashboardIndicators"
import { SeguradosDashboard } from "@/modules/segurados-components/segurado/presentation/components/SeguradosDashboard"
import { FileText, IdentificationBadge } from "@phosphor-icons/react"

export function MainDashboard() {
  // const MOCK_DATA = [
  //   {
  //     companyName: "Porto Seguro",
  //     logoImage: "/images/porto-logo.png",
  //     mainColor: "text-blue-400",
  //     cardColor: "bg-blue-50",
  //     tags: [
  //       { label: "Auto", icon: <Truck size={14} /> },
  //       { label: "Residencial", icon: <House size={14} /> },
  //       { label: "Vida", icon: <Heart size={14} /> },
  //       { label: "Saúde", icon: <Stethoscope size={14} /> },
  //     ],
  //     summary: [
  //       {
  //         name: "Auto",
  //         count: 138,
  //         value: "163.797.858,00",
  //         color: "text-green-600",
  //       },
  //       {
  //         name: "Residencial",
  //         count: 52,
  //         value: "25.095.668,00",
  //         color: "text-green-600",
  //       },
  //       {
  //         name: "Vida",
  //         count: 103,
  //         value: "98.624.972,00",
  //         color: "text-green-600",
  //       },
  //       {
  //         name: "Saúde",
  //         count: 101,
  //         value: "79.259.851,00",
  //         color: "text-green-600",
  //       },
  //     ],
  //   },

  //   {
  //     companyName: "Itaú Seguros",
  //     logoImage: "/images/itau-logo.png",
  //     mainColor: "text-orange-200",
  //     cardColor: "bg-orange-50",
  //     tags: [
  //       { label: "Auto", icon: <Truck size={14} /> },
  //       { label: "Residencial", icon: <House size={14} /> },
  //       { label: "Vida", icon: <Heart size={14} /> },
  //       { label: "Saúde", icon: <Stethoscope size={14} /> },
  //     ],
  //     summary: [
  //       {
  //         name: "Auto",
  //         count: 159,
  //         value: "206.003.458,00",
  //         color: "text-orange-600",
  //       },
  //       {
  //         name: "Residencial",
  //         count: 52,
  //         value: "25.095.668,00",
  //         color: "text-orange-600",
  //       },
  //       {
  //         name: "Vida",
  //         count: 103,
  //         value: "98.624.972,00",
  //         color: "text-orange-600",
  //       },
  //       {
  //         name: "Saúde",
  //         count: 101,
  //         value: "79.259.851,00",
  //         color: "text-orange-600",
  //       },
  //     ],
  //   },

  //   {
  //     companyName: "Bradesco Seguros",
  //     logoImage: "/images/brad-logo.png",
  //     mainColor: "text-red-400",
  //     cardColor: "bg-red-50",
  //     tags: [
  //       { label: "Auto", icon: <Truck size={14} /> },
  //       { label: "Residencial", icon: <House size={14} /> },
  //       { label: "Vida", icon: <Heart size={14} /> },
  //       { label: "Saúde", icon: <Stethoscope size={14} /> },
  //     ],
  //     summary: [
  //       {
  //         name: "Auto",
  //         count: 138,
  //         value: "155.797.858,00",
  //         color: "text-green-600",
  //       },
  //       {
  //         name: "Residencial",
  //         count: 52,
  //         value: "20.095.668,00",
  //         color: "text-green-600",
  //       },
  //       {
  //         name: "Vida",
  //         count: 103,
  //         value: "98.650.972,00",
  //         color: "text-green-600",
  //       },
  //       {
  //         name: "Saúde",
  //         count: 101,
  //         value: "79.259.850,00",
  //         color: "text-green-600",
  //       },
  //     ],
  //   },

  //   {
  //     companyName: "Azul Seguros",
  //     logoImage: "/images/azul-logo.jpeg",
  //     mainColor: "text-blue-200",
  //     cardColor: "bg-blue-50",
  //     tags: [
  //       { label: "Auto", icon: <Truck size={14} /> },
  //       { label: "Residencial", icon: <House size={14} /> },
  //       { label: "Vida", icon: <Heart size={14} /> },
  //       { label: "Saúde", icon: <Stethoscope size={14} /> },
  //     ],
  //     summary: [
  //       {
  //         name: "Auto",
  //         count: 138,
  //         value: "155.797.858,00",
  //         color: "text-green-600",
  //       },
  //       {
  //         name: "Residencial",
  //         count: 52,
  //         value: "20.095.668,00",
  //         color: "text-green-600",
  //       },
  //       {
  //         name: "Vida",
  //         count: 103,
  //         value: "98.650.972,00",
  //         color: "text-green-600",
  //       },
  //       {
  //         name: "Saúde",
  //         count: 101,
  //         value: "79.259.850,00",
  //         color: "text-green-600",
  //       },
  //     ],
  //   },
  // ]

  return (
    <>
      <PageTitle content="Dashboard" />
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex gap-2">
          <IdentificationBadge size={24} className="text-yellow-200" />
          <label className="text-bold text-xl text-yellow-200">Segurados</label>
        </div>
        <SeguradosDashboard redirectOnClick />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex gap-2">
          <FileText size={24} className="text-orange-300" />
          <label className="text-bold text-xl text-orange-300">
            Propostas/Apólices
          </label>
        </div>
        <DashboardIndicators redirectOnClick />
      </div>
    </>
  )
}
