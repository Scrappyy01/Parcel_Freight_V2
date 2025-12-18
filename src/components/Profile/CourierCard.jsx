import ToggleSwitch from './ToggleSwitch';

export default function CourierCard({ logo, name, description, enabled, onToggle, logoClass = "w-14 h-14" }) {
  return (
    <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF7D44] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
          <img src={logo} alt={name} className={logoClass} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <ToggleSwitch enabled={enabled} onToggle={onToggle} />
    </div>
  );
}
