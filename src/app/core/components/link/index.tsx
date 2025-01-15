import Link from "next/link";

type Props = {
  href: string;
  children: string;
  variant: 'primary';
}

export function LinkComponent({ href, children, variant }: Props) {
  return (
    <>
      {variant === 'primary' && (
        <>
          <Link href={href} className='text-xs text-beige-100 hover:text-yellow-200'>
            {children}
          </Link>
        </>
      )}
    </>
    
  );
}