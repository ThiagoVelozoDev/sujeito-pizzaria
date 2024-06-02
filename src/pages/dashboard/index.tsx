import { canSSRAuth } from '../../utils/canSRRAuth';
import './styles.scss';
import Head from 'next/head';
import { Header } from '../../componentes/Header';

export default function Dashboard(){
    return(
        <>
            <Head>
                <title>Painel - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header/>
                <h1>Painel</h1>
            </div>
        </>
    )
}

//verificação se está logado se não tiver redireciona para página de login
export const getServerSideProps = canSSRAuth(async (ctx)=> {
    return{
        props: {

        }
    }
})