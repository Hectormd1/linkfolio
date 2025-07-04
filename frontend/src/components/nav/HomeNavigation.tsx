import { Link } from 'react-router-dom'


export default function HomeNavigation() {
    return(
        <>
            <Link className='text-white p-2 uppercase font-bold text-xs cursor-pointer'
            to='/auth/register'>Registrarme
            </Link>
            <Link className='bg-secondary text-slate-800 p-2 uppercase font-black text-xs cursor-pointer rounded-lg'
            to='/auth/login'>Iniciar Sesion
            </Link>

        </>

    )
}