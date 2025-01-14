"use client"
import { Button } from '@mui/material'
import { TextField } from '@mui/material'
import { inputStyle } from '@/core/utils/loginInputStyle'
import Link from 'next/link'

export function PasswordRetrieval () {


  return(
    <div className=""> 
      <h2> Digite seu e-mail para resetar a senha.</h2>
      <TextField 
        id='retrieve-password'
        label='Email'
        variant='filled'
        sx={inputStyle}
      />
      <div className="">
        <Link href='/'>Voltar para login</Link>
      </div>
      <Button 
        variant="contained"
        sx={{
          backgroundColor: 'var(--yellow200)',
          '&:hover': {
            backgroundColor: 'var(--yellow300)'
          }
        }}
      >
        Resetar
      </Button>
    </div>
  )
}