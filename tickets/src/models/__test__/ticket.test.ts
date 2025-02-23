import { Ticket } from "../ticket";

it('Implements optimistic concurrency control',async ()=>{
    // create an instance of a ticket
    const ticket=Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    // save the ticket to the db
    await ticket.save();

    // fetch the ticket to the db
    const firstInstance=await Ticket.findById(ticket.id);

    const secondInstance=await Ticket.findById(ticket.id);

    // make two seperate changes to the ticket we fetched
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket & expect an error
    try{
        await secondInstance!.save();
    }
    catch(err){
        return;
    }
    console.log(secondInstance, firstInstance);

    throw new Error('Shall not reach this point.');
});

it('Increments the version no on multiple saves', async ()=>{
    // create an instance of a ticket
    const ticket=Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    // save the ticket to the db
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);

})