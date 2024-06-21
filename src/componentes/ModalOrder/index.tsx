import Modal from 'react-modal';
import styles from './style.module.scss';

import { FiX } from 'react-icons/fi';
import { OrderItemProps } from '../../pages/dashboard';
import { transform } from 'next/dist/build/swc';

//tipando os dados que o modal vai receber
interface ModalOrderProps {
    isOpen: boolean; // status do modal
    onRequestClose: () => void; //função para fechar o modal
    order: OrderItemProps[]; //dados do pedido
    handleFinishOrder: (id: string) => void;
}

export function ModalOrder({ isOpen, onRequestClose, order, handleFinishOrder }: ModalOrderProps) {

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            rigth: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1d1d2e'

        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >

            <button
                type='button'
                onClick={onRequestClose}
                className='react-modal-close'
                style={{ background: 'transparent', border: 0 }}
            >
                <FiX size={45} color="#ff3478"></FiX>


            </button>

            <div className={styles.container}>
                <h2>Detalhes do pedido</h2>
                <span className={styles.table}>
                    Mesa: {order[0].order.table}
                </span>


                {order.map(item => (
                    <section key={item.id} className={styles.containerItem}>
                        <span>{item.amount} - <strong> {item.product.name}</strong></span>
                        <span className={styles.description}> {item.product.description}</span>
                    </section>

                ))}

                <button className={styles.buttonOrder} onClick={()=> handleFinishOrder(order[0].order_id)}>
                    Concluir pedido
                </button>

            </div>

        </Modal>
    )
}