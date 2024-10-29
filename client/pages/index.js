import axios from "axios";

const landingPage=({ color })=>{
    return <h1>Landing Page {color}</h1>
}

landingPage.getInitialProps=async ({ req })=>{
    if(typeof window == 'undefined'){
        const { data }=await axios.get(
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
        {
            headers: req.headers
        }
    )
    return data;
    }
    else{
        const { data }=await axios.get(
            '/api/users/currentuser'
        )
        return data;
    }
}

export default landingPage;