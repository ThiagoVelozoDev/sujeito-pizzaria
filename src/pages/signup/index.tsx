
import {useState, FormEvent, useContext} from 'react';

import Head from 'next/head';

import Image from 'next/image';

import logoImg from '../../../public/logo.svg';

import { Input } from '../../componentes/ui/Input';
import { Button } from '../../componentes/ui/Button';

import {AuthContext}from '../../contexts/AuthContext';

import '../../../styles/globals.scss';
import styles from '../../../styles/home.module.scss';
import {toast} from 'react-toastify';

import Link from 'next/link';

import { canSSRGuest } from '../../utils/canSSRGuest';


export default function Signup() {

    const {signUp} = useContext(AuthContext);

    //definição dos useStates necessários para atribuição de estados dos componentes.
    const [name, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    //função assíncrona porque pode demorar na requisição
    async function handleSignUp(event: FormEvent ){
        //para não atualizar a página se utiliza essa linha do FormEvent, ou seja ao chamar o onSubmit não atualiza.
        event.preventDefault();

        //verificando se os campos estão vazios
        if(name === '' || email === '' || password === ''){
            toast.error('Preencha todos os campos!')
            return;//return para parar a execução do código
        }

        setLoading(true);

        let data = {
            name,
            email,
            password
        }
        await signUp(data);

        setLoading(false);
    }

    return (
        <>
            <Head>
                <title>SujeitoPizza - Faça seu cadastro agora</title>
            </Head>

            <div className={styles.containerCenter}>
                <Image src={logoImg} alt="Logo Sujeito Pizzaria" />

                <div className={styles.login}>
                    <h1>Criando sua conta</h1>
                    <form onSubmit={handleSignUp}>
                        <Input
                            placeholder='Digite seu nome'
                            type='text'
                            value={name}
                            onChange={(e)=> setCompany(e.target.value)}

                        />
                        <Input
                            placeholder='Digite seu e-mail'
                            type='text'
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                        />

                        <Input
                            placeholder='Digite sua senha'
                            type='password'
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            loading={loading}

                        >
                            Cadastrar
                        </Button>
                    </form>

                    <Link href="/" className={styles.text}>
                        já possui uma conta? Faça login!
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