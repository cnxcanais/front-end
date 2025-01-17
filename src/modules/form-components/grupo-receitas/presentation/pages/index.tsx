import { Button } from "@/core/components/Button"
import { InputIcon } from "@/core/components/InputIcon"
import { PageTitle } from "@/core/components/PageTitle"
import { FileXls } from "@phosphor-icons/react"

export const IncomeGroupDashboard = () => {
  return (
    <>
      <PageTitle content="Cadastrar Grupo de Receitas" />
      <main className="align-center mt-8 flex gap-[50px]">
        <div className="align-center flex gap-4">
          <InputIcon iconType="search" placeholder="Buscar" />
          <Button variant="secondary">Cadastrar</Button>
        </div>
        <div>
          <Button variant="secondary" className="flex items-center gap-2">
            <FileXls size={20} color="#ffffff" weight="bold" />
            Exportar
          </Button>
        </div>
      </main>
    </>
  )
}
