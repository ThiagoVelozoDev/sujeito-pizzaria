
import { useState } from 'react';
import { canSSRAuth } from '../../utils/canSRRAuth';
import styles from './styles.module.scss';
import Head from 'next/head';
import { Header } from '../../componentes/Header';
import { FiRefreshCcw } from 'react-icons/fi';

import { setupAPIClient } from '../../services/api';

import Modal from 'react-modal';
import { ModalOrder } from '../../componentes/ModalOrder';
import { toast } from 'react-toastify';

type OrderProps = {
    id: string;
    table: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;
}

interface HomeProps {
    orders: OrderProps[]
}

export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    order: {
        id: string;
        table: string | number;
        status: boolean;
        name: string | null;
    }
}


export default function Dashboard({ orders }: HomeProps) {

    //recebendo os pedidos no useState
    const [orderList, setOrderList] = useState(orders || []);

    const [modalItem, setModalItem] = useState<OrderItemProps[]>();
    const [modalVisible, setModalVisible] = useState(false);


    //fechar o modal
    function handleCloseModal() {
        setModalVisible(false);
    }

    //recebendo o id do item clicado e mostrando dados no modal
    async function handleOpenModalView(id: string) {
        //alert("ID clicado" + id);

        // Adicionando um log antes de fazer a requisição
        console.log(`Requisitando detalhes do pedido com ID: ${id}`);

        const apiClient = setupAPIClient();

        const response = await apiClient.get('/order/detail', {
            params: {
                order_id: id,
            }
        })

        // Adicionando um log para verificar a resposta da API
        console.log('Resposta da API:', response.data);

        setModalItem(response.data);
        setModalVisible(true);
    }

    //função para enviar o pedido
    async function handleFinishItem(id: string){
        //alert("Fechar o pedido" + id)
        const apiClient = setupAPIClient();

        //fechando o pedido
        await apiClient.put('/order/finish',{
            order_id: id,
        })

        //atualizando a listagem das orders
        const response = await apiClient.get('/orders');
        setOrderList(response.data);

        //fechando o modal
        setModalVisible(false)
        toast.success('Item finalizado com sucesso!')
    }

    //atualizar a listagem de pedidos
    async function handleRefreshOrders() {
        const apiClient = setupAPIClient();

        const response = await apiClient.get('/orders');

        setOrderList(response.data);
    }


    //Div principal da aplicação na página que está usando, no Next é dessa forma
    Modal.setAppElement('#__next');//modal

    return (
        <>
            <Head>
                <title>Painel - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Últimos Pedidos</h1>
                        <button onClick={handleRefreshOrders}>
                            <FiRefreshCcw size={25} color="3fffa3" />
                        </button>
                    </div>


                    <article className={styles.listOrders}>

                        {orderList.length === 0 &&(
                            <span className={styles.emptyList}>
                                Nenhum pedido aberto ...
                            </span>
                        )}
                        {orderList.map(item => (
                            <section key={item.id} className={styles.orderItem}>
                                <button onClick={() => handleOpenModalView(item.id)}>
                                    <div className={styles.tag}></div>
                                    <span>{item.table}</span>
                                </button>
                            </section>

                        ))}


                    </article>
                </main>

                {/* --CASO O MODAL ESTEJA COMO TRUE EXIBE */}
                {
                    modalVisible && (
                        <ModalOrder
                            isOpen={modalVisible}
                            onRequestClose={handleCloseModal}
                            order={modalItem}
                            handleFinishOrder={handleFinishItem}
                        />
                    )
                }

            </div>
        </>
    )
}

//verificação se está logado se não tiver redireciona para página de login
export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/orders');
    //console.log(response.data);

    return {
        props: {
            orders: response.data
        }
    }
})