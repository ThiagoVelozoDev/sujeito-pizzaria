import Head from 'next/head';
import styles from './styles.module.scss';
import { canSSRAuth } from '../../utils/canSRRAuth';
import { Header } from '../../componentes/Header';

export default function Product() {
    return (
        <>
            <Head>
                <title>Novo produto - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Novo produto</h1>

                    <form className={styles.form}>

                        <select>
                            <option>
                                Bebida
                            </option>
                            <option>
                                Pizzas
                            </option>
                        </select>

                        <input
                            type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                        />

                        <input
                            type="text"
                            placeholder="Digite o preço do produto"
                            className={styles.input}
                        />

                        <textarea
                            placeholder='Descreva seu produto'
                            className={styles.input}
                        />

                        <button
                            type='submit'
                            className={styles.buttonAdd}
                        >
                            Cadastrar   
                        </button>



                    </form>

                </main>
            </div>
        </>
    )
}

//verificando se o usuário está logado para acessar a rota
export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {

        }
    }
})