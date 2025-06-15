import { useState, useEffect } from 'react';
import { Rocket, Zap, Weight, Shield, Cpu, Wrench, Crosshair } from 'lucide-react';
import './starshipBuilder.css'; // Import the CSS file
import ShipComponentSelector from './components/ShipComponentselector';
import { hulls, components } from './constants/shipComponents';
import WeaponSelector from './components/WeaponSelector';

const StarshipBuilder = () => {


  type SelectedComponents = {
  bridge: string;
  crewquarters: string | null;
  thrusters: string;
  core: string | null;
  lifesupport: string | null;
  shields: string | null;
  weapons: Record<string, string | null>;
  supplemental: any[];
};
  

  // State
  const [selectedHull, setSelectedHull] = useState('frigate');
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({
    bridge: 'standard',
    crewquarters: selectedHull === 'fighter' ? null : 'standard',
    thrusters: 'standard',
    core: selectedHull === 'fighter' ? null : 'mk1',
    lifesupport: selectedHull === 'fighter' ? null : 'standard',
    shields: selectedHull === 'fighter' ? null : 'kinetic',
    weapons: selectedHull === 'fighter' ? {"forward": null} : 
      selectedHull === 'frigate' ? {"forward": null, "port": null, "starboard": null} : selectedHull === 'cruiser' ?
      {"forward": null, "port 1": null, "port 2": null, "starboard 1": null, "starboard 2": null, "aft": null} :
      {"forward 1": null, "forward 2": null, "port 1": null, "port 2": null, "starboard 1": null, "starboard 2": null, "aft": null},
    supplemental: []
  });

  // Update components when hull changes
  useEffect(() => {
    if (selectedHull === 'fighter') {
      setSelectedComponents(prev => ({
        ...prev,
        bridge: 'fighterCockpit',
        crewquarters: null,
        core: null,
        lifesupport: null,
        shields: null,
        weapons: { "forward": null },
      }));
    } else {
      setSelectedComponents(prev => ({
        ...prev,
        bridge: prev.bridge === 'fighterCockpit' ? 'standard' : prev.bridge,
        crewquarters: prev.crewquarters || 'standard',
        core: prev.core || 'mk1',
        lifesupport: prev.lifesupport || 'standard',
        shields: prev.shields || 'kinetic'
      }));
    }
  }, [selectedHull]);

  // Calculate totals
  const calculateTotals = () => {
    let totalMass = 0;
    let totalPower = 0;
    let totalSP = 0;

    // Hull SP
    totalSP += hulls[selectedHull].sp;

    // Required components
    if (selectedComponents.bridge) {
      const bridge = components.bridges[selectedComponents.bridge as keyof typeof components.bridges];
      totalMass += bridge.mass;
      totalPower += bridge.power;
      totalSP += bridge.sp;
    }

    if (selectedComponents.crewquarters) {
      const quarters = components.crewquarters[selectedComponents.crewquarters as keyof typeof components.crewquarters];
      totalMass += quarters.mass;
      totalPower += quarters.power;
      totalSP += quarters.sp;
    }

    if (selectedComponents.thrusters) {
      const thrusters = components.thrusters[selectedComponents.thrusters as keyof typeof components.thrusters];
      totalMass += thrusters.mass;
      totalPower += thrusters.power;
      totalSP += thrusters.sp;
    }

    if (selectedComponents.core) {
      const core = components.cores[selectedComponents.core as keyof typeof components.cores];
      totalMass += core.mass;
      totalPower += core.power;
      totalSP += core.sp;
    }

    if (selectedComponents.lifesupport) {
      const lifeSupport = components.lifeSupport[selectedComponents.lifesupport as keyof typeof components.lifeSupport];
      totalMass += lifeSupport.mass;
      totalPower += lifeSupport.power;
      totalSP += lifeSupport.sp;
    }

    if (selectedComponents.shields) {
      const shields = components.shields[selectedComponents.shields as keyof typeof components.shields];
      totalMass += shields.mass;
      totalPower += shields.power;
      totalSP += shields.sp;
    }

    // Weapons
    Object.entries(selectedComponents.weapons).forEach(([hardpointName, weaponKey]) => {
      if (!weaponKey) return;
      const weapon = components.weapons[weaponKey.toLowerCase().replace(/\s+/g, '') as keyof typeof components.weapons];
      totalMass += weapon.mass;
      totalPower += weapon.power;
      totalSP += weapon.sp;
    });

    // Supplemental
    selectedComponents.supplemental.forEach(suppKey => {
      const supp = components.supplemental[suppKey];
      totalMass += supp.mass;
      totalPower += supp.power;
      totalSP += supp.sp;
    });

    // Fighter default power
    if (selectedHull === 'fighter') {
      totalPower -= 20;
    }

    return { totalMass, totalPower, totalSP };
  };

  const { totalMass, totalPower, totalSP } = calculateTotals();
  const hull = hulls[selectedHull];
  const overMass = totalMass > hull.maxMass;
  const overPower = totalPower > 0;

  const handleComponentChange = (category, value) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleWeaponChange = (hardpoint: string, weaponKey: string | null) => {
  setSelectedComponents(prev => ({
    ...prev,
    weapons: {
      ...prev.weapons,
      [hardpoint]: weaponKey
    }
  }));
};

  const handleSupplementalToggle = (suppKey) => {
    setSelectedComponents(prev => ({
      ...prev,
      supplemental: prev.supplemental.includes(suppKey)
        ? prev.supplemental.filter(s => s !== suppKey)
        : [...prev.supplemental, suppKey]
    }));
  };

  const getValidSupplemental = () => {
    if (selectedHull === 'fighter' || selectedHull === 'frigate') {
      const { fighterBay, ...otherSupp } = components.supplemental;
      return otherSupp;
    }
    return components.supplemental;
  };

  return (
    <div className="starship-builder">
      <div className="container">
        <div className="header">
          <h1>
            <Rocket className="icon-lg icon-blue" />
            Starship Builder
          </h1>
          <p>For use with Custom 5e Ship Combat Rules</p>
        </div>

        <div className="status-grid">
          {/* Status Panel */}
          <div className="card">
            <h2>
              <Cpu className="icon icon-green" />
              Ship Status
            </h2>
            
            <div>
              <div className="status-item">
                <span className="status-label">
                  <Weight className="icon icon-orange" />
                  Mass:
                </span>
                <span className={`status-value ${overMass ? 'error' : 'success'}`}>
                  {totalMass}/{hull.maxMass}
                </span>
              </div>
              
              <div className="status-item">
                <span className="status-label">
                  <Zap className="icon icon-yellow" />
                  Power:
                </span>
                <span className={`status-value ${overPower ? 'error' : 'success'}`}>
                  {totalPower > 0 ? '+' : ''}{totalPower}
                </span>
              </div>
              
              <div className="status-item">
                <span className="status-label">
                  <Rocket className="icon icon-blue" />
                  Ship Points:
                </span>
                <span className="status-value info">{totalSP}</span>
              </div>

              {(overMass || overPower) && (
                <div className="warning-box">
                  <h3 className="warning-title">Warnings:</h3>
                  {overMass && <p className="warning-text">• Mass exceeds hull limit</p>}
                  {overPower && <p className="warning-text">• Power consumption exceeds generation</p>}
                </div>
              )}
            </div>
          </div>

          {/* Hull Selection */}
          <div className="card">
            <h2>
              <Shield className="icon icon-purple" />
              Hull Selection
            </h2>
            
            <div>
              {Object.entries(hulls).map(([key, hull]) => (
                <div key={key} className="hull-option">
                  <input
                    type="radio"
                    id={key}
                    name="hull"
                    value={key}
                    checked={selectedHull === key}
                    onChange={(e) => setSelectedHull(e.target.value)}
                  />
                  <label htmlFor={key} className="hull-card">
                    <div className="hull-name">{hull.name}</div>
                    <div className="hull-stats">
                      Mass: {hull.maxMass} | HP: {hull.hp} | AC: {hull.ac} | SP: {hull.sp}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            {hull.specialRules && (
              <div className="special-rules">
                <p>{hull.specialRules}</p>
              </div>
            )}
          </div>

          {/* Hull Info */}
          <div className="card">
            <h2>Hull Details</h2>
            <div className="hull-details">
              <div><strong>Class:</strong> {hull.name}</div>
              <div><strong>Max Mass:</strong> {hull.maxMass}</div>
              <div><strong>HP:</strong> {hull.hp}</div>
              <div><strong>AC:</strong> {hull.ac}</div>
              <div><strong>Speed:</strong> {hull.speed}</div>
              <div><strong>Crew:</strong> {hull.crew}</div>
              <div><strong>Hardpoints:</strong> {hull.hardpoints.join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Component Selection */}
        <div className="components-grid">
          {/* Required Components */}
          <div className="component-section">
            <h2 className="section-title">Required Components</h2>
            
            <ShipComponentSelector
              componentName="Bridge"
              selectedComponent={selectedComponents.bridge}
              handleComponentChange={handleComponentChange}
            />

            <ShipComponentSelector
              componentName="Crew Quarters"
              selectedComponent={selectedComponents.crewquarters}
              handleComponentChange={handleComponentChange}
            />

            <ShipComponentSelector
              componentName="Thrusters"
              selectedComponent={selectedComponents.thrusters}
              handleComponentChange={handleComponentChange}
            />

            <ShipComponentSelector
              componentName="Core"
              selectedComponent={selectedComponents.core}
              handleComponentChange={handleComponentChange}
            />

          <ShipComponentSelector
              componentName="Life Support"
              selectedComponent={selectedComponents.lifesupport}
              handleComponentChange={handleComponentChange}
            />

            <ShipComponentSelector
              componentName="Shields"
              selectedComponent={selectedComponents.shields}
              handleComponentChange={handleComponentChange}
            />
            </div>

          {/* Optional Components */}
          <div className="component-section">
            <h2 className="section-title">Optional Components</h2>
            
            {/* Weapons */}
            <div className="card">
              <h3>
                <Crosshair className="icon icon-red" />
                Weapons
              </h3>
              <WeaponSelector selectedComponents={selectedComponents} handleWeaponChange={handleWeaponChange}/>
            </div>

            {/* Supplemental Components */}
            <div className="card">
              <h3>
                <Wrench className="icon icon-cyan" />
                Supplemental Components
              </h3>
              <div className="checkbox-list">
                {Object.entries(getValidSupplemental()).map(([key, supp]) => (
                  <div key={key} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`supp-${key}`}
                      checked={selectedComponents.supplemental.includes(key)}
                      onChange={() => handleSupplementalToggle(key)}
                    />
                    <label htmlFor={`supp-${key}`} className="checkbox-card">
                      <div className="component-name">{supp.name}</div>
                      <div className="component-stats">
                        Mass: {supp.mass} | Power: {supp.power} | SP: {supp.sp}
                      </div>
                      <div className="component-desc">{supp.description}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ship Summary */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>
            <Rocket className="icon icon-blue" />
            Ship Summary
          </h2>
          <div className="hull-details">
            <div><strong>Hull:</strong> {hull.name}</div>
            <div><strong>Total Mass:</strong> {totalMass}/{hull.maxMass}</div>
            <div><strong>Total Power:</strong> {totalPower > 0 ? '+' : ''}{totalPower}</div>
            <div><strong>Total Ship Points:</strong> {totalSP}</div>
            <div><strong>Final Speed:</strong> {hull.speed + (selectedComponents.thrusters ? components.thrusters[selectedComponents.thrusters as keyof typeof components.thrusters].speedMod : 0)}</div>
            {selectedComponents.shields && (
              <div><strong>Shield Points:</strong> {components.shields[selectedComponents.shields as keyof typeof components.shields].shieldPoints}</div>
            )}
            <div><strong>Hardpoints Available:</strong> {hull.hardpoints.length}</div>
            <div><strong>Weapons Mounted:</strong> {selectedComponents.weapons.length}</div>
          </div>
          
          {selectedComponents.weapons.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Equipped Weapons:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                {selectedComponents.weapons.map(weaponKey => (
                  <li key={weaponKey}>{components.weapons[weaponKey].name}</li>
                ))}
              </ul>
            </div>
          )}
          
          {selectedComponents.supplemental.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Supplemental Components:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                {selectedComponents.supplemental.map(suppKey => (
                  <li key={suppKey}>{components.supplemental[suppKey].name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarshipBuilder;