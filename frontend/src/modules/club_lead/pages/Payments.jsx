import React from "react";



function Payments({

    registrations,
    setRegistrations,
    getEvent,
    showMessage

}) {



const updatePayment=(registrationId,status)=>{


setRegistrations((previous)=>

previous.map((registration)=>

registration.id===registrationId

?

{

...registration,

payment:status

}

:

registration


)

);



showMessage(
`Payment marked as ${status}.`
);


};







return (

<section>



<div className="mb-6">


<h2 className="
text-2xl
font-bold
">

Payment Verification

</h2>


<p className="
text-gray-500
mt-1
">

Review submitted transaction IDs before approving registrations.

</p>


</div>








<div className="
grid
gap-5
"
>



{


registrations.map((registration)=>(


<div

key={registration.id}

className="
bg-white
border
rounded-xl
p-6
flex
flex-col
lg:flex-row
justify-between
gap-5
"

>






{/* Student Information */}


<div>


<h3 className="
font-bold
text-lg
">

{registration.name}

</h3>



<p className="
text-gray-500
text-sm
mt-1
">

{

getEvent(registration.eventId)
?.title

}

</p>







<div className="
flex
flex-wrap
gap-5
text-sm
mt-4
"
>


<span>

Amount:

<strong>

৳{registration.amount}

</strong>

</span>



<span>

Transaction:

<strong>

{registration.transactionId}

</strong>

</span>



</div>



</div>









{/* Action Area */}


<div className="
flex
items-center
gap-3
flex-wrap
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







<button


onClick={()=>


updatePayment(
registration.id,
"Verified"
)


}


className="
bg-green-600
text-white
px-4
py-2
rounded-lg
font-medium
hover:bg-green-700
"

>


Verify


</button>








<button


onClick={()=>


updatePayment(
registration.id,
"Rejected"
)


}


className="
bg-red-50
text-red-600
px-4
py-2
rounded-lg
font-medium
hover:bg-red-100
"

>


Reject


</button>





</div>







</div>


))


}



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
"

>

No payment records available.

</div>


}



</section>


);



}



export default Payments;