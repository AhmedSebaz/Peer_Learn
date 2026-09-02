import React from "react";


function EventTable({
    events,
    registrations
}){


return (

<table className="
w-full
text-left
">


<thead className="
bg-gray-50
">

<tr>

<th className="p-4">
Event
</th>

<th className="p-4">
Date
</th>

<th className="p-4">
Participants
</th>

<th className="p-4">
Status
</th>

</tr>

</thead>



<tbody>

{

events.map(event=>(

<tr 
key={event.id}
className="border-t"
>


<td className="p-4 font-semibold">
{event.title}
</td>


<td className="p-4">
{event.date}
</td>


<td className="p-4">

{
registrations.filter(
(r)=>r.eventId===event.id
).length
}

</td>


<td className="p-4">

{event.status}

</td>


</tr>


))

}


</tbody>


</table>

);


}


export default EventTable;