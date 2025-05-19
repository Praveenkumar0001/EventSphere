import { useState } from "react";
import { ChevronDown, Search, Info, Users, Calendar, Ticket, CreditCard, HelpCircle, AlertCircle } from "lucide-react";

export default function EnhancedFAQAccordion() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const faqs = [
    {
      id: "item-1",
      icon: <Info className="text-blue-500" />,
      question: "What is the Event Management System?",
      answer: "Our Event Management System is a comprehensive platform that connects event organizers, attendees, and service providers. It allows users to purchase tickets for events, provides clients with tools to list and manage their events, and enables vendors to participate in tender filing for event services. The entire system is monitored and managed by administrators to ensure smooth operations."
    },
    {
      id: "item-2",
      icon: <Users className="text-purple-500" />,
      question: "What types of users can access the system?",
      answer: [
        "Our platform supports four types of users:",
        {
          list: [
            { bold: "Users:", text: "Individuals who browse events and purchase tickets" },
            { bold: "Clients:", text: "Event organizers who create and list events on the platform" },
            { bold: "Vendors:", text: "Service providers who can file tenders for event services" },
            { bold: "Administrators:", text: "Internal team members who manage and monitor the platform" }
          ]
        },
        "Each user type has a dedicated registration process and dashboard tailored to their specific needs."
      ]
    },
    {
      id: "item-3",
      icon: <Ticket className="text-green-500" />,
      question: "How do I purchase tickets for an event?",
      answer: [
        "Purchasing tickets is simple:",
        {
          numbered: [
            "Browse available events or use our search and filter options to find events by category or location",
            "Select the event you're interested in to view details",
            "Choose the number of tickets you wish to purchase",
            "Proceed to checkout where you'll be directed to our secure payment gateway (Razorpay)",
            "Complete your payment",
            "Receive a confirmation and your tickets via email"
          ]
        },
        "Our system ensures secure transactions and immediate ticket delivery after successful payment."
      ]
    },
    {
      id: "item-4",
      icon: <Calendar className="text-amber-500" />,
      question: "I'm an event organizer. How do I list my event?",
      answer: [
        "To list your event as a client:",
        {
          numbered: [
            "Register or log in to your client account",
            "Navigate to your dashboard and select \"Create New Event\"",
            {
              text: "Fill in the required details including:",
              sublist: [
                "Event Name",
                "Date and Time",
                "Venue",
                "Location",
                "Description",
                "Event Thumbnail",
                "Ticket cost"
              ]
            },
            "Review and publish your event"
          ]
        },
        "Once published, your event will be visible to all users browsing the platform."
      ]
    },
    {
      id: "item-5",
      icon: <Search className="text-indigo-500" />,
      question: "How can I search for specific events?",
      answer: [
        "Our platform offers comprehensive search and filter options:",
        {
          list: [
            "Use the search bar to find events by name or keywords",
            "Filter events by category to find specific types of events",
            "Filter by location to find events near you",
            "Sort results by date, popularity, or price"
          ]
        },
        "These tools help you quickly find events that match your interests and preferences."
      ]
    },
    {
      id: "item-6",
      icon: <CreditCard className="text-pink-500" />,
      question: "Can I use the platform on my mobile device?",
      answer: [
        "Yes, our Event Management System is fully responsive and designed to work seamlessly across all devices:",
        {
          list: [
            "Access the platform through any modern web browser (Chrome, Firefox, Safari, Edge)",
            "Enjoy a responsive design that adapts to your screen size",
            "Perform all functions including browsing events, purchasing tickets, and managing accounts on mobile",
            "Experience fast loading times and smooth navigation on all devices"
          ]
        },
        "Whether you're using a desktop, tablet, or smartphone, you'll have full access to all platform features."
      ]
    },
    {
      id: "item-7",
      icon: <HelpCircle className="text-red-500" />,
      question: "How do I recover my password if I forget it?",
      answer: [
        "Password recovery is simple:",
        {
          numbered: [
            "Click on the \"Forgot Password\" link on the login page",
            "Enter the email address associated with your account",
            "Check your email for a password reset link",
            "Click the link and follow the instructions to create a new password",
            "Use your new password to log in"
          ]
        },
        "For security reasons, password reset links expire after a short period. If you don't reset your password in time, you'll need to request a new link."
      ]
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleAccordion = (id) => {
    setIsAnimating(true);
    setActiveItem(activeItem === id ? null : id);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const renderAnswerContent = (answer) => {
    if (typeof answer === 'string') {
      return <p className="leading-relaxed">{answer}</p>;
    }

    return (
      <>
        {answer.map((item, index) => {
          if (typeof item === 'string') {
            return <p key={index} className="mb-3 leading-relaxed">{item}</p>;
          } else if (item.list) {
            return (
              <ul key={index} className="list-disc pl-5 mt-3 mb-4 space-y-2">
                {item.list.map((listItem, listIndex) => (
                  <li key={listIndex} className="leading-relaxed">
                    {listItem.bold ? (
                      <>
                        <strong className="text-blue-700">{listItem.bold}</strong> {listItem.text}
                      </>
                    ) : (
                      listItem
                    )}
                  </li>
                ))}
              </ul>
            );
          } else if (item.numbered) {
            return (
              <ol key={index} className="list-decimal pl-5 mt-3 mb-4 space-y-3">
                {item.numbered.map((listItem, listIndex) => (
                  <li key={listIndex} className="pl-2 leading-relaxed">
                    {typeof listItem === 'string' ? (
                      listItem
                    ) : (
                      <>
                        <span className="font-medium">{listItem.text}</span>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                          {listItem.sublist.map((subItem, subIndex) => (
                            <li key={subIndex} className="leading-relaxed">{subItem}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            );
          }
          return null;
        })}
      </>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-lg p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-tight">Frequently Asked Questions</h2>
        
        <div className="relative mb-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-300" />
          </div>
          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-200 border-none focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-b-lg shadow-xl p-6 border border-gray-100">
        {filteredFaqs.length > 0 ? (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div 
                key={faq.id}
                className={`border-b border-gray-200 last:border-none transition-all duration-300 ease-in-out ${activeItem === faq.id ? 'bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg my-2' : 'hover:bg-gray-50'}`}
              >
                <button
                  className="flex justify-between items-center w-full py-5 px-4 text-left focus:outline-none group"
                  onClick={() => toggleAccordion(faq.id)}
                  disabled={isAnimating}
                >
                  <div className="flex items-center">
                    <div className={`mr-4 p-3 rounded-full ${activeItem === faq.id ? 'bg-white shadow-md' : 'bg-gray-100 group-hover:bg-gray-200'} transition-all duration-200`}>
                      {faq.icon}
                    </div>
                    <h3 className={`text-lg font-medium ${activeItem === faq.id ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600'} transition-colors duration-200`}>
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 ${activeItem === faq.id ? 'text-blue-600' : 'text-gray-500'} transition-transform duration-300 ${activeItem === faq.id ? 'transform rotate-180' : ''}`} 
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    activeItem === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="py-4 px-4 pl-16 text-gray-600 bg-white rounded-b-lg">
                    {renderAnswerContent(faq.answer)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="h-16 w-16 text-gray-400 mb-4 animate-pulse" />
            <p className="text-gray-500 text-xl">No FAQs match your search</p>
            <button 
              className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
      
      <div className="text-center mt-8 text-gray-600">
        <p>Can't find what you're looking for? <a href="#" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200">Contact Support</a></p>
      </div>
    </div>
  );
}