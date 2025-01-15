"use client"

import { useRouter } from 'next/navigation'
import { Field } from '@headlessui/react'
import { InputField } from '@/app/core/components/input-field'
import { LinkComponent } from '@/app/core/components/link'
import { ButtonComponent } from '@/app/core/components/button'


export function Login () {
  
  const { push } = useRouter();

  return(
    <div className="bg-black-100 flex-col text-white-100 p-5 rounded-md">
      <div className='flex justify-center'>
        <h2 className='m-0 text-lg'>Faça o login para continuar</h2>
      </div>
      <Field className="mt-5">
        <InputField 
          name='email'
          type='email'
          variant='login'
          label='Email'
        />
        <InputField 
          name='password'
          variant='password'
          label='Senha'
        />
      </Field>
      <LinkComponent
        href='/define-password'
      >
        Esqueceu sua senha? clique aqui
      </LinkComponent>
      
      <div className='flex justify-center mt-5'>
        <ButtonComponent onClick={() => push('/dashboard')}> Entrar </ButtonComponent>
      </div>
      
  
  </div>
    

  )

}

