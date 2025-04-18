import axios from "axios";
import { useState } from "react";

const useRequest = ({url, method, body, onSuccess})=>{
    const [errors, setErrors]=useState(null);

    const doRequest=async (props={})=>{
        try{
            setErrors(null);
            let response;
            if(method=='POST')
                response=await axios.post(url, {...body, ...props});
            else
                response=await axios.get(url, {...body, ...props});

            if(onSuccess)   onSuccess(response.data);
            console.log('DOREQUEST:', response.data, props);
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