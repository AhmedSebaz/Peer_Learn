import React, { useMemo, useState } from "react";

function EventCalendar({ events = [], onCreateEvent }) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    formatDateKey(today)
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    return createCalendarDays(year, month);
  }, [year, month]);

  const monthEvents = events.filter((event) => {
    const eventDate = parseDate(event.date);

    return (
      eventDate.getFullYear() === year &&
      eventDate.getMonth() === month
    );
  });

  const selectedEvents = events.filter(
    (event) => event.date === selectedDate
  );

  const publishedCount = monthEvents.filter(
    (event) => event.status === "Published"
  ).length;

  const draftCount = monthEvents.filter(
    (event) => event.status === "Draft"
  ).length;

  const goPreviousMonth = () => {
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );
  };

  const goNextMonth = () => {
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );
  };

  const goToday = () => {
    const now = new Date();

    setCurrentMonth(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );

    setSelectedDate(formatDateKey(now));
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white p-7 shadow-lg">

        <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full" />
        <div className="absolute right-24 -bottom-24 w-48 h-48 bg-white/10 rounded-full" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div>
            <p className="text-indigo-100 text-sm font-semibold tracking-wide">
              EVENT SCHEDULING CENTER
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Event Calendar
            </h2>

            <p className="text-indigo-100 mt-2 max-w-2xl">
              View all club events by date, monitor schedules
              and manage upcoming activities from one calendar.
            </p>
          </div>

          <button
            onClick={onCreateEvent}
            className="self-start lg:self-auto bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition shadow"
          >
            + Create Event
          </button>

        </div>

      </section>


      {/* MONTH STATISTICS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <CalendarStat
          label="THIS MONTH"
          value={monthEvents.length}
          description="Scheduled events"
        />

        <CalendarStat
          label="PUBLISHED"
          value={publishedCount}
          description="Live events"
          color="text-green-600"
        />

        <CalendarStat
          label="DRAFT"
          value={draftCount}
          description="Not published"
          color="text-amber-600"
        />

        <CalendarStat
          label="SELECTED DATE"
          value={selectedEvents.length}
          description="Events scheduled"
          color="text-purple-600"
        />

      </section>


      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* CALENDAR */}
        <section className="xl:col-span-2 bg-white border rounded-2xl overflow-hidden shadow-sm">

          {/* CALENDAR TOP */}
          <div className="p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

              <p className="text-sm font-medium text-gray-500">
                MONTHLY SCHEDULE
              </p>

              <h3 className="text-2xl font-bold mt-1">
                {monthName}
              </h3>

            </div>

            <div className="flex gap-2">

              <button
                onClick={goToday}
                className="border px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Today
              </button>

              <button
                onClick={goPreviousMonth}
                className="w-10 h-10 border rounded-lg hover:bg-gray-50 text-xl"
              >
                ‹
              </button>

              <button
                onClick={goNextMonth}
                className="w-10 h-10 border rounded-lg hover:bg-gray-50 text-xl"
              >
                ›
              </button>

            </div>

          </div>


          {/* WEEK DAYS */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">

            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (

              <div
                key={day}
                className="py-3 text-center text-xs sm:text-sm font-semibold text-gray-500"
              >
                {day}
              </div>

            ))}

          </div>


          {/* DAYS */}
          <div className="grid grid-cols-7">

            {calendarDays.map((day, index) => {

              const dateKey = formatDateKey(day.date);

              const dayEvents = events.filter(
                (event) => event.date === dateKey
              );

              const isCurrentMonth =
                day.date.getMonth() === month;

              const isSelected =
                selectedDate === dateKey;

              const isToday =
                formatDateKey(today) === dateKey;

              return (

                <button
                  key={index}
                  onClick={() =>
                    setSelectedDate(dateKey)
                  }
                  className={`
                    relative min-h-[95px] sm:min-h-[125px]
                    border-r border-b p-2 sm:p-3
                    text-left align-top
                    transition
                    ${
                      !isCurrentMonth
                        ? "bg-gray-50/70 text-gray-300"
                        : "bg-white"
                    }
                    ${
                      isSelected
                        ? "ring-2 ring-inset ring-indigo-500 bg-indigo-50/30"
                        : "hover:bg-gray-50"
                    }
                  `}
                >

                  <div className="flex justify-between items-start">

                    <span
                      className={`
                        w-8 h-8
                        flex items-center justify-center
                        rounded-full
                        text-sm font-semibold
                        ${
                          isToday
                            ? "bg-indigo-600 text-white"
                            : ""
                        }
                      `}
                    >
                      {day.date.getDate()}
                    </span>

                    {dayEvents.length > 0 && (

                      <span className="text-[10px] sm:text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">
                        {dayEvents.length}
                      </span>

                    )}

                  </div>


                  {/* EVENTS ON DAY */}
                  <div className="mt-2 space-y-1 hidden sm:block">

                    {dayEvents
                      .slice(0, 2)
                      .map((event) => (

                        <div
                          key={event.id}
                          className={`
                            truncate text-xs
                            px-2 py-1.5
                            rounded-md
                            font-medium
                            ${
                              event.status === "Published"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-amber-100 text-amber-700"
                            }
                          `}
                        >
                          {event.time} {event.title}
                        </div>

                      ))}

                    {dayEvents.length > 2 && (

                      <p className="text-[11px] text-gray-500 pl-1 font-medium">
                        +{dayEvents.length - 2} more
                      </p>

                    )}

                  </div>


                  {/* MOBILE EVENT MARK */}
                  {dayEvents.length > 0 && (

                    <div className="sm:hidden flex gap-1 mt-2">

                      {dayEvents
                        .slice(0, 3)
                        .map((event) => (

                          <span
                            key={event.id}
                            className={`
                              w-2 h-2 rounded-full
                              ${
                                event.status === "Published"
                                  ? "bg-indigo-500"
                                  : "bg-amber-500"
                              }
                            `}
                          />

                        ))}

                    </div>

                  )}

                </button>

              );
            })}

          </div>


          {/* LEGEND */}
          <div className="p-4 border-t bg-gray-50 flex flex-wrap gap-5 text-sm">

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              Published Event
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              Draft Event
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
              Today
            </div>

          </div>

        </section>


        {/* SELECTED DATE PANEL */}
        <aside className="bg-white border rounded-2xl shadow-sm overflow-hidden self-start">

          <div className="p-6 border-b">

            <p className="text-xs text-indigo-600 font-bold tracking-wide">
              SELECTED DATE
            </p>

            <h3 className="text-xl font-bold mt-2">
              {formatDisplayDate(selectedDate)}
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              {selectedEvents.length === 0
                ? "No events scheduled"
                : `${selectedEvents.length} event${
                    selectedEvents.length > 1 ? "s" : ""
                  } scheduled`}
            </p>

          </div>


          <div className="p-5">

            {selectedEvents.length === 0 ? (

              <div className="text-center py-12">

                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
                  📅
                </div>

                <h4 className="font-bold mt-4">
                  Free Day
                </h4>

                <p className="text-gray-500 text-sm mt-2">
                  There are currently no events scheduled
                  for this date.
                </p>

                <button
                  onClick={onCreateEvent}
                  className="mt-5 text-indigo-600 font-semibold"
                >
                  + Schedule Event
                </button>

              </div>

            ) : (

              <div className="space-y-4">

                {selectedEvents.map((event) => (

                  <div
                    key={event.id}
                    className="border rounded-xl p-4 hover:border-indigo-300 transition"
                  >

                    <div className="flex justify-between gap-3 items-start">

                      <h4 className="font-bold leading-snug">
                        {event.title}
                      </h4>

                      <span
                        className={`
                          whitespace-nowrap
                          text-[11px]
                          font-semibold
                          px-2.5 py-1
                          rounded-full
                          ${
                            event.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        `}
                      >
                        {event.status}
                      </span>

                    </div>


                    <div className="space-y-2 mt-4 text-sm text-gray-600">

                      <p>
                        🕐{" "}
                        <span className="font-medium">
                          {formatTime(event.time)}
                        </span>
                      </p>

                      <p>
                        📍{" "}
                        <span className="font-medium">
                          {event.venue}
                        </span>
                      </p>

                      <p>
                        👥{" "}
                        <span className="font-medium">
                          Capacity: {event.capacity}
                        </span>
                      </p>

                      <p>
                        💳{" "}
                        <span className="font-medium">
                          {Number(event.fee) === 0
                            ? "Free Event"
                            : `৳${event.fee}`}
                        </span>
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </aside>

      </div>

    </div>
  );
}


function CalendarStat({
  label,
  value,
  description,
  color = "text-indigo-600",
}) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">

      <p
        className={`text-xs font-bold tracking-wide ${color}`}
      >
        {label}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>

    </div>
  );
}


function createCalendarDays(year, month) {
  const firstDay =
    new Date(year, month, 1).getDay();

  const startDate =
    new Date(year, month, 1 - firstDay);

  const days = [];

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);

    date.setDate(
      startDate.getDate() + i
    );

    days.push({
      date,
    });
  }

  return days;
}


function parseDate(dateString) {
  const [year, month, day] =
    dateString.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day
  );
}


function formatDateKey(date) {
  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1).padStart(2, "0");

  const day =
    String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function formatDisplayDate(dateString) {
  const date =
    parseDate(dateString);

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}


function formatTime(time) {
  if (!time) return "Time not set";

  const [hour, minute] =
    time.split(":").map(Number);

  const date = new Date();

  date.setHours(
    hour,
    minute,
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}


export default EventCalendar;