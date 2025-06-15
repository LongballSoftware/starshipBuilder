import React, { useState, useEffect } from 'react';
import { Rocket, Zap, Weight, Shield, Users, Cpu, Wrench, Crosshair } from 'lucide-react';
import './starshipBuilder.css'; // Import the CSS file
import ShipComponentSelector from './components/ShipComponentselector';

const StarshipBuilder = () => {
  // Starship data
  const hulls = {
    fighter: { name: 'Fighter', maxMass: 15, hp: 10, ac: '12+Dex', speed: 10, hardpoints: ['Forward'], crew: '1/2', sp: 20, specialRules: 'No crew quarters, shield, or core required. 20 default power for 24 hours.' },
    frigate: { name: 'Frigate', maxMass: 40, hp: 30, ac: 12, speed: 5, hardpoints: ['Forward', 'Port', 'Starboard'], crew: '4/12', sp: 40 },
    cruiser: { name: 'Cruiser', maxMass: 60, hp: 50, ac: 15, speed: 3, hardpoints: ['Forward', 'Port', 'Port', 'Starboard', 'Starboard', 'Aft'], crew: '25/100', sp: 60 },
    dreadnought: { name: 'Dreadnought', maxMass: 100, hp: 100, ac: 18, speed: 3, hardpoints: ['Forward', 'Forward', 'Port', 'Port', 'Starboard', 'Starboard', 'Aft'], crew: '100/1000', sp: 70 }
  };



  const components = {
        bridges: {
          fighterCockpit: { name: 'Fighter Cockpit', mass: 2, power: 3, sp: 0, description: 'Two-seat cockpit for small fighters and support craft. Can only be mounted on fighter class hulls.' },
          standard: { name: 'Standard Bridge', mass: 5, power: 5, sp: 1, description: 'Standard command and control center for a starship.' },
          recon: { name: 'Recon Bridge', mass: 8, power: 12, sp: 2, description: 'Bridge designed with exploration as its primary focus. Grants advantage on Perception/Investigation checks.' },
          combat: { name: 'Combat Bridge', mass: 10, power: 10, sp: 2, description: 'Bridge designed for military engagements. Grants +1 to all attacks.' }
        },
        quarters: {
          cramped: { name: 'Cramped Quarters', mass: 2, power: 3, sp: 0, description: 'Cramped living quarters. Roll d20 after long rest, gain exhaustion on natural 1.' },
          standard: { name: 'Standard Quarters', mass: 5, power: 5, sp: 1, description: 'Standard rooms with few recreational facilities.' },
          luxury: { name: 'Luxury Quarters', mass: 6, power: 8, sp: 2, description: 'Spacious quarters with amenities. Gain 1d4 bonus after long rest.' }
        },
        thrusters: {
          salvaged: { name: 'Salvaged Thrusters', mass: 4, power: 5, sp: 0, speedMod: -1, description: 'Salvaged thrusters with reduced performance.' },
          standard: { name: 'Standard Thrusters', mass: 4, power: 5, sp: 1, speedMod: 0, description: 'Standard propulsion system.' },
          enhanced: { name: 'Enhanced Thrusters', mass: 6, power: 8, sp: 2, speedMod: 2, description: 'High-performance thrusters.' }
        },
        cores: {
          mk1: { name: 'Element Zero Core Mk I', mass: 10, power: -40, sp: 1, description: 'Provides 40 power to ship systems.' },
          mk2: { name: 'Element Zero Core Mk II', mass: 15, power: -55, sp: 2, description: 'Provides 55 power to ship systems.' },
          mk3: { name: 'Element Zero Core Mk III', mass: 25, power: -75, sp: 4, description: 'Provides 75 power to ship systems.' }
        },
        lifeSupport: {
          standard: { name: 'Standard Life Support', mass: 3, power: 5, sp: 1, description: 'Provides life support for standard crew capacity. Lasts 24 hours without power.' },
          enhanced: { name: 'Enhanced Life Support', mass: 5, power: 10, sp: 2, description: 'Provides life support for twice the crew capacity. Lasts 7 days without power.' }
        },
        shields: {
          kinetic: { name: 'Kinetic Barrier', mass: 3, power: 5, sp: 1, shieldPoints: 10, description: 'Provides 10 shield points using mass effect fields.' },
          enhanced: { name: 'Enhanced Kinetic Barrier', mass: 6, power: 10, sp: 2, shieldPoints: 20, description: 'Provides 20 shield points using mass effect fields.' }
        },
        weapons: {
          massAccelerator: { name: 'Mass Accelerator', mass: 3, power: 5, sp: 1, damage: '1d8', description: 'Fires solid metal slugs accelerated to incredible speeds.' },
          gardianLaser: { name: 'GARDIAN Laser', mass: 5, power: 8, sp: 2, damage: '2d6 (½ vs shields)', description: 'Defense system laser, deals half damage against shields.' },
          disruptorTorpedo: { name: 'Disruptor Torpedo', mass: 5, power: 2, sp: 2, damage: '1d10 (double vs shields)', description: 'Single-use torpedoes effective against shields. 5 torpedoes per battery.' }
        },
        supplemental: {
          armory: { name: 'Armory', mass: 3, power: 1, sp: 2, description: 'Holds spare weaponry and ammunition.' },
          cargoBay: { name: 'Cargo Bay', mass: 3, power: 0, sp: 1, description: 'Allows hauling large objects and vehicles.' },
          medicalBay: { name: 'Medical Bay', mass: 2, power: 2, sp: 1, description: 'Emergency clinic. Healing always heals maximum amount.' },
          observationDeck: { name: 'Observation Deck', mass: 1, power: 0, sp: 0, description: 'Large cupola for unobstructed exterior viewing.' },
          researchLab: { name: 'Research Lab', mass: 2, power: 4, sp: 2, description: 'Fully stocked laboratory for scientific experimentation.' },
          armoredHull: { name: 'Armored Hull', mass: 5, power: 0, sp: 3, description: 'Reinforced hull. Adds 10 to base HP.' },
          fighterBay: { name: 'Fighter Bay', mass: 10, power: 10, sp: 4, description: 'Storage for up to 5 fighter crafts. Cruiser/Dreadnought only.' }
        }
      };



  

  // State
  const [selectedHull, setSelectedHull] = useState('frigate');
  const [selectedComponents, setSelectedComponents] = useState({
    bridge: 'standard',
    quarters: selectedHull === 'fighter' ? null : 'standard',
    thrusters: 'standard',
    core: selectedHull === 'fighter' ? null : 'mk1',
    lifeSupport: selectedHull === 'fighter' ? null : 'standard',
    shields: selectedHull === 'fighter' ? null : 'kinetic',
    weapons: [],
    supplemental: []
  });

  // Update components when hull changes
  useEffect(() => {
    if (selectedHull === 'fighter') {
      setSelectedComponents(prev => ({
        ...prev,
        bridge: 'fighterCockpit',
        quarters: null,
        core: null,
        lifeSupport: null,
        shields: null
      }));
    } else {
      setSelectedComponents(prev => ({
        ...prev,
        bridge: prev.bridge === 'fighterCockpit' ? 'standard' : prev.bridge,
        quarters: prev.quarters || 'standard',
        core: prev.core || 'mk1',
        lifeSupport: prev.lifeSupport || 'standard',
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

    if (selectedComponents.quarters) {
      const quarters = components.quarters[selectedComponents.quarters as keyof typeof components.quarters];
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

    if (selectedComponents.lifeSupport) {
      const lifeSupport = components.lifeSupport[selectedComponents.lifeSupport as keyof typeof components.lifeSupport];
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
    selectedComponents.weapons.forEach(weaponKey => {
      const weapon = components.weapons[weaponKey];
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

  const handleWeaponToggle = (weaponKey) => {
    setSelectedComponents(prev => ({
      ...prev,
      weapons: prev.weapons.includes(weaponKey) 
        ? prev.weapons.filter(w => w !== weaponKey)
        : [...prev.weapons, weaponKey]
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

  const getValidBridges = () => {
    if (selectedHull === 'fighter') {
      return { fighterCockpit: components.bridges.fighterCockpit };
    } else {
      const { fighterCockpit, ...otherBridges } = components.bridges;
      return otherBridges;
    }
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
              componentName="Quarters"
              selectedComponent={selectedComponents.quarters}
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
              selectedComponent={selectedComponents.lifeSupport}
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
              <div className="checkbox-list">
                {Object.entries(components.weapons).map(([key, weapon]) => (
                  <div key={key} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`weapon-${key}`}
                      checked={selectedComponents.weapons.includes(key)}
                      onChange={() => handleWeaponToggle(key)}
                    />
                    <label htmlFor={`weapon-${key}`} className="checkbox-card">
                      <div className="component-name">{weapon.name}</div>
                      <div className="component-stats">
                        Mass: {weapon.mass} | Power: {weapon.power} | SP: {weapon.sp} | Damage: {weapon.damage}
                      </div>
                      <div className="component-desc">{weapon.description}</div>
                    </label>
                  </div>
                ))}
              </div>
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
            <div><strong>Final Speed:</strong> {hull.speed + (selectedComponents.thrusters ? components.thrusters[selectedComponents.thrusters].speedMod : 0)}</div>
            {selectedComponents.shields && (
              <div><strong>Shield Points:</strong> {components.shields[selectedComponents.shields].shieldPoints}</div>
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