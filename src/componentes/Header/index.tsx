import { useContext } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { AuthContext, signOut } from '../../contexts/AuthContext';

export function Header() {

    //buscando os dados do usuário logado
    const {user} = useContext(AuthContext)

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <img src="logo.svg" width={190} height={60} alt="Logo" />
                </Link>


                {/* para usar o nome do usuário logado do contexto
                    <p>{user?.name}</p>
                */}

                <nav className={styles.menuNav}>
                    <Link href="/category" className={styles.itemMenu}>Categoria</Link>
                    <Link href="/product" className={styles.itemMenu}>Cardapio</Link>

                    <button onClick={signOut}>{/* usando o método de deslogar o usuário */}
                        <FiLogOut color='#FFF' size={24} />
                    </button>
                </nav>
            </div>
        </header>
    );
}
