export default function InfoSection({ title, icon, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
        <div className="w-6 h-6 text-[#FF7D44] mr-3">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
