import { PuffLoader } from "react-spinners"

export const LoadingScreen = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <PuffLoader color="#9fa2a6" size={150} />
    </div>
  )
}
