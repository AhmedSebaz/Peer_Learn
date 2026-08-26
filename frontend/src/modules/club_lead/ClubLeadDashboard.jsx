import React, { useEffect, useMemo, useState } from "react";
import EventCalendar from "./EventCalendar.jsx";
const defaultEvents = [
  {
    id: 1,
    title: "AI & Career Development Workshop",
    date: "2026-08-30",
    time: "10:00",
    venue: "University Auditorium",
    capacity: 150,
    fee: 200,
    status: "Published",
  },
  {
    id: 2,
    title: "Inter University Coding Contest",
    date: "2026-09-05",
    time: "09:00",
    venue: "CSE Lab Complex",
    capacity: 100,
    fee: 300,
    status: "Published",
  },
  {
    id: 3,
    title: "Career Networking Session",
    date: "2026-09-10",
    time: "14:00",
    venue: "Seminar Hall",
    capacity: 200,
    fee: 0,
    status: "Draft",
  },
];

const defaultRegistrations = [
  {
    id: 101,
    eventId: 1,
    name: "Rahim Ahmed",
    studentId: "22101234",
    email: "rahim@student.edu",
    transactionId: "TXN845762",
    amount: 200,
    payment: "Pending",
    ticketId: "PL-101",
    checkedIn: false,
  },
  {
    id: 102,
    eventId: 1,
    name: "Nusrat Jahan",
    studentId: "22104567",
    email: "nusrat@student.edu",
    transactionId: "TXN845900",
    amount: 200,
    payment: "Verified",
    ticketId: "PL-102",
    checkedIn: false,
  },
  {
    id: 103,
    eventId: 2,
    name: "Tanvir Hasan",
    studentId: "23101987",
    email: "tanvir@student.edu",
    transactionId: "TXN901245",
    amount: 300,
    payment: "Verified",
    ticketId: "PL-103",
    checkedIn: true,
  },
  {
    id: 104,
    eventId: 2,
    name: "Sadia Islam",
    studentId: "23102345",
    email: "sadia@student.edu",
    transactionId: "TXN902211",
    amount: 300,
    payment: "Pending",
    ticketId: "PL-104",
    checkedIn: false,
  },
];

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function ClubLeadDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  const [events, setEvents] = useState(() =>
    loadData("peerlearn_events", defaultEvents)
  );

  const [registrations, setRegistrations] = useState(() =>
    loadData("peerlearn_registrations", defaultRegistrations)
  );

  const [message, setMessage] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    deadline: "",
    capacity: "",
    fee: "",
  });

  useEffect(() => {
    localStorage.setItem("peerlearn_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(
      "peerlearn_registrations",
      JSON.stringify(registrations)
    );
  }, [registrations]);

  const tabs = [
    "Overview",
    "Event Calendar",
    "Create Event",
    "Manage Events",
    "Registrations",
    "Payments",
    "Participants",
    "Analytics",
    "QR Check-in",
  ];

  const publishedEvents = events.filter(
    (event) => event.status === "Published"
  );

  const pendingPayments = registrations.filter(
    (registration) => registration.payment === "Pending"
  ).length;

  const verifiedPayments = registrations.filter(
    (registration) => registration.payment === "Verified"
  ).length;

  const totalRevenue = registrations
    .filter((registration) => registration.payment === "Verified")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const checkedInCount = registrations.filter(
    (registration) => registration.checkedIn
  ).length;

  const getEvent = (eventId) =>
    events.find((event) => event.id === eventId);

  const getRegistrationCount = (eventId) =>
    registrations.filter(
      (registration) => registration.eventId === eventId
    ).length;

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.date ||
      !form.time ||
      !form.venue ||
      !form.capacity
    ) {
      showMessage("Please fill in all required fields.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      venue: form.venue,
      deadline: form.deadline,
      capacity: Number(form.capacity),
      fee: Number(form.fee || 0),
      status: "Draft",
    };

    setEvents((previous) => [newEvent, ...previous]);

    setForm({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      deadline: "",
      capacity: "",
      fee: "",
    });

    showMessage("Event created successfully.");
    setActiveTab("Manage Events");
  };

  const toggleEventStatus = (eventId) => {
    setEvents((previous) =>
      previous.map((event) =>
        event.id === eventId
          ? {
              ...event,
              status:
                event.status === "Published" ? "Draft" : "Published",
            }
          : event
      )
    );

    showMessage("Event status updated.");
  };

  const deleteEvent = (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    setEvents((previous) =>
      previous.filter((event) => event.id !== eventId)
    );

    setRegistrations((previous) =>
      previous.filter(
        (registration) => registration.eventId !== eventId
      )
    );

    showMessage("Event deleted.");
  };

  const updatePayment = (registrationId, status) => {
    setRegistrations((previous) =>
      previous.map((registration) =>
        registration.id === registrationId
          ? {
              ...registration,
              payment: status,
            }
          : registration
      )
    );

    showMessage(`Payment marked as ${status}.`);
  };

  const toggleCheckIn = (registrationId) => {
    setRegistrations((previous) =>
      previous.map((registration) =>
        registration.id === registrationId
          ? {
              ...registration,
              checkedIn: !registration.checkedIn,
            }
          : registration
      )
    );
  };

  const handleTicketSearch = () => {
    const keyword = ticketSearch.trim().toLowerCase();

    if (!keyword) {
      setSearchResult(null);
      return;
    }

    const found = registrations.find(
      (registration) =>
        registration.ticketId.toLowerCase() === keyword ||
        registration.studentId.toLowerCase() === keyword
    );

    setSearchResult(found || "not-found");
  };

  const exportParticipants = () => {
    const headers = [
      "Name",
      "Student ID",
      "Email",
      "Event",
      "Ticket ID",
      "Payment",
      "Checked In",
    ];

    const rows = registrations.map((registration) => [
      registration.name,
      registration.studentId,
      registration.email,
      getEvent(registration.eventId)?.title || "Unknown Event",
      registration.ticketId,
      registration.payment,
      registration.checkedIn ? "Yes" : "No",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "peer-learn-participants.csv";
    link.click();

    URL.revokeObjectURL(url);

    showMessage("Participant CSV exported.");
  };

  const analytics = useMemo(() => {
    return events.map((event) => {
      const eventRegistrations = registrations.filter(
        (registration) => registration.eventId === event.id
      );

      const verified = eventRegistrations.filter(
        (registration) => registration.payment === "Verified"
      );

      const revenue = verified.reduce(
        (total, registration) =>
          total + Number(registration.amount || 0),
        0
      );

      return {
        ...event,
        registrations: eventRegistrations.length,
        verified: verified.length,
        revenue,
        percentage:
          event.capacity > 0
            ? Math.min(
                (eventRegistrations.length / event.capacity) * 100,
                100
              )
            : 0,
      };
    });
  }, [events, registrations]);

  const renderOverview = () => (
    <>
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
        <p className="text-indigo-100 font-medium mb-2">
          CLUB MANAGEMENT CENTER
        </p>

        <h2 className="text-3xl font-bold">
          Welcome back, Club Lead!
        </h2>

        <p className="text-indigo-100 mt-3 max-w-2xl">
          Create university events, track registrations, verify
          transactions, manage participants and monitor event
          performance from one dashboard.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => setActiveTab("Create Event")}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50"
          >
            + Create New Event
          </button>

          <button
            onClick={() => setActiveTab("Analytics")}
            className="bg-indigo-500/40 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500/60"
          >
            View Analytics
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="TOTAL EVENTS"
          value={events.length}
          description="Created by your club"
        />

        <StatCard
          label="PUBLISHED EVENTS"
          value={publishedEvents.length}
          description="Currently visible"
          accent="text-green-600"
        />

        <StatCard
          label="REGISTRATIONS"
          value={registrations.length}
          description="Across all events"
          accent="text-purple-600"
        />

        <StatCard
          label="PENDING PAYMENTS"
          value={pendingPayments}
          description="Need verification"
          accent="text-orange-600"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500 text-sm font-semibold">
            VERIFIED PAYMENTS
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {verifiedPayments}
          </h3>

          <p className="text-gray-500 mt-2 text-sm">
            Approved transactions
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500 text-sm font-semibold">
            TOTAL REVENUE
          </p>

          <h3 className="text-3xl font-bold mt-2">
            ৳{totalRevenue}
          </h3>

          <p className="text-gray-500 mt-2 text-sm">
            From verified payments
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500 text-sm font-semibold">
            CHECKED-IN PARTICIPANTS
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {checkedInCount}
          </h3>

          <p className="text-gray-500 mt-2 text-sm">
            Attendance recorded
          </p>
        </div>
      </section>

      <section className="bg-white border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">
              Recent Events
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Your latest club activities
            </p>
          </div>

          <button
            onClick={() => setActiveTab("Manage Events")}
            className="text-indigo-600 font-semibold"
          >
            View All
          </button>
        </div>

        <EventTable
          events={events.slice(0, 4)}
          registrations={registrations}
          onManage={() => setActiveTab("Manage Events")}
        />
      </section>
    </>
  );

  const renderCreateEvent = () => (
    <section className="bg-white border rounded-2xl p-7">
      <div className="mb-7">
        <h2 className="text-2xl font-bold">
          Create New Event
        </h2>

        <p className="text-gray-500 mt-1">
          Add the event information and publish it later from
          Manage Events.
        </p>
      </div>

      <form
        onSubmit={handleCreateEvent}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <FormField label="Event Title *">
          <input
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="input-style"
            placeholder="e.g. AI Innovation Summit"
          />
        </FormField>

        <FormField label="Venue *">
          <input
            value={form.venue}
            onChange={(e) =>
              setForm({
                ...form,
                venue: e.target.value,
              })
            }
            className="input-style"
            placeholder="University Auditorium"
          />
        </FormField>

        <FormField label="Event Date *">
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
            className="input-style"
          />
        </FormField>

        <FormField label="Start Time *">
          <input
            type="time"
            value={form.time}
            onChange={(e) =>
              setForm({
                ...form,
                time: e.target.value,
              })
            }
            className="input-style"
          />
        </FormField>

        <FormField label="Registration Deadline">
          <input
            type="date"
            value={form.deadline}
            onChange={(e) =>
              setForm({
                ...form,
                deadline: e.target.value,
              })
            }
            className="input-style"
          />
        </FormField>

        <FormField label="Participant Limit *">
          <input
            type="number"
            min="1"
            value={form.capacity}
            onChange={(e) =>
              setForm({
                ...form,
                capacity: e.target.value,
              })
            }
            className="input-style"
            placeholder="150"
          />
        </FormField>

        <FormField label="Registration Fee (BDT)">
          <input
            type="number"
            min="0"
            value={form.fee}
            onChange={(e) =>
              setForm({
                ...form,
                fee: e.target.value,
              })
            }
            className="input-style"
            placeholder="0"
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Event Description">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              rows="5"
              className="input-style resize-none"
              placeholder="Write a short description about the event..."
            />
          </FormField>
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-lg font-semibold"
          >
            Create Event
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("Overview")}
            className="border px-7 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );

  const renderManageEvents = () => (
    <section>
      <SectionHeader
        title="Manage Events"
        description="Publish, unpublish or remove your club events."
        buttonText="+ Create Event"
        onButton={() => setActiveTab("Create Event")}
      />

      <div className="grid gap-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white border rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            <div>
              <div className="flex gap-3 items-center mb-2">
                <h3 className="font-bold text-lg">
                  {event.title}
                </h3>

                <StatusBadge status={event.status} />
              </div>

              <p className="text-gray-500 text-sm">
                {event.date} • {event.time} • {event.venue}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                {getRegistrationCount(event.id)} / {event.capacity}{" "}
                registrations • Fee: ৳{event.fee}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => toggleEventStatus(event.id)}
                className="border border-indigo-200 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50"
              >
                {event.status === "Published"
                  ? "Move to Draft"
                  : "Publish"}
              </button>

              <button
                onClick={() => deleteEvent(event.id)}
                className="border border-red-200 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <EmptyState text="No events have been created yet." />
        )}
      </div>
    </section>
  );

  const renderRegistrations = () => (
    <section>
      <SectionHeader
        title="Event Registrations"
        description="View registered students and their event information."
      />

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Student ID</th>
              <th className="p-4">Event</th>
              <th className="p-4">Ticket</th>
              <th className="p-4">Payment</th>
            </tr>
          </thead>

          <tbody>
            {registrations.map((registration) => (
              <tr
                key={registration.id}
                className="border-t"
              >
                <td className="p-4">
                  <p className="font-semibold">
                    {registration.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {registration.email}
                  </p>
                </td>

                <td className="p-4">
                  {registration.studentId}
                </td>

                <td className="p-4">
                  {getEvent(registration.eventId)?.title ||
                    "Unknown Event"}
                </td>

                <td className="p-4 font-medium text-indigo-600">
                  {registration.ticketId}
                </td>

                <td className="p-4">
                  <PaymentBadge status={registration.payment} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderPayments = () => (
    <section>
      <SectionHeader
        title="Payment Verification"
        description="Review submitted transaction IDs before approving registrations."
      />

      <div className="grid gap-4">
        {registrations.map((registration) => (
          <div
            key={registration.id}
            className="bg-white border rounded-xl p-5 flex flex-col lg:flex-row gap-5 lg:items-center justify-between"
          >
            <div>
              <p className="font-bold">
                {registration.name}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {getEvent(registration.eventId)?.title}
              </p>

              <div className="flex flex-wrap gap-4 text-sm mt-3">
                <span>
                  Amount:{" "}
                  <strong>৳{registration.amount}</strong>
                </span>

                <span>
                  Transaction:{" "}
                  <strong>
                    {registration.transactionId}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <PaymentBadge status={registration.payment} />

              <button
                onClick={() =>
                  updatePayment(registration.id, "Verified")
                }
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
              >
                Verify
              </button>

              <button
                onClick={() =>
                  updatePayment(registration.id, "Rejected")
                }
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderParticipants = () => (
    <section>
      <SectionHeader
        title="Participant Management"
        description="Manage attendance and export participant data."
        buttonText="Export CSV"
        onButton={exportParticipants}
      />

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-left min-w-[850px]">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              <th className="p-4">Participant</th>
              <th className="p-4">Event</th>
              <th className="p-4">Ticket</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {registrations.map((registration) => (
              <tr
                key={registration.id}
                className="border-t"
              >
                <td className="p-4">
                  <p className="font-semibold">
                    {registration.name}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {registration.studentId}
                  </p>
                </td>

                <td className="p-4">
                  {getEvent(registration.eventId)?.title}
                </td>

                <td className="p-4">
                  {registration.ticketId}
                </td>

                <td className="p-4">
                  <PaymentBadge status={registration.payment} />
                </td>

                <td className="p-4">
                  {registration.checkedIn ? (
                    <span className="text-green-600 font-semibold">
                      Checked In
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Not Checked In
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <button
                    disabled={
                      registration.payment !== "Verified"
                    }
                    onClick={() =>
                      toggleCheckIn(registration.id)
                    }
                    className={`px-4 py-2 rounded-lg font-medium ${
                      registration.payment !== "Verified"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : registration.checkedIn
                        ? "bg-orange-50 text-orange-600"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    {registration.checkedIn
                      ? "Undo"
                      : "Check In"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderAnalytics = () => (
    <section>
      <SectionHeader
        title="Event Analytics"
        description="Monitor registrations, occupancy and revenue."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        <StatCard
          label="TOTAL REGISTRATIONS"
          value={registrations.length}
          description="All-time registrations"
        />

        <StatCard
          label="VERIFIED REVENUE"
          value={`৳${totalRevenue}`}
          description="Approved payments"
          accent="text-green-600"
        />

        <StatCard
          label="CHECK-IN RATE"
          value={
            registrations.length
              ? `${Math.round(
                  (checkedInCount /
                    registrations.length) *
                    100
                )}%`
              : "0%"
          }
          description="Overall attendance"
          accent="text-purple-600"
        />
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-bold text-xl mb-6">
          Event Performance
        </h3>

        <div className="space-y-7">
          {analytics.map((event) => (
            <div key={event.id}>
              <div className="flex justify-between gap-5 mb-2">
                <div>
                  <p className="font-semibold">
                    {event.title}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {event.registrations} registrations •{" "}
                    {event.verified} verified • ৳
                    {event.revenue} revenue
                  </p>
                </div>

                <p className="font-bold">
                  {Math.round(event.percentage)}%
                </p>
              </div>

              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{
                    width: `${event.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderCheckIn = () => (
    <section>
      <SectionHeader
        title="Smart Ticket Check-in"
        description="Search by Ticket ID or Student ID and instantly verify participants."
      />

      <div className="bg-gradient-to-r from-gray-900 to-indigo-950 rounded-2xl p-8 text-white">
        <p className="text-indigo-200 font-medium">
          PREMIUM CHECK-IN
        </p>

        <h3 className="text-2xl font-bold mt-2">
          Verify Event Ticket
        </h3>

        <p className="text-gray-300 mt-2 max-w-xl">
          Enter a ticket ID such as PL-102 or a student ID.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-2xl">
          <input
            value={ticketSearch}
            onChange={(e) =>
              setTicketSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTicketSearch();
              }
            }}
            placeholder="Ticket ID / Student ID"
            className="flex-1 bg-white text-gray-900 rounded-lg px-4 py-3 outline-none"
          />

          <button
            onClick={handleTicketSearch}
            className="bg-indigo-500 hover:bg-indigo-400 px-6 py-3 rounded-lg font-semibold"
          >
            Verify Ticket
          </button>
        </div>
      </div>

      {searchResult === "not-found" && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
          No valid participant was found for this ticket.
        </div>
      )}

      {searchResult &&
        searchResult !== "not-found" && (
          <div className="mt-6 bg-white border rounded-xl p-6">
            <div className="flex flex-col lg:flex-row gap-5 justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  PARTICIPANT
                </p>

                <h3 className="text-2xl font-bold mt-1">
                  {searchResult.name}
                </h3>

                <p className="text-gray-500 mt-1">
                  {searchResult.studentId}
                </p>

                <p className="mt-4">
                  <strong>Event:</strong>{" "}
                  {getEvent(searchResult.eventId)?.title}
                </p>

                <p className="mt-1">
                  <strong>Ticket:</strong>{" "}
                  {searchResult.ticketId}
                </p>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-3">
                <PaymentBadge
                  status={searchResult.payment}
                />

                {searchResult.checkedIn && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Already Checked In
                  </span>
                )}

                <button
                  disabled={
                    searchResult.payment !== "Verified"
                  }
                  onClick={() => {
                    toggleCheckIn(searchResult.id);

                    setSearchResult((previous) => ({
                      ...previous,
                      checkedIn: !previous.checkedIn,
                    }));
                  }}
                  className={`px-5 py-3 rounded-lg font-semibold ${
                    searchResult.payment !== "Verified"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {searchResult.checkedIn
                    ? "Undo Check-in"
                    : "Confirm Check-in"}
                </button>
              </div>
            </div>
          </div>
        )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">
              PL
            </div>

            <div>
              <h1 className="font-bold text-xl">
                Peer-Learn Club Portal
              </h1>

              <p className="text-gray-500 text-sm">
                Club Event Management
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              Club Lead
            </p>

            <p className="text-gray-500 text-sm">
              Computer Club
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {message && (
          <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl">
            {message}
          </div>
        )}

        <nav className="bg-white border rounded-xl p-2 flex gap-2 overflow-x-auto mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-3 rounded-lg font-medium transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "Overview" &&
          renderOverview()}

        {activeTab === "Event Calendar" && (
  <EventCalendar
    events={events}
    onCreateEvent={() =>
      setActiveTab("Create Event")
    }
  />
)} 

        {activeTab === "Create Event" &&
          renderCreateEvent()}

        {activeTab === "Manage Events" &&
          renderManageEvents()}

        {activeTab === "Registrations" &&
          renderRegistrations()}

        {activeTab === "Payments" &&
          renderPayments()}

        {activeTab === "Participants" &&
          renderParticipants()}

        {activeTab === "Analytics" &&
          renderAnalytics()}

        {activeTab === "QR Check-in" &&
          renderCheckIn()}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  accent = "text-indigo-600",
}) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <p className={`text-sm font-semibold ${accent}`}>
        {label}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>

      <p className="text-gray-500 text-sm mt-2">
        {description}
      </p>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="block font-semibold text-sm mb-2">
        {label}
      </span>

      {children}
    </label>
  );
}

function SectionHeader({
  title,
  description,
  buttonText,
  onButton,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <p className="text-gray-500 mt-1">
          {description}
        </p>
      </div>

      {buttonText && (
        <button
          onClick={onButton}
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        status === "Published"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const classes =
    status === "Verified"
      ? "bg-green-100 text-green-700"
      : status === "Rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${classes}`}
    >
      {status}
    </span>
  );
}

function EmptyState({ text }) {
  return (
    <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
      {text}
    </div>
  );
}

function EventTable({
  events,
  registrations,
  onManage,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[750px]">
        <thead className="bg-gray-50 text-gray-500 text-sm">
          <tr>
            <th className="px-6 py-4">Event</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">
              Registrations
            </th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event) => {
            const total = registrations.filter(
              (registration) =>
                registration.eventId === event.id
            ).length;

            return (
              <tr
                key={event.id}
                className="border-t"
              >
                <td className="px-6 py-4 font-semibold">
                  {event.title}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {event.date}
                </td>

                <td className="px-6 py-4">
                  {total} / {event.capacity}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={event.status} />
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={onManage}
                    className="text-indigo-600 font-semibold"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ClubLeadDashboard;