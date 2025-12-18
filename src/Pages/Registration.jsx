import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import auth from '../Firebase/firebase.config';
import { updateProfile } from 'firebase/auth';
import toast from "react-hot-toast";
import axios from 'axios';

const Registration = () => {

    const navigate = useNavigate();
    const { registerwitheEmalPassword, setUser, user, handlegooglesignin } = useContext(AuthContext);

    const handlesubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const name = e.target.name.value;
        const photourl = e.target.photourl;
        const file = photourl.files[0];
        console.log(file);

        const uppercase = /[A-Z]/;

        const lowercase = /[a-z]/;

        if (password.length < 6) {
            return alert("less than 6 characters")
        }
        if (!uppercase.test(password)) {
            return alert("Need a Uppercase")
        }
        if (!lowercase.test(password)) {
            return alert("Need a Lowercase")
        }

        const res = await axios.post(`https://api.imgbb.com/1/upload?key=d66fa7e696ac62bbb4d24d73f0bea711`, { image: file }, {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        })

        // console.log(res.data.data.display_url)
        const mainPhotoUrl = res.data.data.display_url;

        if (res.data.success == true) {
            registerwitheEmalPassword(email, password)
                .then((userCredential) => {
                    updateProfile(auth.currentUser, {
                        displayName: name, photoURL: mainPhotoUrl
                    }).then(() => {
                        setUser(userCredential.user);
                        toast.success("Registration Successful!");
                        e.target.reset();
                        navigate("/")
                    }).catch((error) => {
                        toast.error(error.message);
                    });
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    }

    const googlesignup = () => {
        handlegooglesignin()
            .then(result => {
                const user = result.user
                setUser(user)
                navigate("/")
            })
            .catch(error => {
                toast.error(error.message);
            })
    }
    console.log(user);
    return (
        <div>
            <div className="hero min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                            <form onSubmit={handlesubmit} className="fieldset">
                                <label className="label">Name</label>
                                <input name='name' type="text" className="input" placeholder="Enter Name" />
                                <label className="label">PhotoUrl</label>
                                <input name='photourl' type="file" className="input" placeholder="Enter Image URL" />
                                <label className="label">Email</label>
                                <input name='email' type="email" className="input" placeholder="Email" />
                                <label className="label">Password</label>
                                <input name='password' type="password" className="input" placeholder="Password" />
                                <button onClick={googlesignup} className="btn bg-white text-black border-[#e5e5e5]">
                                    <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                    Login with Google
                                </button>
                                <button className="btn btn-neutral mt-4">Register</button>
                                <div>
                                    <span>Already have an account?</span><Link className='text-blue-500' to="/login">Login</Link>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;