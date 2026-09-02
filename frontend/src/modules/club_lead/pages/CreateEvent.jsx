import React, { useState } from "react";



function CreateEvent({

    setEvents,
    setActiveTab,
    showMessage

}) {



const [form,setForm]=useState({

    title:"",
    description:"",
    date:"",
    time:"",
    venue:"",
    deadline:"",
    capacity:"",
    fee:""

});





const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:e.target.value


});


};







const handleSubmit=(e)=>{


e.preventDefault();




if(
!form.title ||
!form.date ||
!form.time ||
!form.venue ||
!form.capacity
){


showMessage(
"Please fill all required fields."
);


return;

}





const newEvent={


id:Date.now(),


title:form.title,


description:form.description,


date:form.date,


time:form.time,


venue:form.venue,


deadline:form.deadline,


capacity:Number(form.capacity),


fee:Number(form.fee || 0),


status:"Draft"


};






setEvents((previous)=>[

newEvent,

...previous

]);





setForm({

title:"",
description:"",
date:"",
time:"",
venue:"",
deadline:"",
capacity:"",
fee:""

});





showMessage(
"Event created successfully."
);




setActiveTab(
"Manage Events"
);



};







return (

<section

className="
bg-white
border
rounded-2xl
p-7
"

>



<div className="mb-7">


<h2

className="
text-2xl
font-bold
"

>

Create New Event

</h2>



<p

className="
text-gray-500
mt-1
"

>

Add event information and publish later.

</p>


</div>






<form

onSubmit={handleSubmit}

className="
grid
grid-cols-1
md:grid-cols-2
gap-6
"

>





{/* Event Title */}


<div>

<label

className="
block
font-semibold
text-sm
mb-2
"

>

Event Title *

</label>


<input


name="title"


value={form.title}


onChange={handleChange}


placeholder="AI Innovation Summit"


className="
w-full
border
rounded-lg
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"

/>


</div>









{/* Venue */}


<div>

<label

className="
block
font-semibold
text-sm
mb-2
"

>

Venue *

</label>


<input


name="venue"


value={form.venue}


onChange={handleChange}


placeholder="University Auditorium"


className="
w-full
border
rounded-lg
px-4
py-3
"

/>


</div>









{/* Date */}


<div>

<label

className="
block
font-semibold
text-sm
mb-2
"

>

Event Date *

</label>


<input


type="date"


name="date"


value={form.date}


onChange={handleChange}


className="
w-full
border
rounded-lg
px-4
py-3
"

/>


</div>









{/* Time */}


<div>

<label

className="
block
font-semibold
text-sm
mb-2
"

>

Start Time *

</label>


<input


type="time"


name="time"


value={form.time}


onChange={handleChange}


className="
w-full
border
rounded-lg
px-4
py-3
"

/>


</div>









{/* Deadline */}


<div>

<label

className="
block
font-semibold
text-sm
mb-2
"

>

Registration Deadline

</label>


<input


type="date"


name="deadline"


value={form.deadline}


onChange={handleChange}


className="
w-full
border
rounded-lg
px-4
py-3
"

/>


</div>









{/* Capacity */}


<div>

<label

className="
block
font-semibold
text-sm
mb-2
"

>

Participant Limit *

</label>


<input


type="number"


name="capacity"


value={form.capacity}


onChange={handleChange}


placeholder="150"


className="
w-full
border
rounded-lg
px-4
py-3
"

/>


</div>









{/* Fee */}


<div>

<label

className="
block
font-semibold
text-sm
mb-2
"

>

Registration Fee (BDT)

</label>


<input


type="number"


name="fee"


value={form.fee}


onChange={handleChange}


placeholder="0"


className="
w-full
border
rounded-lg
px-4
py-3
"

/>


</div>









{/* Description */}



<div

className="
md:col-span-2
"

>


<label

className="
block
font-semibold
text-sm
mb-2
"

>

Event Description

</label>


<textarea


name="description"


value={form.description}


onChange={handleChange}


rows="5"


placeholder="Write event details..."

className="
w-full
border
rounded-lg
px-4
py-3
resize-none
"

/>



</div>









{/* Buttons */}


<div

className="
md:col-span-2
flex
gap-3
"

>


<button


type="submit"


className="
bg-indigo-600
text-white
px-7
py-3
rounded-lg
font-semibold
hover:bg-indigo-700
"

>

Create Event

</button>






<button


type="button"


onClick={()=>setActiveTab("Overview")}


className="
border
px-7
py-3
rounded-lg
font-semibold
text-gray-600
"

>

Cancel

</button>



</div>






</form>




</section>


);



}



export default CreateEvent;