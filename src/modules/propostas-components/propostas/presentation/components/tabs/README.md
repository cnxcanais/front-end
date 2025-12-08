# Tab Components Refactoring

## Usage in PropostaForm.tsx

Replace the inline tab content with the new tab components:

### Tab 0 - Proposta
Replace lines ~405-562 with:
```tsx
{activeTab === 0 && (
  <PropostaTab
    register={register}
    errors={errors}
    formData={formData}
    setValue={setValue}
    segurados={segurados}
    seguradoras={seguradoras}
    produtores={produtores}
    corretoras={corretoras}
    ramos={ramos}
    produtosOptions={produtosOptions}
  />
)}
```

### Tab 1 - Veículo (only for Automóvel)
Replace lines ~563-615 with:
```tsx
{activeTab === 1 && isAutomovelRamo && (
  <VeiculoTab register={register} errors={errors} />
)}
```

### Tab - Vigência
Replace the vigência tab content with:
```tsx
{((activeTab === 1 && !isAutomovelRamo) ||
  (activeTab === 2 && isAutomovelRamo)) && (
  <VigenciaTab register={register} errors={errors} />
)}
```

### Tab - Apólice e Endosso
Replace the apólice tab content with:
```tsx
{((activeTab === 2 && !isAutomovelRamo) ||
  (activeTab === 3 && isAutomovelRamo)) && (
  <ApoliceEndossoTab
    register={register}
    errors={errors}
    formData={formData}
    setValue={setValue}
  />
)}
```

### Tab - Prêmio e Parcelas
Replace the prêmio e parcelas tab content with:
```tsx
{((activeTab === 3 && !isAutomovelRamo) ||
  (activeTab === 4 && isAutomovelRamo)) && (
  <PremioParcelasTab
    register={register}
    errors={errors}
    formData={formData}
    setValue={setValue}
    setShowParcelasModal={setShowParcelasModal}
  />
)}
```

### Tab - Comissão
Replace the comissão tab content with:
```tsx
{((activeTab === 4 && !isAutomovelRamo) ||
  (activeTab === 5 && isAutomovelRamo)) && (
  <ComissaoTab
    register={register}
    errors={errors}
    formData={formData}
    setValue={setValue}
  />
)}
```

### Tab - Repasses
Replace the repasses tab content with:
```tsx
{((activeTab === 5 && !isAutomovelRamo) ||
  (activeTab === 6 && isAutomovelRamo)) && (
  <RepassesTab
    register={register}
    errors={errors}
    formData={formData}
    setValue={setValue}
    produtores={produtores}
  />
)}
```

### Tab - Revisão
Replace the revisão tab content (outside the main wrapper) with:
```tsx
{((activeTab === 6 && !isAutomovelRamo) ||
  (activeTab === 7 && isAutomovelRamo)) && (
  <RevisaoTab
    register={register}
    errors={errors}
    formData={formData}
    setValue={setValue}
    segurados={segurados}
    seguradoras={seguradoras}
    produtores={produtores}
    corretoras={corretoras}
    ramos={ramos}
    produtosOptions={produtosOptions}
    isAutomovelRamo={isAutomovelRamo}
  />
)}
```

## Import Statement
Update the imports in PropostaForm.tsx:
```tsx
import {
  PropostaTab,
  VeiculoTab,
  VigenciaTab,
  ApoliceEndossoTab,
  PremioParcelasTab,
  ComissaoTab,
  RepassesTab,
  RevisaoTab,
} from "./tabs"
```

## Result
This refactoring reduces PropostaForm.tsx from ~1600 lines to ~400 lines, making it much more maintainable.
