import axios from 'axios';

const OrderIndex=({orders})=>{
    return <ul>
        {orders.map(order=>{
            return <li key={order.id}>
                {order.ticket.title}-{order.status}
            </li>
        })}
    </ul>;
}

OrderIndex.getInitialProps=async (context, client)=>{
    // const { data }=await client.get('/api/orders');
    const baseURL=typeof window=='undefined'?process.env.ORDER_SERVICE_URL:'';
    console.log('ORDERS INDEX BASEURL:', baseURL);

    try{
        let {data}=await axios.get(`${baseURL}/api/orders`);
        console.log('ORDER INDEX DATA:', data);
        return { orders: data};
    }
    catch(err){
        console.error('Error when fetching orders:', err);
        return { orders: []};
    }
}

export default OrderIndex;

