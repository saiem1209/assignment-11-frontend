import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../Provider/Authprovider';
import auth from '../Firebase/firebase.config';
import { updateProfile } from 'firebase/auth';
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';

const Registration = () => {
    const navigate = useNavigate();
    const { registerwitheEmalPassword, setUser } = useContext(AuthContext);

    const [district, setdistrict] = useState([]);
    const [upozilas, setUpazilas] = useState([]);

    useEffect(() => {

        fetch('/district.json')
            .then(res => res.json())
            .then(data => setdistrict(data));

       
        fetch('/upozilas.json')
            .then(res => res.json())
            .then(data => setUpazilas(data));
    }, []);

    const handlesubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirm_password = form.confirm_password.value;
        const bloodGroup = form.bloodGroup.value;
        const district = form.district.value;
        const upozilas = form.upazila.value;
        const file = form.photourl.files[0];

     
        if (password !== confirm_password) return toast.error("Passwords do not match!");
        if (password.length < 6) return toast.error("Password must be at least 6 characters");
        if (!/[A-Z]/.test(password)) return toast.error("Password must have an Uppercase letter");
        if (!/[a-z]/.test(password)) return toast.error("Password must have a Lowercase letter");

        try {
            const imageFormData = new FormData();
            imageFormData.append('image', file);
            
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=d66fa7e696ac62bbb4d24d73f0bea711`, imageFormData);
            const mainPhotoUrl = res.data.data.display_url;

            if (res.data.success) {
    
                const userCredential = await registerwitheEmalPassword(email, password);
                const user = userCredential.user;

           
                await updateProfile(auth.currentUser, {
                    displayName: name, 
                    photoURL: mainPhotoUrl
                });

                setUser({ ...user, displayName: name, photoURL: mainPhotoUrl });

                const userInfo = {
                    name,
                    email,
                    avatar: mainPhotoUrl,
                    bloodGroup,
                    district,
                    upozilas,
                    role: 'donor',   
                    status: 'active' 
                };

                const dbRes = await axios.post('http://localhost:5000/users', userInfo);
                
                if (dbRes.data.insertedId) {
                    toast.success("Registration Successful!");
                    form.reset();
                    navigate("/");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Registration failed");
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200 py-10">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="card bg-base-100 w-full max-w-lg shrink-0 shadow-2xl">
                    <div className="card-body">
                        <h2 className="text-2xl font-bold text-center mb-4">Join as a Donor</h2>
                        <form onSubmit={handlesubmit} className="form-control gap-3">
                            
                     
                            <div>
                                <label className="label"><span className="label-text">Name</span></label>
                                <input name='name' type="text" className="input input-bordered w-full" placeholder="Enter Name" required />
                            </div>

                        
                            <div>
                                <label className="label"><span className="label-text">Email</span></label>
                                <input name='email' type="email" className="input input-bordered w-full" placeholder="Email" required />
                            </div>

                            <div>
                                <label className="label"><span className="label-text">Avatar</span></label>
                                <input name='photourl' type="file" className="file-input file-input-bordered w-full" required />
                            </div>

                         
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Blood Group</span></label>
                                    <select name="bloodGroup" className="select select-bordered w-full" required defaultValue="">
                                        <option value="" disabled>Select</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>

                         
                                <div className="form-control">
                                    <label className="label"><span className="label-text">District</span></label>
                                    <select name="district" className="select select-bordered w-full" required defaultValue="">
                                        <option value="" disabled>Select</option>
                                       
                                        {district.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                    </select>
                                </div>

                     
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Upazila</span></label>
                                    <select name="upazila" className="select select-bordered w-full" required defaultValue="">
                                        <option value="" disabled>Select</option>
                               
                                        {upozilas.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                    </select>
                                </div>
                            </div>

                        
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label"><span className="label-text">Password</span></label>
                                    <input name='password' type="password" className="input input-bordered w-full" placeholder="Password" required />
                                </div>
                                <div>
                                    <label className="label"><span className="label-text">Confirm Password</span></label>
                                    <input name='confirm_password' type="password" className="input input-bordered w-full" placeholder="Confirm Password" required />
                                </div>
                            </div>

             
                            <button className="btn btn-error text-white mt-6">Register</button>
                            
                            <div className="text-center mt-2">
                                <span>Already have an account? </span>
                                <Link className='text-red-500 font-bold' to="/login">Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default Registration;