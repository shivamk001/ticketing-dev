import axios from "axios";

const buildClient=({req})=>{

    if(typeof window == 'undefined'){
        console.log('BC', req.headers);
        console.log('BC1', axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        }));
        return axios.create({
                baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
                headers: req.headers
        })
    }
    else{
        console.log('BC2', axios.create({
            baseURL: '/'
        }));
        
        return axios.create({
            baseURL: '/'
        })
    }
}
export default buildClient;