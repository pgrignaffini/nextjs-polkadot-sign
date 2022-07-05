import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'

const TxComponent = dynamic(() => import('../components/TxComponent'), { ssr: false })

export default function Home() {

  return (
    <div>
      <TxComponent />
    </div>
  )
}
