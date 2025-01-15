import { Input, Label } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { EyeSlash, Eye } from 'phosphor-react'

type Props = {
  name: string;
  type?: string;
  variant?: 'primary' | 'secondary' | 'password' | 'login';
  label: string;
  className?: string;
  margin?:  string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export function InputField({name, type, className, placeholder, value, onChange, required = false, label, variant = 'primary', margin}: Props) {

  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <>
      {variant === 'login' && (
        <div className={margin}>
          <Label className="text-sm/6 font-medium text-white-100">{label}</Label>
          <Input
            name={name}
            type={type}
            className={clsx(
              'mt-1 block w-full rounded-lg border border-beige-100 py-1.5 px-3 text-sm/6 text-white min-w-[350px]',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 bg-black-200 min-w-[350px]',
              className
            )}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
          />
        </div>
      )}

        {variant === 'password' && (
        <>
          <div className={margin}>
            <Label className="text-sm/6 font-medium text-white-100">{label}</Label>
            <div className="relative">
            <Input 
              name='password'
              type={showPassword ? 'text' : 'password'}
              className={clsx(
                'mt-1 block w-full rounded-lg border border-beige-100 py-1.5 px-3 text-sm/6 text-white min-w-[350px]',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 bg-black-200 min-w-[350px] mb-2',
                className
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-100 hover:text-yellow-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeSlash className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        </>
      )}
    </>
  );
}
