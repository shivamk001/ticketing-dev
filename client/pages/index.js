const landingPage=({ currentUser })=>{
    return currentUser?(
        <h1>You are signed in</h1>
    ):
    (
        <h1>You are NOT signed in</h1>
    )
}

landingPage.getInitialProps=async (context, client, currentUser)=>{
    return {};
}

export default landingPage;