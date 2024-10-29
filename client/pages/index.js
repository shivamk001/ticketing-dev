import buildClient from "../api/buildClient"
const landingPage=({ color })=>{
    return <h1>Landing Page {color}</h1>
}

landingPage.getInitialProps=async (context)=>{
    let client=buildClient(context);
    const { data }=await client(context)
                        .get('/api/users/currentuser');
    return data;
}

export default landingPage;