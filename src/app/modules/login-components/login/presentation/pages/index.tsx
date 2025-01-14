"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input, Field, Label, Button } from '@headlessui/react'
import clsx from 'clsx'

export function Login () {

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { push } = useRouter();

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  return(
    <div className="bg-black-100 flex-col text-white-100 p-5 rounded-md">
      <div className='flex justify-center'>
        <h2 className='m-0 text-lg'>Faça o login para continuar</h2>
      </div>
      
      <Field className="mt-5">
        <Label className="text-sm/6 font-medium text-white-100">Email</Label>
        <Input 
          name='login-email'
          type='email'
          className={clsx(
            'mt-1 block w-full rounded-lg border border-beige-100 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 bg-black-200 min-w-[350px] mb-5')}
        />
        <Label className="text-sm/6 font-medium text-white-100">Senha</Label>
        <Input 
          name='login-senha'
          type='password'
          className={clsx(
            'mt-1 block w-full rounded-lg border border-beige-100 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 bg-black-200')}
        />
      </Field>
      <div className="">
        <div className="">
          <Link href='/define-password' className='text-xs text-beige-100 hover:text-yellow-200'>Esqueceu sua senha? Clique aqui.</Link>
        </div>
        
      </div>
      
      <div className='flex justify-center mt-5'>
        <Button className="bg-yellow-200 hover:bg-yellow-300 text-white-100 rounded-md p-2">Entrar</Button>
      </div>
  
  </div>
    

  )

}

