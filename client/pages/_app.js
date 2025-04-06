import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/buildClient';
import Header from './Components/header';
import axios from 'axios';

const AppComponent = ({Component, pageProps, currentUser})=>{
    return (
        <div>
            <Header currentUser={currentUser}/>
            <div className="container">
                <Component currentUser={currentUser} {...pageProps}/>
            </div>
        </div>);

}

AppComponent.getInitialProps=async appContext=>{
    const client=buildClient(appContext.ctx);
    // const { data }=await client.get('/auth/users/currentuser');
    const baseURL=typeof window=='undefined'?process.env.AUTH_SERVICE_URL:'';

    try{
        const { data }=await axios.get(`${baseURL}/auth/users/currentuser`);

        let pageProps={};
        if(appContext.Component.getInitialProps){
            pageProps=await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
        }
    
        return {pageProps,
            ...data
        };
    }
    catch(err){
        console.error('Error when fetching currentuser:', err);
        return {pageProps: {}};
    }


}

export default AppComponent;