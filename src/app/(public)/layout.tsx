"use client"
import styles from './layout.module.css'
import Image from 'next/image'


export default function LoginComponentsLayout ({children}: {children: React.ReactNode}) {
  
  return(
    <>
      <nav className={styles.navBar}>
        <div className={styles.logo}>
          <Image src="/images/logo.svg" alt="Logo" width={100} height={50}/>
        </div>
      </nav>
      <main className={styles.main}>
        {children}
      </main>
    </>
  )
}