import React from "react";



function ManageEvents({

    events,
    setEvents,
    setRegistrations,
    showMessage,
    getRegistrationCount

}) {





// Change status Draft <-> Published

const toggleEventStatus=(eventId)=>{


setEvents((previous)=>

previous.map((event)=>


event.id===eventId

?

{

...event,

status:
event.status==="Published"
?
"Draft"
:
"Published"


}

:

event


)


);



showMessage(
"Event status updated."
);


};








// Delete Event


const deleteEvent=(eventId)=>{


const confirmDelete =
window.confirm(
"Are you sure you want to delete this event?"
);



if(!confirmDelete)
return;





setEvents((previous)=>

previous.filter(

(event)=>
event.id!==eventId

)

);





// Remove related registrations

setRegistrations((previous)=>

previous.filter(

(registration)=>

registration.eventId!==eventId


)

);




showMessage(
"Event deleted successfully."
);


};







return (

<section>




<div

className="
flex
flex-col
sm:flex-row
justify-between
items-start
mb-6
gap-4
"

>


<div>


<h2

className="
text-2xl
font-bold
"

>

Manage Events

</h2>



<p

className="
text-gray-500
mt-1
"

>

Publish, unpublish or remove your club events.

</p>



</div>



</div>







<div

className="
grid
gap-5
"

>




{

events.map((event)=>(



<div

key={event.id}

className="
bg-white
border
rounded-xl
p-6
flex
flex-col
lg:flex-row
justify-between
gap-5
"

>



<div>



<div

className="
flex
items-center
gap-3
mb-2
"

>


<h3

className="
font-bold
text-lg
"

>

{event.title}

</h3>




<span

className={`

px-3
py-1
rounded-full
text-xs
font-semibold

${
event.status==="Published"

?

"bg-green-100 text-green-700"

:

"bg-yellow-100 text-yellow-700"

}

`}

>

{event.status}

</span>



</div>







<p

className="
text-gray-500
text-sm
"

>

📅 {event.date}

&nbsp; • &nbsp;

⏰ {event.time}

&nbsp; • &nbsp;

📍 {event.venue}

</p>








<p

className="
text-gray-500
text-sm
mt-3
"

>

👥

{" "}

{

getRegistrationCount(event.id)

}

/

{event.capacity}

Registrations


&nbsp; • &nbsp;


💰

৳{event.fee}


</p>






{
event.description &&


<p

className="
text-gray-600
text-sm
mt-3
"

>

{event.description}

</p>


}



</div>










<div

className="
flex
gap-3
items-center
flex-wrap
"

>



<button


onClick={()=>toggleEventStatus(event.id)}


className="
border
border-indigo-200
text-indigo-600
px-4
py-2
rounded-lg
font-medium
hover:bg-indigo-50
"

>


{

event.status==="Published"

?

"Move to Draft"

:

"Publish"


}


</button>








<button


onClick={()=>deleteEvent(event.id)}


className="
border
border-red-200
text-red-600
px-4
py-2
rounded-lg
font-medium
hover:bg-red-50
"

>


Delete


</button>






</div>







</div>



))





}







{
events.length===0 &&


<div

className="
bg-white
border
rounded-xl
p-10
text-center
text-gray-500
"

>

No events have been created yet.

</div>



}





</div>






</section>

);


}



export default ManageEvents;