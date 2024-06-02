
import { useContext, FormEvent, useState } from 'react';
import Head from 'next/head';

import Image from 'next/image';

import logoImg from '../../public/logo.svg';

import { Input } from '../componentes/ui/Input';
import { Button } from '../componentes/ui/Button';

import { AuthContext } from '../contexts/AuthContext';

import '../../styles/globals.scss';
import styles from '../../styles/home.module.scss';
import {toast} from 'react-toastify';

import Link from 'next/link';

import { canSSRGuest } from '../utils/canSSRGuest';



export default function Home() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  //usando o contexto de verificação de login
  const { signIn } = useContext(AuthContext);


  async function handleLogin(event: FormEvent) {
    
    //função para não recarregar a página ao clicar para fazer o login
    event.preventDefault();

    if(email=='' || password === ''){
      toast.error("Preencha os dados");
      return;
    }
    //chama o loading ao clicar pra fazer o login
    setLoading(true);
    
    //enviando os dados preenchidos no formulário
    let data = {
      email,
      password
    }

    signIn(data);

    //conseguindo fazer o login atribui o false
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>SujeitoPizza - Faça seu login</title>
      </Head>

      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Sujeito Pizzaria" />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder='Digite seu e-mail'
              type='text'
              value={email} //email do useState
              onChange={(e)=> setEmail(e.target.value)}//pegando os dados do campo e passando para o email do useState
            />

            <Input
              placeholder='Digite sua senha'
              type='password'
              value={password}
              onChange={(e)=> setPassword(e.target.value)}//pegando os dados do campo e passando para o password do useState
            />

            <Button
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>
          </form>

          <Link href="/signup" className={styles.text}>
            Não possui uma conta? Cadastre-se
          </Link>

        </div>
      </div>
    </>
  )
}

//usando para verificar se o usuário está logado ou não, se tiver redireciona para dashboard.
export const getServerSideProps = canSSRGuest(async () =>{
  return{
      props: {}
  }
})

