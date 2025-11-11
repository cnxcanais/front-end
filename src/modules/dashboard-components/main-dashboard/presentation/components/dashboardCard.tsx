export const SummaryCard = ({ data }) => {
  const formatCurrency = (value) => {
    return `R$ ${value}`
  }

  const ActivityTag = ({ label }) => (
    <span
      className={`flex items-center space-x-1 whitespace-nowrap rounded-full border ${data.cardColor} px-3 py-1 text-sm font-medium text-green-700`}>
      {/* Removed Lucide icons from tags to match the image better, but kept structure for future use */}
      {label}
    </span>
  )

  const DataRow = ({ name, count, value, isTotal = false }) => {
    const baseClasses = "text-gray-700 py-2"
    const totalClasses = `font-bold text-lg border-t pt-4 mt-2 border-gray-200 ${data.mainColor}`
    const nameClasses = isTotal ? "font-bold" : "text-gray-600"
    const valueClasses =
      isTotal ?
        `font-extrabold ${data.mainColor}`
      : "font-semibold text-gray-800"

    return (
      <div
        className={`flex justify-between ${baseClasses} ${isTotal ? totalClasses : ""}`}>
        <span className={nameClasses}>{name}</span>
        <div className="flex space-x-2">
          <span className="font-medium text-gray-500">{count}</span>
          <span className="text-gray-400">|</span>
          <span className={`${valueClasses} tracking-tight`}>
            {formatCurrency(value)}
          </span>
        </div>
      </div>
    )
  }
  // Calculate total dynamically
  const totalCount = data.summary.reduce((sum, item) => sum + item.count, 0)
  const totalValue = data.summary
    .map((item) => parseFloat(item.value.replace(/\./g, "").replace(",", ".")))
    .reduce((sum, val) => sum + val, 0)

  // Simple formatting for the calculated total value to match the mock data style
  const formattedTotalValue = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalValue)

  return (
    <div className="mx-auto my-8 max-w-sm rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-50/50">
      {/* Card Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
        <h1
          className={`text-xl font-semibold tracking-tight ${data.mainColor}`}>
          {data.companyName}
        </h1>
        {/* Company Logo */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden shadow-md">
          <img 
            src={data.logoImage} 
            alt={`${data.companyName} logo`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Activity Tags Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500">
          Ramos de Atividade:
        </h2>
        <div className="mb-6 flex flex-wrap gap-2">
          {data.tags.map((tag, index) => (
            <ActivityTag key={index} label={tag.label} />
          ))}
        </div>
      </div>

      {/* Data Summary Rows */}
      <div className="space-y-1">
        {data.summary.map((item, index) => (
          <DataRow
            key={index}
            name={item.name}
            count={item.count}
            value={item.value}
          />
        ))}

        {/* Total Row */}
        <DataRow
          name="Total"
          count={totalCount}
          value={formattedTotalValue.replace(".", ",")} // Replace dot with comma for Brazilian style
          isTotal={true}
        />
      </div>
    </div>
  )
}
