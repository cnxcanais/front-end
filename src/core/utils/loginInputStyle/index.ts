export const inputStyle = {
  minWidth: '400px',
  '& input': { color: 'var(--white)' },
  '& label': { color: 'var(--white)' },
  '& label.Mui-focused': { color: 'var(--yellow300)' },
  '& .MuiFilledInput-root': {
    color: 'var(--white)',
    borderColor: 'var(--white)',
    '&:before': {
      borderBottomColor: 'var(--white)',
    },
    '&:after': {
      borderBottomColor: 'var(--yellow300)'
    },
    '&:hover' :{
      borderBottomColor: 'var(--yellow300)',
      '&:before': {
        borderBottomColor: 'var(--yellow300)',
      }
    }
  },
  '& .MuiInputAdornment-root': {
    color: 'var(--white)',
    '& .MuiIconButton-root': {
      color: 'var(--white)',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    },
    '& .MuiSvgIcon-root': {
      color: 'var(--white)'
    }
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 30px black inset !important',
    WebkitTextFillColor: 'white !important',
    caretColor: 'white'
  },
  '& input:-webkit-autofill:hover': {
    WebkitBoxShadow: '0 0 0 30px black inset !important'
  },
  '& input:-webkit-autofill:focus': {
    WebkitBoxShadow: '0 0 0 30px black inset !important'
  },
  '& input:-webkit-autofill:active': {
    WebkitBoxShadow: '0 0 0 30px black inset !important'
  }
}