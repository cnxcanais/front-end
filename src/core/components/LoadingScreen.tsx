import { PuffLoader } from "react-spinners"

type LoadingScreenProps = {
  fullScreen?: boolean
}

export function LoadingScreen({ fullScreen = true }: LoadingScreenProps) {
  const sizeLoader = fullScreen ? 150 : 75

  return (
    <div
      className={`flex ${fullScreen ? "h-screen" : ""} items-center justify-center`}>
      <PuffLoader color="#9fa2a6" size={sizeLoader} />
    </div>
  )
}
