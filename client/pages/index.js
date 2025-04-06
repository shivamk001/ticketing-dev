import axios from 'axios';
import Link from 'next/link';

const landingPage=({ currentUser, tickets })=>{
    const ticketsList=tickets.map(ticket=>{
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                    View
                </Link>
                </td>
            </tr>
        )
    });

    return (<div>
        <h1>Tickets</h1>
        <table className="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {ticketsList}
            </tbody>
        </table>
    </div>);
}

landingPage.getInitialProps=async (context, client, currentUser)=>{
    // const { data }=await client.get('/api/tickets');
    const baseURL=typeof window=='undefined'?process.env.TICKET_SERVICE_URL:'';
    
    try{
        const { data }=await axios.get(`${baseURL}/api/tickets`);
        return {tickets: data};
    }
    catch(err){
        console.error('Error when fetching tickets:', err);
        return {tickets: []};
    }

}

export default landingPage;