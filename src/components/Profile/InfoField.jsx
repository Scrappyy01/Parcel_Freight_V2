export default function InfoField({ icon, label, value }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-500 block mb-1">{label}</label>
      <div className="flex items-center text-gray-900">
        <div className="w-5 h-5 text-gray-400 mr-2">
          {icon}
        </div>
        <span className="text-base">{value || 'Not provided'}</span>
      </div>
    </div>
  );
}
