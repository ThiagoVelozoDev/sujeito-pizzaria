import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies } from 'nookies';

// função para páginas que só podem ser acessadas por visitantes
export function canSSRGuest<P extends { [key: string]: any }>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        
        const cookies = parseCookies(ctx);
        // se o usuário tentar acessar a pagina porém tem login aberto já redirecionar.
        if(cookies['@nextauth.token']){
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }
        return await fn(ctx);
    }
}
