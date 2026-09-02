import React, { useMemo } from "react";

import StatCard from "../components/StatCard";



function Analytics({

    events,
    registrations

}) {





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







const checkInRate =

registrations.length

?

Math.round(

(checkedInCount /

registrations.length)

*

100

)

:

0;









const analytics = useMemo(()=>{


return events.map((event)=>{


const eventRegistrations =

registrations.filter(

(registration)=>

registration.eventId===event.id

);





const verified =

eventRegistrations.filter(

(registration)=>

registration.payment==="Verified"

);






const revenue =

verified.reduce(

(total,item)=>

total + Number(item.amount || 0),

0

);






const percentage =

event.capacity > 0

?

Math.min(

(eventRegistrations.length /

event.capacity)

*

100,

100

)

:

0;






return {


...event,

registrations:
eventRegistrations.length,


verified:
verified.length,


revenue,


percentage


};



});



},[events,registrations]);










return (

<section>



<div className="mb-6">


<h2

className="
text-2xl
font-bold
"

>

Event Analytics

</h2>


<p

className="
text-gray-500
mt-1
"

>

Monitor registrations, occupancy and revenue.

</p>


</div>









{/* Summary Cards */}



<div

className="
grid
grid-cols-1
md:grid-cols-3
gap-6
mb-8
"

>




<StatCard


label="TOTAL REGISTRATIONS"


value={registrations.length}


description="All-time registrations"


/>







<StatCard


label="VERIFIED REVENUE"


value={`৳${totalRevenue}`}


description="Approved payments"


/>







<StatCard


label="CHECK-IN RATE"


value={`${checkInRate}%`}


description="Overall attendance"


/>





</div>









{/* Event Performance */}


<div

className="
bg-white
border
rounded-xl
p-6
"

>



<h3

className="
text-xl
font-bold
mb-6
"

>

Event Performance

</h3>









<div

className="
space-y-7
"

>



{

analytics.map((event)=>(



<div

key={event.id}

>




<div

className="
flex
justify-between
mb-2
"

>



<div>


<p

className="
font-semibold
"

>

{event.title}

</p>



<p

className="
text-gray-500
text-sm
"

>

{event.registrations}

registrations

&nbsp; • &nbsp;

{event.verified}

verified

&nbsp; • &nbsp;

৳{event.revenue}

revenue

</p>



</div>






<p

className="
font-bold
"

>

{Math.round(event.percentage)}%

</p>





</div>









{/* Progress Bar */}


<div

className="
w-full
bg-gray-100
h-3
rounded-full
overflow-hidden
"

>


<div

className="
bg-indigo-600
h-full
rounded-full
"

style={{

width:`${event.percentage}%`

}}

/>



</div>







</div>



))


}



</div>






</div>






</section>


);



}



export default Analytics;