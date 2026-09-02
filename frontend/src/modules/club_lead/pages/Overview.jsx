import React from "react";

import StatCard from "../components/StatCard";
import EventTable from "../components/EventTable";



function Overview({
    events,
    registrations,
    getRegistrationCount
}) {



const publishedEvents =
events.filter(
(event)=>event.status==="Published"
).length;



const pendingPayments =
registrations.filter(
(item)=>item.payment==="Pending"
).length;



const verifiedPayments =
registrations.filter(
(item)=>item.payment==="Verified"
).length;



const totalRevenue =
registrations

.filter(
(item)=>item.payment==="Verified"
)

.reduce(
(total,item)=>
total + Number(item.amount || 0),
0
);



const checkedInCount =
registrations.filter(
(item)=>item.checkedIn
).length;





return (

<div>



{/* Welcome Section */}

<section
className="
bg-gradient-to-r
from-indigo-600
to-purple-600
text-white
rounded-2xl
p-8
mb-8
shadow-lg
"
>


<p
className="
text-indigo-100
font-medium
mb-2
"
>

CLUB MANAGEMENT CENTER

</p>



<h2
className="
text-3xl
font-bold
"
>

Welcome back, Club Lead!

</h2>



<p
className="
text-indigo-100
mt-3
max-w-2xl
"
>

Create university events, track registrations,
verify transactions, manage participants and
monitor event performance from one dashboard.

</p>


</section>





{/* Main Statistics */}


<section
className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
mb-8
"
>



<StatCard

label="TOTAL EVENTS"

value={events.length}

description="Created by your club"

/>




<StatCard

label="PUBLISHED EVENTS"

value={publishedEvents}

description="Currently visible"

/>




<StatCard

label="REGISTRATIONS"

value={registrations.length}

description="Across all events"

/>




<StatCard

label="PENDING PAYMENTS"

value={pendingPayments}

description="Need verification"

/>



</section>







{/* Secondary Statistics */}


<section
className="
grid
grid-cols-1
lg:grid-cols-3
gap-6
mb-8
"
>



<div
className="
bg-white
border
rounded-xl
p-6
"
>

<p
className="
text-gray-500
text-sm
font-semibold
"
>

VERIFIED PAYMENTS

</p>


<h3
className="
text-3xl
font-bold
mt-2
"
>

{verifiedPayments}

</h3>


<p
className="
text-gray-500
mt-2
text-sm
"
>

Approved transactions

</p>


</div>





<div
className="
bg-white
border
rounded-xl
p-6
"
>

<p
className="
text-gray-500
text-sm
font-semibold
"
>

TOTAL REVENUE

</p>


<h3
className="
text-3xl
font-bold
mt-2
"
>

৳{totalRevenue}

</h3>


<p
className="
text-gray-500
mt-2
text-sm
"
>

From verified payments

</p>


</div>






<div
className="
bg-white
border
rounded-xl
p-6
"
>


<p
className="
text-gray-500
text-sm
font-semibold
"
>

CHECKED-IN PARTICIPANTS

</p>


<h3
className="
text-3xl
font-bold
mt-2
"
>

{checkedInCount}

</h3>


<p
className="
text-gray-500
mt-2
text-sm
"
>

Attendance recorded

</p>


</div>



</section>








{/* Recent Events */}


<section
className="
bg-white
border
rounded-xl
overflow-hidden
"
>


<div
className="
px-6
py-5
border-b
"
>


<h3
className="
text-xl
font-bold
"
>

Recent Events

</h3>



<p
className="
text-sm
text-gray-500
mt-1
"
>

Your latest club activities

</p>


</div>




<EventTable

events={events.slice(0,4)}

registrations={registrations}

/>



</section>





</div>

);


}



export default Overview;