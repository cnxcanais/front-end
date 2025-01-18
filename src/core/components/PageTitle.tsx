import { ComponentProps } from "react"

export type PageTitleProps = ComponentProps<"h1"> & {
  content: string
}

export function PageTitle({ content, ...props }: PageTitleProps) {
  return (
    <div className="my-3 text-3xl">
      <h1 {...props}>{content}</h1>
    </div>
  )
}
