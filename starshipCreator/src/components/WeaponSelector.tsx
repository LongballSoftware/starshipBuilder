import React from 'react';
import { components } from '../constants/shipComponents';

interface Weapon {
  name: string;
  mass: number;
  power: number;
  sp: number;
}

interface SelectedComponents {
  bridge: string;
  crewquarters: string | null;
  thrusters: string;
  core: string | null;
  lifesupport: string | null;
  shields: string | null;
  weapons: Record<string, string | null>;
  supplemental: any[];
}

interface WeaponSelectorProps {
  selectedComponents: SelectedComponents;
  handleWeaponChange: (hardpoint: string, weaponKey: string | null) => void;
  hardpoints?: string[]; // List of hardpoint names for this ship
}

const WeaponSelector: React.FC<WeaponSelectorProps> = ({
  selectedComponents,
  handleWeaponChange,
  hardpoints = ['forward', 'port', 'starboard', 'aft']
}) => {
  // Helper function to find weapon by name
  const findWeaponByName = (weaponName: string) => {
    return Object.values(components.weapons).find(weapon => weapon.name === weaponName);
  };

  return (
    <div className="weapon-selector p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Weapon Configuration</h2>
      
      <div className="space-y-4">
        {hardpoints.map((hardpoint) => (
          <div key={hardpoint} className="hardpoint-row">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="hardpoint-info">
                <h3 className="text-lg font-semibold text-gray-200 capitalize">
                  {hardpoint.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h3>
                <p className="text-sm text-gray-400">
                  Current: {selectedComponents.weapons[hardpoint] || 'Empty'}
                </p>
              </div>
              
              <div className="weapon-selector-dropdown">
                <select
                  value={selectedComponents.weapons[hardpoint] || ''}
                  onChange={(e) => handleWeaponChange(hardpoint, e.target.value || null)}
                  className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- No Weapon --</option>
                  {Object.values(components.weapons).map((weapon) => (
                    <option key={weapon.name} value={weapon.name}>
                      {weapon.name} (Mass: {weapon.mass}, Power: {weapon.power}, SP: {weapon.sp})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Show weapon details if one is selected */}
            {selectedComponents.weapons[hardpoint] && (
              <div className="weapon-details mt-2 p-3 bg-gray-750 bg-opacity-50 rounded-md border-l-4 border-blue-500">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Mass:</span>
                    <span className="ml-2 text-white">
                      {findWeaponByName(selectedComponents.weapons[hardpoint]!)?.mass || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Power:</span>
                    <span className="ml-2 text-white">
                      {findWeaponByName(selectedComponents.weapons[hardpoint]!)?.power || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">SP Cost:</span>
                    <span className="ml-2 text-white">
                      {findWeaponByName(selectedComponents.weapons[hardpoint]!)?.sp || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Summary section */}
      <div className="weapon-summary mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-2 text-blue-400">Weapon Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Object.values(selectedComponents.weapons).filter(weapon => weapon !== null).length}
            </div>
            <div className="text-sm text-gray-400">Weapons Equipped</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Object.values(selectedComponents.weapons)
                .filter(weapon => weapon !== null)
                .reduce((total, weaponName) => {
                  const weapon = findWeaponByName(weaponName!);
                  return total + (weapon?.mass || 0);
                }, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Mass</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Object.values(selectedComponents.weapons)
                .filter(weapon => weapon !== null)
                .reduce((total, weaponName) => {
                  const weapon = findWeaponByName(weaponName!);
                  return total + (weapon?.power || 0);
                }, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Power</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeaponSelector;