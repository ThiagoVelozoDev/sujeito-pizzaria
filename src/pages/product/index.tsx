import { use, useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import styles from './styles.module.scss';
import { canSSRAuth } from '../../utils/canSRRAuth';
import { Header } from '../../componentes/Header';
import { FiUpload } from 'react-icons/fi';
import {setupAPIClient} from '../../services/api';
import {toast} from 'react-toastify';

//tipando os itens da categoria
type ItemProps = {
    id: string;
    name: string;
}

//tipando a lista de categorias
interface CategoryProps {
    categoryList: ItemProps[];
}

export default function Product({categoryList}: CategoryProps) {

    console.log(categoryList);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState<File | null>(null);
    const [categories, setCategories] = useState(categoryList || []); //recebe a categoria ou array vazio
    const [categorySelected, setCategorySelected] = useState(0);

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        // se não enviar a imagem para por aqui a execução da função
        if(!e.target.files){
            return; 
        }

        const image = e.target.files[0];
        
        // se não enviar a imagem para por aqui a execução da função
        if(!image){
            return;
        }

        //verificando se possui os tipos que quero receber
        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            setImageAvatar(image); //passando a imagem selecionada para o useState
            setAvatarUrl(URL.createObjectURL(e.target.files[0]));//aparece o preview da imagem
        }
    }

    //quando você seleciona uma nova categoria
    function handleChangeCategory(e){
        //console.log("Posição selecionada", categories[e.target.value])//pegando a posição do item selecionado
        setCategorySelected(e.target.value);
        
    } 
    
    //enviar dados do formulário para a base
    async function handleRegister(e: FormEvent){
        e.preventDefault();//não atualizar a página

        try{
            const data = new FormData();

            //verificar se digitou tudo certo se não tiver digitado retorna o erro e para a execução
            if(name ==='' || price === '' || description ==='' || imageAvatar === null){
                toast.error("Preencha todos os campos!");
                return;
            }

            //enviando os dados do formulário
            data.append('name',name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file',imageAvatar);

            //instanciando o serviço da api
            const apiClient = setupAPIClient();

            //chamando a rota e passando os dados
            await apiClient.post('/product', data);

            //mensagem de sucessos
            toast.success('Cadastrado com sucesso!');

        }catch(err){
            console.log(err);
            toast.error("Ops erro ao cadastrar");
        }

        //limpando os campos do formulário para um novo envio
        setName('');
        setPrice('');
        setDescription('');
        setAvatarUrl('');
        setImageAvatar(null);
    }
    return (
        <>
            <Head>
                <title>Novo produto - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Novo produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>

                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color="#FFF" />
                            </span>

                            <input type="file" accept="image/png, image/jpeg" onChange={handleFile}/>

                            {/*verificando se tem url do avatar, se tiver renderiza */}
                            {avatarUrl && (

                                <img
                                    className={styles.preview}
                                    src={avatarUrl}
                                    alt=""
                                    width={250}
                                    height={250}
                                />
                            )}

                        </label>

                        {/* o item exibido dentro do campo é o categorySelected no value */}
                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {
                                categories.map((item, index) => {
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.name}
                                        </option>
                                    )
                                })
                            }
                        </select>

                        <input
                            type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Digite o preço do produto"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea
                            placeholder='Descreva seu produto'
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
//fazendo verificações pelo lado do servidor ou renderizando algo antes de carregar o front
export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx) //instanciando a api e passando o contexto

    const response = await apiClient.get('/category'); //buscando as categorias do banco de dados
    //console.log(response.data);
    return {
        props: {
            categoryList: response.data
        }
    }
})