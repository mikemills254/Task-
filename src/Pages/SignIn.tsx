import {useState} from 'react'
import Input from '../Components/Input'
import Button from '../Components/Button'
import { HiOutlineMail } from 'react-icons/hi'
import { BiLock, BiLogoFacebook } from 'react-icons/bi'
import { AiOutlineEye, AiOutlineGithub, AiOutlineEyeInvisible } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false);
    const [ passVisible, setPassVisible ] = useState(false)

    const handleEyeToggle = () => {
        setIsVisible(!isVisible);
        setPassVisible(!passVisible);
    }

    const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('About to Sign in');
    };
    
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: () => {
            alert('Loggin in')
        }
    })
    const Socials = [
        {name: 'Google', icon: <FcGoogle size={30}/> },
        {name: 'Facebook', icon: <BiLogoFacebook size={30} color='blue'/> },
        {name: 'Github', icon: <AiOutlineGithub size={30}/> }
    ]
    return (
        <div className="SignUpBody bg-white w-[35%] flex flex-col items-center rounded my-2">
            <h1 className="SignUp text-[3rem]">
                Welcome Back
            </h1>
            <small className="Description text-center mx-8">
                Start your journey with Task+ today and experience the difference. Say goodbye to the chaos and hello to a more organized, productive you. It's time to make work easier with Task+
            </small>
            <form className='form w-full flex flex-grow-0 flex-col items-center p-5'>
                <Input 
                    placeholder="Email Address.."
                    type='email'
                    IconBefore={<HiOutlineMail />}
                    value={formik.values.email}
                    onChange={formik.handleChange} 
                    name={'email'} 
                    IconAfter={undefined}
                    disabled= {false}
                />
                <Input 
                    placeholder="Password.."
                    type={ passVisible ? 'text' : 'password'  }
                    ContainerStyles={'email mt-4'}
                    IconBefore={<BiLock/>}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    name='password'
                    IconAfter={isVisible ? <AiOutlineEye/> : <AiOutlineEyeInvisible/>}
                    onIconAfterClicked={() => handleEyeToggle()}
                />
                <Button
                    ContainerStyle={'email mt-4 bg-[#85b1ff] text-[#000000]'}
                    text={'Create Account'}
                    type='submit'
                    onClick={formik.handleSubmit}
                />

            </form>
            <p className='text-center my-10'>-----------or------------</p>
            <div className='socials w-full flex flex-row items-center gap-10 justify-center'>
                {Socials.map((item) => (
                    <div key={item.name} className='social cursor-pointer'>
                        {item.icon}
                    </div>
                ))}
            </div>
            <div className='footer w-full px-8 my-5'>
                <Button
                    text={'Dont have an account? Sign In'}
                    ContainerStyle={'signIn bg-white'}
                    onClick={() => {
                        navigate('/SignUp')
                    }}
                />
            </div>
        </div>
    )
}

export default SignIn
