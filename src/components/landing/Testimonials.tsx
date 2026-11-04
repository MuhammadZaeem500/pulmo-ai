import TestimonialCard from "@/components/common/TestimonialCard";
import { Star } from "lucide-react";

const testimonialsData = [
  {
    quote: "The AI chatbot helped me understand my breathing symptoms instantly. Got connected with a pulmonologist within hours!",
    name: "John Smith",
    role: "Asthma Patient",
    avatarInitial: "J",
  },
  {
    quote: "Managing my respiratory medications and tracking my breathing patterns has never been easier. This platform is a game-changer.",
    name: "Lisa Anderson",
    role: "COPD Patient",
    avatarInitial: "L",
  },
  {
    quote: "Found the perfect pulmonary specialist near me and booked an appointment in seconds. Highly recommend!",
    name: "David Brown",
    role: "Regular User",
    avatarInitial: "D",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50/50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
       
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/10">
            <Star className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
            <span>Testimonials</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Loved by Thousands
          </h2>

          <p className="mt-4 text-base text-slate-600">
            See what our pulmonary patients have to say about PulmoAI
          </p>
        </div>

       
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonialsData.map((item, index) => (
            <TestimonialCard
              key={index}
              quote={item.quote}
              name={item.name}
              role={item.role}
              avatarInitial={item.avatarInitial}
            />
          ))}
        </div>

      </div>
    </section>
  );
}