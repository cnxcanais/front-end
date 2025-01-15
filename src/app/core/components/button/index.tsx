import { Button } from "@headlessui/react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant: 'primary';
};

export function ButtonComponent({ children, onClick, variant }: Props) {
  return (
    <>
      {variant === 'primary' && (
        <div className='flex justify-center mt-5'>
          <Button className="bg-yellow-200 hover:bg-yellow-300 text-white-100 rounded-md p-2" onClick={onClick}>{children}</Button>
        </div>
    )}
    </>
    
    
  );
}

