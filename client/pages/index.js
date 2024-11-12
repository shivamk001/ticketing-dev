import buildClient from "../api/buildClient"
const landingPage=({ currentUser })=>{
    return currentUser?(
        <h1>You are signed in</h1>
    ):
    (
        <h1>You are NOT signed in</h1>
    )
}

landingPage.getInitialProps=async (context)=>{
    let client=buildClient(context);
    const { data }=await client
                        .get('/auth/users/currentuser');
    return data;
}

export default landingPage;