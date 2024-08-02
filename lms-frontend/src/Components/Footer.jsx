import { BsFacebook, BsTwitterX, BsLinkedin, BsInstagram } from 'react-icons/bs'

function Footer() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    return (
        <>
            <footer className='relative left-0 bottom-0 h-[10vh] w-full py-8 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800 sm:px-20'>
                    <section className='text-lg'>
                        Copyright{year} | All rights reserved 
                    </section>
                    <section className='flex items-center justify-center gap-5 text-2xl text-white'>
                    <a href='https://www.facebook.com/abhiraj7059/' target='_blank' rel='noopener noreferrer' className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                        <BsFacebook />
                    </a>
                    <a href='https://www.instagram.com/golu__kr__singh?igsh=MXR4djdyd2JkNXJwcg%3D%3D&utm_source=qr' target='_blank' rel='noopener noreferrer' className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                        <BsInstagram />
                    </a>
                    <a href='https://www.linkedin.com/in/golu-kumar-7079b5246/' target='_blank' rel='noopener noreferrer' className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                        <BsLinkedin />
                    </a>
                    <a href='https://x.com/golu7059' target='_blank' rel='noopener noreferrer' className='hover:text-yellow-500 transition-all ease-in-out duration-300'>
                        <BsTwitterX />
                    </a>
                    </section>
            </footer>
        </>
    )
}

export default Footer;