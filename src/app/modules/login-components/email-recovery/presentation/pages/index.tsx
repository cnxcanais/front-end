"use client"
import { Input, Field, Label, Button } from '@headlessui/react'
import { InputField } from '@/app/core/components/input-field'
import { ButtonComponent } from '@/app/core/components/button'
import { LinkComponent } from '@/app/core/components/link'
import clsx from 'clsx'
import Link from 'next/link'

export function PasswordRetrieval () {


  return(
    <div className="bg-black-100 flex-col text-white-100 p-5 rounded-md"> 
      <h2> Digite seu e-mail para resetar a senha.</h2>
      <Field className='mt-5'>
        <InputField
          name='email'
          label='E-mail'
          variant='login'
          placeholder='Digite seu e-mail'
        />
      </Field>
      <LinkComponent href='/'> Voltar para tela de login </LinkComponent>
      <div className='flex justify-center mt-5'>
        <ButtonComponent > Enviar </ButtonComponent>
      </div>
      
    </div>
  )
}