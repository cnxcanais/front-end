import { ComponentProps } from "react"

export type PageTitleProps = ComponentProps<"h1"> & {
  content: string
}

export function PageTitle({ content, ...props }: PageTitleProps) {
  return (
    <h1 className={`${props.className} my-3 text-3xl`} {...props}>
      {content}
    </h1>
  )
}
