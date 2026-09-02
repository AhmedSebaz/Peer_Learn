import React from "react";



function Registrations({

    registrations,
    getEvent

}) {



return (

<section>



<div className="
mb-6
">


<h2 className="
text-2xl
font-bold
">

Event Registrations

</h2>



<p className="
text-gray-500
mt-1
">

View registered students and their event information.

</p>


</div>








<div className="
bg-white
border
rounded-xl
overflow-x-auto
"
>


<table className="
w-full
text-left
min-w-[900px]
"
>


<thead
className="
bg-gray-50
text-gray-500
text-sm
"
>


<tr>


<th className="p-4">
Student
</th>


<th className="p-4">
Student ID
</th>


<th className="p-4">
Event
</th>


<th className="p-4">
Ticket ID
</th>


<th className="p-4">
Payment
</th>


</tr>


</thead>








<tbody>


{


registrations.map((registration)=>(


<tr

key={registration.id}

className="
border-t
"

>




{/* Student */}


<td className="
p-4
"
>


<p className="
font-semibold
">

{registration.name}

</p>


<p className="
text-sm
text-gray-500
">

{registration.email}

</p>


</td>









{/* Student ID */}


<td className="
p-4
"
>

{registration.studentId}

</td>









{/* Event */}


<td className="
p-4
"
>


{

getEvent(registration.eventId)
?.title

||

"Unknown Event"

}


</td>









{/* Ticket */}


<td className="
p-4
font-medium
text-indigo-600
"
>


{registration.ticketId}


</td>









{/* Payment */}


<td className="
p-4
"
>


<span

className={`

px-3
py-1
rounded-full
text-xs
font-semibold


${
registration.payment==="Verified"

?

"bg-green-100 text-green-700"


:

registration.payment==="Rejected"


?

"bg-red-100 text-red-700"


:

"bg-yellow-100 text-yellow-700"

}

`}

>


{registration.payment}


</span>



</td>







</tr>



))


}




</tbody>



</table>



</div>






{

registrations.length===0 &&


<div

className="
bg-white
border
rounded-xl
p-10
text-center
text-gray-500
mt-5
"

>

No registrations found.

</div>


}



</section>


);


}



export default Registrations;