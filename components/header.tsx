import { Calendar, MapPin } from "lucide-react";

export function Header() {
  return (
    <header className="bg-orange-600 text-white py-4 md:py-6 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
              IBOM Tech Week 2025
            </h1>
            <p className="text-orange-100 text-xs md:text-sm mt-1">
              Register for Africa's Premier Tech Event
            </p>
          </div>
          <div className="flex flex-col sm:text-right text-xs md:text-sm space-y-1">
            <div className="flex items-center gap-1 sm:justify-end">
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-orange-100">Nov 3-8, 2025</span>
            </div>
            <div className="flex items-center gap-1 sm:justify-end">
              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-orange-100">Ceedapeg Hotels, Uyo</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
