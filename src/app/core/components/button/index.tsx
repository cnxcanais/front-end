import { Button } from "@headlessui/react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary';
  className?: string;
};

export function ButtonComponent({ children, onClick, variant = 'primary', className }: Props) {
  return (
    <>
      {variant === 'primary' && (
          <Button 
            className={clsx("bg-yellow-200 hover:bg-yellow-300 text-white-100 rounded-md p-2", className)} 
            onClick={onClick}>{children}
          </Button>
    )}
    </>
    
    
  );
}

