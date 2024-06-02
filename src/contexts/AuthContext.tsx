import {createContext, ReactNode, use, useState, useEffect} from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import { api } from '../services/apiClient';
import { toast } from 'react-toastify';

//tipagem do contexto
type AuthContextData = {
    user?: UserProps;  //--- propriedades do usuário.
    isAuthenticated: boolean;  //--- verificação se está logado.
    signIn: (
        credentials: SignInProps
    ) => Promise<void>;   //--- função promisse pq vai na api e pode demorar.
    signOut: (

    )=> void;
    signUp:(
        credentials: SignUpProps
    )=> Promise<void>;
}

//tipagem propriedades usuário
type UserProps ={
    id: string;
    name: string;
    email: string;
}

//tipagem da autenticação
type SignInProps ={
    email: string;
    password: string;
}

//tipagem do signup
type SignUpProps ={
    name: string;
    email: string;
    password: string;
}

//tipagem do AutoContext
type AuthProviderProps ={
    children: ReactNode;
}

//criação do contexto: o contexto fica como se fosse por volta das páginas verificação de algo
export const AuthContext = createContext({} as AuthContextData)

//deslogar usuário
export function signOut(){
    try{
        destroyCookie(undefined,'@nextauth.token')//destruindo o token
        Router.push('/') //enviando usuário para rota de login
    }catch{
        console.log('erro ao deslogar')
    }
}

//criação de quem vai prover essas informações e métodos acima
export function AuthProvider({children}: AuthProviderProps){
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;  {/* !! convertendo em bolleano */}

    //pegando dados do cookie, verificando se não foi manipulado, se não está expirado e caso atenda as condições desloga.
    useEffect(()=>{
        // tentar pegar algo no cookie
        const {'@nextauth.token': token } = parseCookies();

        if(token){
            api.get('/me').then(response=>{
                const {id, name, email} = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(()=>{
                signOut();
            })
        }
    },[])

    //função para realizar o login
    async function signIn({email, password} : SignInProps){
        try{
            const response = await api.post('/session',{
                email,
                password
            })

            //console.log(response.data)

            const {id, name, token} = response.data;

            //primeiro parâmetro é um contexto, segundo parâmetro qual o cookie que quer salvar, terceiro parâmetro o que deseja salvar.
            setCookie(undefined, '@nextauth.token', token,{
                maxAge: 60 * 60 * 24 * 30, //Expirar em 1 mes
                path: "/" // Quais caminhos terao acesso ao cookie. Ao colocar barra serão todos os caminhos(rotas)

            })

            setUser({
                id,
                name,
                email,
            })

            //Passar para as próximas requisições o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}` 

            //alerta de sucesso
            toast.success("Logado com sucesso!");



            //Redirecionar o user para /dashboard
            Router.push('/dashboard');



        }catch(err){
            console.log("Error ao acessar", err);
            toast.error("Erro ao acessar!");
        }
    }

    //função para cadastrar usuário
    async function signUp({name, email, password}: SignUpProps) {
       try{

        //chamando a api e passando o que queremos cadastrar
        const response = await api.post('/users',{
            name,
            email,
            password
        })

        //alerta ao logar exibindo que deu certo
        toast.success("Conta criada com sucesso!");

        Router.push('/');

       }catch(err){
        console.log("erro ao cadastrar ", err);
        toast.error("Erro ao criar conta");
       }
    }

    
    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp}}>
            {/*--páginas---*/}
            {children}
        </AuthContext.Provider>
    )
}