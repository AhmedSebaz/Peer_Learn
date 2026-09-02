import React, { useState } from "react";



function QRCheckIn({

    registrations,
    setRegistrations,
    getEvent

}) {



const [searchText,setSearchText] =
useState("");



const [searchResult,setSearchResult] =
useState(null);








// Search Ticket / Student ID

const handleSearch=()=>{


const keyword =
searchText
.trim()
.toLowerCase();




if(!keyword){

setSearchResult(null);

return;

}






const found = registrations.find(

(registration)=>

registration.ticketId
.toLowerCase()
=== keyword

||

registration.studentId
.toLowerCase()
=== keyword


);






setSearchResult(

found || "not-found"

);



};









// Check-in function

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






// update search result also

setSearchResult((previous)=>{


if(
previous &&
previous !== "not-found"
){

return {

...previous,

checkedIn:
!previous.checkedIn

};

}


return previous;


});



};









return (

<section>



<div className="mb-6">


<h2

className="
text-2xl
font-bold
"

>

Smart Ticket Check-in

</h2>


<p

className="
text-gray-500
mt-1
"

>

Search by Ticket ID or Student ID and verify participants.

</p>


</div>









{/* Search Box */}


<div

className="
bg-gradient-to-r
from-gray-900
to-indigo-950
rounded-2xl
p-8
text-white
"

>


<p

className="
text-indigo-200
font-medium
"

>

PREMIUM CHECK-IN

</p>




<h3

className="
text-2xl
font-bold
mt-2
"

>

Verify Event Ticket

</h3>




<p

className="
text-gray-300
mt-2
"

>

Enter Ticket ID like PL-101 or Student ID.

</p>







<div

className="
flex
flex-col
sm:flex-row
gap-3
mt-6
"

>


<input


value={searchText}


onChange={(e)=>

setSearchText(e.target.value)

}


onKeyDown={(e)=>{

if(e.key==="Enter"){

handleSearch();

}

}}



placeholder="
Ticket ID / Student ID
"


className="
flex-1
px-4
py-3
rounded-lg
text-gray-900
outline-none
"

/>







<button


onClick={handleSearch}


className="
bg-indigo-500
hover:bg-indigo-400
px-6
py-3
rounded-lg
font-semibold
"

>


Verify Ticket


</button>




</div>




</div>









{/* Not Found */}


{

searchResult==="not-found" &&


<div

className="
mt-6
bg-red-50
border
border-red-200
text-red-700
rounded-xl
p-5
"

>

No valid participant found.

</div>


}









{/* Result Card */}



{

searchResult &&

searchResult !== "not-found" &&


<div

className="
mt-6
bg-white
border
rounded-xl
p-6
"

>


<div

className="
flex
flex-col
lg:flex-row
justify-between
gap-5
"

>



<div>



<p

className="
text-sm
text-gray-500
"

>

PARTICIPANT

</p>



<h3

className="
text-2xl
font-bold
mt-1
"

>

{searchResult.name}

</h3>



<p

className="
text-gray-500
mt-1
"

>

ID:

{searchResult.studentId}

</p>








<p

className="
mt-4
"

>

<strong>

Event:

</strong>


{" "}

{

getEvent(
searchResult.eventId
)?.title

}


</p>






<p

className="
mt-2
"

>

<strong>

Ticket:

</strong>


{" "}

{searchResult.ticketId}


</p>




</div>









<div

className="
flex
flex-col
items-start
lg:items-end
gap-3
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
searchResult.payment==="Verified"

?

"bg-green-100 text-green-700"

:

"bg-yellow-100 text-yellow-700"

}

`}

>

{searchResult.payment}

</span>








{

searchResult.checkedIn &&


<span

className="
bg-green-100
text-green-700
px-3
py-1
rounded-full
text-sm
font-semibold
"

>

Already Checked In

</span>


}







<button


disabled={
searchResult.payment !== "Verified"
}




onClick={()=>


toggleCheckIn(
searchResult.id
)


}




className={`

px-5
py-3
rounded-lg
font-semibold


${
searchResult.payment !== "Verified"

?

"bg-gray-100 text-gray-400 cursor-not-allowed"


:

"bg-indigo-600 text-white hover:bg-indigo-700"

}


`}


>



{

searchResult.checkedIn

?

"Undo Check-in"

:

"Confirm Check-in"

}



</button>





</div>








</div>



</div>



}



</section>


);



}



export default QRCheckIn;