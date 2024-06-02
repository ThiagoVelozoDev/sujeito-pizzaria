import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { Header } from '../../componentes/Header';
import styles from './styles.module.scss';
import { toast } from 'react-toastify';
import { setupAPIClient} from '../../services/api';
import { api } from '../../services/apiClient';
import { canSSRAuth } from '../../utils/canSRRAuth';

export default function Category() {

    const [name, setName] = useState('');

    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        if (name ==='') {
            toast.warn("Preencha o campo!")
            return;
        } 
            
            const apiClient = setupAPIClient();
            await apiClient.post('/category',{
                name: name
            })

            toast.success("Categoria cadastrada com sucesso");

            setName('');

            return;  
    }

    return (
        <>

            <Head>
                <title>Nova categoria - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Cadastrar categorias</h1>


                    <form className={styles.form} onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Digite o nome da categoria"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button
                            type='submit'
                            className={styles.buttonAdd}      
                        >
                            
                        </button>
                    </form>

                </main>
            </div>
        </>
    )

}

//verificando se o usuário está logado para acessar a rota
export const getServerSideProps = canSSRAuth(async (ctx)=> {
    return{
        props: {

        }
    }
})