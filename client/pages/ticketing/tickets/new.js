import useRequest from '../../hooks/useRequest';
import Router from 'next/router';
import { useState } from 'react';

const NewTicket=()=>{

    const [title, setTitle]=useState('');
    const [price, setPrice]=useState('');

    const { doRequest, errors}=useRequest({
        url: '/api/tickets',
        method: 'POST',
        body: {title, price},
        // onSuccess: ticket=>console.log(ticket)
        onSuccess: () => Router.push('/')
    });

    const onSubmit=async (event)=>{
        event.preventDefault();
        console.log('NEWTICKET TITLE PRICE:', title, price);
        
        await doRequest();
    }

    const onBlur=()=>{
        const value=parseFloat(price);
        
        if(isNaN(value)){
            return;
        }

        setPrice(value.toFixed(2));
    }

    return (
            <div>
                <h1>Create a Ticket</h1>
                <form onSubmit={onSubmit}>
                    <div className="form- group">
                        <label>Title</label>
                        <input 
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                            className="form-control"/>
                    </div>

                    <div className="form- group">
                        <label>Price</label>
                        <input 
                            value={price}
                            onChange={(e)=>setPrice(e.target.value)}
                            onBlur={onBlur}
                            className="form-control"/>
                    </div>
                    {errors}
                    <button className="btn btn-primary">Submit</button>
                </form>
        </div>
    );
}

export default NewTicket;