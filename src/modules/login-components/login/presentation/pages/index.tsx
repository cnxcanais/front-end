"use client"
import { Button } from '@mui/material'
import styles from '@/modules/login-components/style.module.css'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { inputStyle } from '@/core/utils/loginInputStyle'
import Link from 'next/link'

export function Login () {

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { push } = useRouter();

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  return(
    <div className={styles.loginBox}>
      <h2>Faça o login para continuar</h2>
      <div className={styles.inputCtr}>
          <TextField 
          id="email-login" 
          label="Email" 
          variant='filled' 
          type='email'
          sx={inputStyle}
          />
        <div>
          <TextField 
            id="password-login" 
            label="Senha" 
            variant='filled'
            type={showPassword ? 'text' : 'password'}
            sx={inputStyle}
            InputProps ={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle passaword visibility'
                    onClick={handleClickShowPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff onClick={handleClickShowPassword}/> : <Visibility onClick={handleClickShowPassword}/>}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </div>
        <div className={styles.passwordLink}>
          <Link href='/define-password'>Esqueceu sua senha? Clique aqui.</Link>
        </div>
        
      </div>
      
      <div>
        <Button 
          variant="contained" 
          sx={{
            backgroundColor: 'var(--yellow200)',
            '&:hover': {
              backgroundColor: 'var(--yellow300)'
            }
          }}
          onClick={() => push('/dashboard')}
        >
          Login
        </Button>
      </div>
      
    </div>
    

  )

}

