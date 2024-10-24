import { useState } from "react";
import axios from 'axios';

const signupForm=()=>{
    const [email, setEmail ]=useState('');
    const [password, setPassword]=useState('');
    const [errors, setErrors]=useState([]);
    const onSubmit=(event)=>{
        event.preventDefault();
        try{
            const response=axios.post('/auth/users/signup');
            console.log(response);
        }
        catch(err){
            console.log(err.response.data);
            setErrors(err.response.data.errors);
        }

    }
    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} className="form-control"/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value={password} onChange={e=>setPassword(e.target.value)}  type="password" className="form-control"/>
            </div>
            {errors.length && (
                <div className="alert alert-danger">
                    <h4>Oops....</h4>
                    <ul className="my-0">
                        {errors.map(err=>
                            <li key={err.message}>{err.message}</li>
                        )}
                    </ul>
                </div>
            )}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}

export default signupForm;