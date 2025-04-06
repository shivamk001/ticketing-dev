import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const TicketShow=({ticket})=>{
    const { doRequest, errors}=useRequest({
        url: '/api/orders',
        method: 'POST',
        body: {ticketId: ticket.id},
        onSuccess: (order)=>Router.push('/orders/[orderId]', `/orders/${order.id}`)
        // onSuccess: (order)=>console.log(order)
    });
    return (<div>
        <h1>{ticket.title}</h1>
        <h4>Price {ticket.price}</h4>
        {errors}
        <button onClick={()=>doRequest()} className="btn btn-primary">
            Purchase
        </button>
    </div>)
}

TicketShow.getInitialProps=async (context, client)=>{
    const {ticketId}=context.query;
    // const {data}=await client.get(`/api/tickets/${ticketId}`);
    const baseURL=typeof window=='undefined'?process.env.TICKET_SERVICE_URL:'';
    console.log('TICKETID BASEURL:', baseURL);

    try{
        let {data}=await axios.get(`${baseURL}/api/tickets/${ticketId}`);
        console.log('TICKETID DATA:', data);
        return {ticket: data};
    }
    catch(err){
        console.error('Error when fetching ticket:', err);
        return { ticket: {}};
    }
}

export default TicketShow;