import React from "react";


function StatCard({
    label,
    value,
    description
}){


return (

<div className="
bg-white
border
rounded-xl
p-6
">

<p className="
text-gray-500
text-sm
font-semibold
">

{label}

</p>


<h3 className="
text-3xl
font-bold
mt-2
">

{value}

</h3>


<p className="
text-gray-500
text-sm
mt-2
">

{description}

</p>


</div>

);


}


export default StatCard;