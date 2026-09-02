import React, { useState } from "react";


function EventCalendar({ events }) {


const today = new Date();


const [currentMonth,setCurrentMonth] = useState(
    today.getMonth()
);


const [currentYear,setCurrentYear] = useState(
    today.getFullYear()
);



const [selectedDate,setSelectedDate] = useState(null);





// Month names

const monthNames=[

"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December"

];






// Days

const days=[

"Sun",
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat"

];






// Total days of month

const daysInMonth =
new Date(
currentYear,
currentMonth+1,
0
).getDate();





// Starting day

const firstDay =
new Date(
currentYear,
currentMonth,
1
).getDay();






// Change month

const changeMonth=(direction)=>{


let newMonth=currentMonth+direction;

let newYear=currentYear;



if(newMonth<0){

newMonth=11;
newYear--;

}



if(newMonth>11){

newMonth=0;
newYear++;

}



setCurrentMonth(newMonth);

setCurrentYear(newYear);


};







// Get event by date

const getEventsByDate=(date)=>{


const formatted =

`${currentYear}-${String(currentMonth+1)
.padStart(2,"0")}-${String(date)
.padStart(2,"0")}`;



return events.filter(

event=>

event.date===formatted

);


};







return (

<div>


{/* Header */}

<div className="
flex
justify-between
items-center
mb-6
">


<button

onClick={()=>changeMonth(-1)}

className="
px-4
py-2
border
rounded-lg
"

>

←

</button>



<h2 className="
text-2xl
font-bold
">

{monthNames[currentMonth]}
{" "}
{currentYear}

</h2>




<button

onClick={()=>changeMonth(1)}

className="
px-4
py-2
border
rounded-lg
"

>

→

</button>



</div>







{/* Calendar */}


<div className="
bg-white
border
rounded-2xl
p-6
"
>




{/* Week header */}


<div className="
grid
grid-cols-7
gap-2
mb-3
"
>


{

days.map(day=>(

<div

key={day}

className="
text-center
font-semibold
text-gray-500
"

>

{day}

</div>

))

}


</div>








{/* Dates */}


<div className="
grid
grid-cols-7
gap-2
"
>





{

Array.from({

length:firstDay

}).map((_,index)=>(


<div
key={"empty"+index}
className="
h-24
"
/>


))

}







{

Array.from({

length:daysInMonth

}).map((_,index)=>{


const date=index+1;


const dayEvents =
getEventsByDate(date);



return (


<div

key={date}

onClick={()=>setSelectedDate(date)}

className={`

h-24
border
rounded-xl
p-2
cursor-pointer
hover:bg-indigo-50

${

selectedDate===date

?

"bg-indigo-100 border-indigo-500"

:

"bg-white"

}

`}

>


<p className="
font-bold
">

{date}

</p>





{

dayEvents.length>0 &&

<div className="
mt-2
"

>


<div className="
w-2
h-2
rounded-full
bg-indigo-600
inline-block
mr-1
"

></div>


<span className="
text-xs
text-indigo-600
font-semibold
">

{dayEvents.length}
Event

</span>


</div>

}



</div>


)


})

}




</div>


</div>







{/* Selected date events */}


{

selectedDate &&


<div className="
mt-8
bg-white
border
rounded-xl
p-6
"
>


<h3 className="
text-xl
font-bold
mb-4
">

Events on 

{" "}

{selectedDate}

{" "}

{monthNames[currentMonth]}

</h3>





{

getEventsByDate(selectedDate).length===0

?

<p className="
text-gray-500
">

No events on this date.

</p>


:


<div className="
space-y-4
">


{

getEventsByDate(selectedDate)
.map(event=>(


<div

key={event.id}

className="
border
rounded-xl
p-4
"

>


<h4 className="
font-bold
text-lg
">

{event.title}

</h4>


<p className="
text-gray-500
">

📍 {event.venue}

</p>


<p className="
text-gray-500
">

⏰ {event.time}

</p>



<span className="
inline-block
mt-2
bg-green-100
text-green-700
px-3
py-1
rounded-full
text-xs
"

>

{event.status}

</span>



</div>


))


}



</div>


}



</div>


}



</div>


);


}



export default EventCalendar;