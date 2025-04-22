import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const SignOut=()=>{
    const { doRequest}=useRequest({
        url: '/auth/users/signout',
        method: 'POST',
        body: {},
        onSuccess: ()=>Router.push('/')
    })

    useEffect(()=>{
        doRequest();
    }, []);

    return <div>Signing you out...</div>
}

export default SignOut;