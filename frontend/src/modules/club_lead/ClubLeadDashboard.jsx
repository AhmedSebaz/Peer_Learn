import React, { useEffect, useState } from "react";


// Components
import ClubNavbar from "./components/ClubNavbar";


// Pages
import Overview from "./pages/Overview";
import EventCalendar from "./pages/EventCalendar";
import CreateEvent from "./pages/CreateEvent";
import ManageEvents from "./pages/ManageEvents";
import Registrations from "./pages/Registrations";
import Payments from "./pages/Payments";
import Participants from "./pages/Participants";
import Analytics from "./pages/Analytics";
import QRCheckIn from "./pages/QRCheckIn";


// Default Data
import {
  defaultEvents,
  defaultRegistrations
} from "./data/defaultData";




function ClubLeadDashboard() {


const [activeTab,setActiveTab] =
useState("Overview");





// Events

const [events,setEvents] = useState(()=>{


const saved =
localStorage.getItem(
"peerlearn_events"
);


return saved
?
JSON.parse(saved)
:
defaultEvents;


});








// Registrations

const [registrations,setRegistrations] =
useState(()=>{


const saved =
localStorage.getItem(
"peerlearn_registrations"
);


return saved
?
JSON.parse(saved)
:
defaultRegistrations;


});








const [message,setMessage] =
useState("");








// Save events

useEffect(()=>{


localStorage.setItem(

"peerlearn_events",

JSON.stringify(events)

);


},[events]);









// Save registrations

useEffect(()=>{


localStorage.setItem(

"peerlearn_registrations",

JSON.stringify(registrations)

);


},[registrations]);
// Message

const showMessage=(text)=>{
setMessage(text);
setTimeout(()=>{
setMessage("");
},2500);


};
// Get event

const getEvent=(eventId)=>{


return events.find(

event=>event.id===eventId

);

};
// Registration count

const getRegistrationCount=(eventId)=>{
return registrations.filter(
item=>item.eventId===eventId
).length;

};

return (


<div className="
min-h-screen
bg-gray-50
text-gray-900
">





<header className="
bg-white
border-b
">


<div className="
max-w-7xl
mx-auto
px-6
py-4
flex
justify-between
items-center
">


<div className="
flex
gap-3
items-center
">


<div className="
w-10
h-10
bg-indigo-600
text-white
rounded-xl
flex
items-center
justify-center
font-bold
">

PL

</div>



<div>

<h1 className="
font-bold
text-xl
">

Peer-Learn Club Portal

</h1>


<p className="
text-gray-500
text-sm
">

Club Event Management

</p>


</div>


</div>







<div className="
text-right
">

<p className="
font-semibold
">

Club Lead

</p>


<p className="
text-gray-500
text-sm
">

Computer Club

</p>


</div>


</div>


</header>









<main className="
max-w-7xl
mx-auto
px-6
py-8
">








{
message &&


<div className="
fixed
top-5
right-5
bg-gray-900
text-white
px-5
py-3
rounded-xl
shadow-lg
z-50
">

{message}

</div>


}









<ClubNavbar

activeTab={activeTab}
setActiveTab={setActiveTab}


/>

<div className="mt-8">

{
activeTab==="Overview" &&


<Overview

events={events}

registrations={registrations}

getRegistrationCount={getRegistrationCount}

/>
}
{
activeTab==="Event Calendar" &&

<EventCalendar

events={events}

/>

}

{
activeTab==="Create Event" &&


<CreateEvent

setEvents={setEvents}

setActiveTab={setActiveTab}

showMessage={showMessage}

/>

}
{
activeTab==="Manage Events" &&


<ManageEvents

events={events}

setEvents={setEvents}

setRegistrations={setRegistrations}

showMessage={showMessage}

getRegistrationCount={getRegistrationCount}

/>

}

{
activeTab==="Registrations" &&


<Registrations

registrations={registrations}

getEvent={getEvent}

/>

}
{
activeTab==="Payments" &&


<Payments

registrations={registrations}

setRegistrations={setRegistrations}

getEvent={getEvent}

showMessage={showMessage}

/>

}

{
activeTab==="Participants" &&
<Participants
registrations={registrations}
setRegistrations={setRegistrations}
getEvent={getEvent}
showMessage={showMessage}
/>
}
{
activeTab==="Analytics" &&
<Analytics
events={events}
registrations={registrations}
/>
}
{
activeTab==="QR Check-in" &&


<QRCheckIn
registrations={registrations}
setRegistrations={setRegistrations}
getEvent={getEvent}
/>
}
</div>
</main>
</div>
);
}
export default ClubLeadDashboard;