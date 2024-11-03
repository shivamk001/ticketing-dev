import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/buildClient';
import Header from './Components/header';

const AppComponent = ({Component, pageProps, currentUser})=>{
    return (
        <div>
            <Header currentUser={currentUser}/>
            <Component {...pageProps}/>
        </div>);

}

AppComponent.getInitialProps=async appContext=>{
    const client=buildClient(appContext.ctx);
    const { data }=await client.get('/auth/users/currentuser');

    let pageProps={};
    if(appContext.Component.getInitialProps){
        pageProps=await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {pageProps,
        ...data
    };
}

export default AppComponent;