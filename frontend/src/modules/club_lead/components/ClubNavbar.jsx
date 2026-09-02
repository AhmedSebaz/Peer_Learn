import React from "react";

function ClubNavbar({

    activeTab,
    setActiveTab
})

{
const tabs=[

"Overview",
"Event Calendar",
"Create Event",
"Manage Events",
"Registrations",
"Payments",
"Participants",
"Analytics",
"QR Check-in"

];
return (

<nav
className="
bg-white
border
rounded-xl
p-2
flex
gap-2
overflow-x-auto
mb-8
"
>
{

tabs.map((tab)=>(
<button

key={tab}

onClick={()=>setActiveTab(tab)}

className={
`
whitespace-nowrap
px-5
py-3
rounded-lg
font-medium
transition

${
activeTab===tab
?
"bg-indigo-600 text-white shadow"
:
"text-gray-600 hover:bg-gray-100"

}

`
}
>
{tab}
</button>
))
}
</nav>
);}
export default ClubNavbar;