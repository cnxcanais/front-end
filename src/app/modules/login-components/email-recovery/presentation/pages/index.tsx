"use client"
import { Input, Field, Label, Button } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'

export function PasswordRetrieval () {


  return(
    <div className="bg-black-100 flex-col text-white-100 p-5 rounded-md"> 
      <h2> Digite seu e-mail para resetar a senha.</h2>
      <Field className='mt-5'>
        <Label className="text-sm/6 font-medium text-white-100">Email</Label>
        <Input 
          name='login-email'
          type='email'
          className={clsx(
            'mt-1 block w-full rounded-lg border border-beige-100 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 bg-black-200 min-w-[350px] mb-2')}
        />
      </Field>
      <Link href='/' className='text-xs text-beige-100 hover:text-yellow-200'>Voltar para login </Link>
      <div className='flex justify-center mt-5'>
        <Button className="bg-yellow-200 hover:bg-yellow-300 text-white-100 rounded-md p-2">Resetar</Button>
      </div>
      
    </div>
  )
}