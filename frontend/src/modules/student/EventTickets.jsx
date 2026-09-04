import React, { useState, useEffect } from 'react';
import { Award, Calendar, MapPin, CheckCircle, Ticket, X, CreditCard, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { getEvents, processEventPayment } from './studentService';

const EventTickets = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState({});

  // Payment Modal States
  const [selectedEventForPay, setSelectedEventForPay] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data || []);
  };

  // PDF Ticket Generator Function
  const downloadPDFTicket = (evt) => {
    const userName = user?.name || "MD Istiack";
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 30px; font-family: Arial, sans-serif; border: 2px dashed #4F46E5; border-radius: 12px; max-width: 500px; margin: auto; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4F46E5; margin: 0; font-size: 22px;">CampusConnect Ticket</h2>
          <p style="color: #6B7280; font-size: 12px; margin-top: 4px;">Official Student Entry Pass</p>
        </div>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 15px 0;" />
        <div>
          <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 18px;">${evt.title}</h3>
          <p style="margin: 6px 0; font-size: 14px; color: #374151;"><b>Attendee:</b> ${userName}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #374151;"><b>Date:</b> ${evt.date}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #374151;"><b>Venue:</b> ${evt.location}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #374151;"><b>Ticket Fee:</b> ${evt.fee === 0 ? 'FREE' : '$' + evt.fee}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #059669;"><b>Status:</b> Confirmed & Registered</p>
        </div>
        <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px dashed #E5E7EB;">
          <p style="font-size: 10px; color: #9CA3AF; margin: 0;">Ticket ID: CC-EVT-${evt.id}-${Date.now().toString().slice(-4)}</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `Ticket_${evt.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a5', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Trigger when clicking Get Ticket
  const handleTicketClick = async (evt) => {
    const userId = user?.id || user?.user_id || 1;

    if (evt.fee === 0) {
      const response = await processEventPayment(evt.id, userId, "FREE", { paymentMethod: "FREE" });
      if (response && response.success) {
        setRegisteredEvents((prev) => ({ ...prev, [evt.id]: true }));
        alert(`Free registration successful for "${evt.title}"! You can now download your ticket.`);
      } else {
        alert(response?.message || "Registration failed. Please try again.");
      }
    } else {
      setSelectedEventForPay(evt);
      setAccountNumber('');
    }
  };

  // Submit payment modal form
  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!accountNumber) {
      alert('Please enter your account / card number!');
      return;
    }

    const userId = user?.id || user?.user_id || 1;
    const response = await processEventPayment(
      selectedEventForPay.id, 
      userId, 
      "PAID", 
      { paymentMethod: paymentMethod.toUpperCase(), transactionId: accountNumber }
    );
    
    if (response && response.success) {
      setRegisteredEvents((prev) => ({ ...prev, [selectedEventForPay.id]: true }));
      alert(`Payment of $${selectedEventForPay.fee} via ${paymentMethod.toUpperCase()} successful!\nTicket confirmed for "${selectedEventForPay.title}".`);
      setSelectedEventForPay(null);
    } else {
      alert(response?.message || "Payment processing failed. Please try again.");
    }
  };

  const filteredEvents = events.filter((evt) =>
    evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evt.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Award className="w-6 h-6 text-indigo-600" />
            <span>Campus Events & Workshops</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Discover upcoming hackathons, seminars, and tech fests. Grab your tickets early!
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search events or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const isRegistered = registeredEvents[evt.id];
          return (
            <div key={evt.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                    evt.fee === 0 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  }`}>
                    {evt.fee === 0 ? 'FREE' : `$${evt.fee}`}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{evt.date}</span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mt-3">{evt.title}</h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{evt.description}</p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-600 space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{evt.location}</span>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                {isRegistered ? (
                  <button
                    onClick={() => downloadPDFTicket(evt)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Ticket</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleTicketClick(evt)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>{evt.fee === 0 ? 'Register Free' : `Buy Ticket ($${evt.fee})`}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {selectedEventForPay && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setSelectedEventForPay(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-indigo-600 font-bold mb-1">
              <CreditCard className="w-5 h-5" />
              <span>Checkout / Payment</span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900">{selectedEventForPay.title}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Total Payable Amount: <span className="text-indigo-600 font-bold text-sm">${selectedEventForPay.fee}</span>
            </p>

            <form onSubmit={handleConfirmPayment} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">Select Payment Gateway</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bkash', name: 'bKash', color: 'border-pink-500 text-pink-600 bg-pink-50' },
                    { id: 'nagad', name: 'Nagad', color: 'border-orange-500 text-orange-600 bg-orange-50' },
                    { id: 'card', name: 'Card', color: 'border-blue-500 text-blue-600 bg-blue-50' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                        paymentMethod === m.id ? m.color : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {paymentMethod === 'card' ? 'Card Number' : `${paymentMethod.toUpperCase()} Account Number`}
                </label>
                <input
                  type="text"
                  placeholder={paymentMethod === 'card' ? '4111 2222 3333 4444' : '017XXXXXXXX'}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2 shadow"
              >
                Pay ${selectedEventForPay.fee} & Confirm Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTickets;