import { MapPinHouse } from 'lucide-react';

function Logo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-20">
        <MapPinHouse size={20} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col leading-none">
        <h1 className="text-xl font-extrabold tracking-tighter text-gray-900">
          IBDA<span className="text-blue-600">KOST</span>
        </h1>
      </div>
    </div>
  );
}

export default Logo;