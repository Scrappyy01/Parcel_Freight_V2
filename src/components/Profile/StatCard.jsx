export default function StatCard({ icon, label, value, colorClass = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-[#FF7D44]"
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className={`w-12 h-12 ${colorClasses[colorClass]} rounded-full flex items-center justify-center mx-auto mb-3`}>
        {icon}
      </div>
      <h4 className="text-sm font-medium text-gray-500">{label}</h4>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
