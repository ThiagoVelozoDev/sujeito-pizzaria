import axios, {AxiosError} from 'axios'
import {parseCookies} from 'nookies'
import {AuthTokenError} from './erros/AuthTokenError'
import { signOut } from '../contexts/AuthContext';
import { sign } from 'crypto';

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx);//pegar o cooker


    
    const api = axios.create({
        //configurar a baseURL para fazer requisições
        baseURL: 'http://localhost:3333',

        //configurar o headers para pegar o token
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    //caso a api venha dar erro
    api.interceptors.response.use(response =>{
        return response;
    }, (error: AxiosError)=>{
        if(error.response?.status===401){
            //qualquer erro 401 (não autorizado) devemos deslogar o usuário
            if(typeof window !==undefined){
                //Chamar a função para deslogar o usuário
                signOut();
            }
        }else{
            return Promise.reject(new AuthTokenError())
        }

        return Promise.reject(error);
    })

    return api;
}
