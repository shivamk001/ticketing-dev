import axios from "axios";
import { useState } from "react";

const useRequest = ({url, method, body})=>{
    const [errors, setErrors]=useState(null);

    const doRequest=async ()=>{
        try{
            setErrors(null);
            const response=await axios[method](url, body);

            return response.data;
        }
        catch(err){
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