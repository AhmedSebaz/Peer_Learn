import React from "react";



function Participants({

    registrations,
    setRegistrations,
    getEvent,
    showMessage

}) {





// Check-in toggle

const toggleCheckIn=(registrationId)=>{


setRegistrations((previous)=>

previous.map((registration)=>

registration.id===registrationId

?

{

...registration,

checkedIn:
!registration.checkedIn

}

:

registration


)

);



};







// Export CSV

const exportParticipants=()=>{


const headers=[

"Name",
"Student ID",
"Email",
"Event",
"Ticket ID",
"Payment Status",
"Checked In"

];






const rows = registrations.map(
(registration)=>[


registration.name,


registration.studentId,


registration.email,


getEvent(registration.eventId)
?.title || "Unknown Event",


registration.ticketId,


registration.payment,


registration.checkedIn
?
"Yes"
:
"No"



]
);







const csv=[headers,...rows]

.map(row=>

row.map(
(cell)=>
`"${String(cell)
.replaceAll('"','""')}"`
)
.join(",")

)

.join("\n");







const blob = new Blob(
[csv],
{
type:"text/csv;charset=utf-8;"
}
);




const url =
URL.createObjectURL(blob);



const link =
document.createElement("a");


link.href=url;


link.download=
"peer-learn-participants.csv";


link.click();



URL.revokeObjectURL(url);



showMessage(
"Participant CSV exported."
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
gap-4
mb-6
"
>


<div>


<h2
className="
text-2xl
font-bold
"
>

Participant Management

</h2>


<p
className="
text-gray-500
mt-1
"
>

Manage attendance and export participant data.

</p>


</div>







<button

onClick={exportParticipants}

className="
bg-indigo-600
text-white
px-5
py-3
rounded-lg
font-semibold
hover:bg-indigo-700
"

>

Export CSV

</button>



</div>









<div

className="
bg-white
border
rounded-xl
overflow-x-auto
"

>


<table

className="
w-full
text-left
min-w-[950px]
"

>


<thead

className="
bg-gray-50
text-sm
text-gray-500
"

>


<tr>


<th className="p-4">

Participant

</th>


<th className="p-4">

Event

</th>


<th className="p-4">

Ticket

</th>


<th className="p-4">

Payment

</th>


<th className="p-4">

Attendance

</th>


<th className="p-4">

Action

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







{/* Participant */}


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

{registration.studentId}

</p>


</td>








{/* Event */}


<td className="
p-4
"
>


{

getEvent(registration.eventId)
?.title

}


</td>







{/* Ticket */}


<td className="
p-4
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







{/* Attendance */}


<td className="
p-4
"
>


{

registration.checkedIn

?


<span
className="
text-green-600
font-semibold
"
>

Checked In

</span>


:


<span
className="
text-gray-500
"
>

Not Checked In

</span>


}



</td>








{/* Action */}


<td className="
p-4
"
>


<button


disabled={
registration.payment!=="Verified"
}



onClick={()=>

toggleCheckIn(
registration.id
)

}



className={`

px-4
py-2
rounded-lg
font-medium


${

registration.payment!=="Verified"

?

"bg-gray-100 text-gray-400 cursor-not-allowed"


:

registration.checkedIn


?

"bg-orange-50 text-orange-600"


:

"bg-indigo-600 text-white"

}

`}



>


{

registration.checkedIn

?

"Undo"

:

"Check In"

}


</button>


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

No participants found.

</div>


}




</section>


);



}



export default Participants;