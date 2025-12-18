import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useLocation, useNavigate } from 'react-router';
import auth from '../Firebase/firebase.config';
import { useContext, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import toast from "react-hot-toast";

const Login = () => {


    const { setUser, handlegooglesignin } = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()
    const [email, setEmail] = useState();

    const handlesubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setUser(user)
                toast.success("Login Successful!");
                navigate(location.state ? location.state : '/')
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }

    const googlesignin = () => {
        handlegooglesignin()
            .then(result => {
                const user = result.user
                setUser(user)
                toast.success("Login Successful!");
                navigate(location.state ? location.state : '/')
            })
            .catch(error => {
                toast.error(error.message);
            })
    }
    const handleforget = (e) => {
        e.preventDefault();
        navigate(`/forget/${email}`)
    }

    return (
        <div>
            <div className="hero min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                            <form onSubmit={handlesubmit} className="fieldset">
                                <label className="label">Email</label>
                                <input onChange={(e) => setEmail(e.target.value)} name='email' type="email" className="input" placeholder="Email" />
                                <label className="label">Password</label>
                                <input name='password' type="password" className="input" placeholder="Password" />
                                <button onClick={handleforget} className="link link-hover">Forgot password?</button>
                                <button onClick={googlesignin} className="btn bg-white text-black border-[#e5e5e5]">
                                    <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                    Login with Google
                                </button>
                                <div>
                                    <span>Don't have an account?</span><Link className='text-blue-500' to="/registration">Register</Link>
                                </div>
                                <button className="btn btn-neutral mt-4">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;