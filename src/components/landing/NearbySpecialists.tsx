import DoctorClinicCard from "@/components/common/DoctorClinicCard";
import { MapPin, User, ChevronRight } from "lucide-react";

const clinicsData = [
  {
    title: "City Medical Center",
    subtitle: "Multi-specialty Hospital",
    metaText: "2.3 km away",
    rating: "4.8/5",
    actionText: "Book Now",
  },
  {
    title: "Respiratory Care Clinic",
    subtitle: "Pulmonary Specialists",
    metaText: "3.1 km away",
    rating: "4.9/5",
    actionText: "Book Now",
  },
];

const doctorsData = [
  {
    title: "Dr. Sarah Johnson",
    subtitle: "Pulmonologist",
    metaText: "15 years exp",
    rating: "4.9",
  },
  {
    title: "Dr. Michael Chen",
    subtitle: "Respiratory Specialist",
    metaText: "12 years exp",
    rating: "4.8",
  },
  {
    title: "Dr. Emily Williams",
    subtitle: "Pulmonologist",
    metaText: "18 years exp",
    rating: "4.9",
  },
];

export default function NearbySpecialists() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50/60 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
       
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/10">
              <MapPin className="h-3.5 w-3.5" />
              <span>Near You</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Nearby Clinics & Specialists
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Find trusted healthcare providers near you
            </p>
          </div>

          <a
            href="#view-all"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

       
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
          {clinicsData.map((clinic, index) => (
            <DoctorClinicCard
              key={index}
              icon={<MapPin className="h-5 w-5" />}
              title={clinic.title}
              subtitle={clinic.subtitle}
              metaText={clinic.metaText}
              rating={clinic.rating}
              actionText={clinic.actionText}
            />
          ))}
        </div>

       
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {doctorsData.map((doc, index) => (
            <DoctorClinicCard
              key={index}
              icon={<User className="h-5 w-5" />}
              title={doc.title}
              subtitle={doc.subtitle}
              metaText={doc.metaText}
              rating={doc.rating}
            />
          ))}
        </div>

      </div>
    </section>
  );
}