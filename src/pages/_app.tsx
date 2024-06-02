
//aplica os estilos globais em todas as páginas
import '../../styles/globals.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppProps } from "next/app";
import { AuthProvider } from '../contexts/AuthContext';


function MyApp({ Component, pageProps }: AppProps) {
    return (
        //por volta do componente está o AuthProvider que faz a verificação se está logado!
        <AuthProvider>
            <Component{...pageProps} />
            <ToastContainer autoClose={3000}/>
        </AuthProvider>
    )
}

export default MyApp