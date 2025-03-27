import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type BarGraphProps = {
  data: any
  options?: any
}

const defaultOptions = {}

export function BarGraph({ data, options }: BarGraphProps) {
  return <Bar options={options ? options : defaultOptions} data={data} />
}
