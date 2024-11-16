import axios from "axios";
import { useState } from "react";

const useRequest = ({url, method, body, onSuccess})=>{
    const [errors, setErrors]=useState(null);

    const doRequest=async ()=>{
        try{
            setErrors(null);
            let response;
            if(method=='POST')
                response=await axios.post(url, body);
            else
                response=await axios.get(url, body);

            if(onSuccess)   onSuccess(response.data);
            return response.data;
        }
        catch(err){
            console.log('ERROR:', err);
            setErrors((
                <div className="alert alert-danger">
                    <h4>Oops....</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(er=>
                            <li key={er.message}>{er.message}</li>
                        )}
                    </ul>
                </div>
            ))
        }
    }
    return { doRequest, errors};
}

export default useRequest;