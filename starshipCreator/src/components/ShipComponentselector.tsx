import '../starshipBuilder.css'

interface ShipComponentSelectorProps {
  componentName: string;
  selectedComponent: string;
  handleComponentChange: (componentType: string, value: string) => void;
  selectedHull?: string; // Optional, needed for getValidBridges logic
}





const ShipComponentSelector: React.FC<ShipComponentSelectorProps> = ({ 
  componentName, 
  selectedComponent, 
  handleComponentChange,
  selectedHull = 'frigate'
}) => {

    const components = {
        bridge: {
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

    const getValidComponents = () => {
    const componentType = componentName.toLowerCase();
    
    switch (componentType) {
      case 'bridge':
        if (selectedHull === 'fighter') {
          return { fighterCockpit: components.bridge.fighterCockpit };
        } else {
          const { fighterCockpit, ...otherBridges } = components.bridge;
          return otherBridges;
        }
      case 'quarters':
        return components.quarters;
      case 'thrusters':
        return components.thrusters;
      case 'core':
        return components.cores;
      case 'life support':
        return components.lifeSupport;
      case 'shields':
        return components.shields;
      default:
        return {};
    }
  };

  const getComponentDescription = () => {
    if (!selectedComponent) return null;
    
    const componentType = componentName.toLowerCase();
    
    switch (componentType) {
      case 'bridge':
        return components.bridge[selectedComponent as keyof typeof components.bridge]?.description;
      case 'quarters':
        return components.quarters[selectedComponent as keyof typeof components.quarters]?.description;
      case 'thrusters':
        return components.thrusters[selectedComponent as keyof typeof components.thrusters]?.description;
      case 'core':
        return components.cores[selectedComponent as keyof typeof components.cores]?.description;
      case 'life support':
        return components.lifeSupport[selectedComponent as keyof typeof components.lifeSupport]?.description;
      case 'shields':
        return components.shields[selectedComponent as keyof typeof components.shields]?.description;
      default:
        return null;
    }
  };



    return (
    <div className="card">
              <h3>{componentName}</h3>
              <select 
                value={selectedComponent || ''} 
                onChange={(e) => handleComponentChange(componentName.toLowerCase(), e.target.value)}
                className="select-input"
              >
                {Object.entries(getValidComponents()).map(([key, comp]) => (
                  <option key={key} value={key}>
                    {comp.name} (Mass: {comp.mass}, Power: {comp.power}, SP: {comp.sp})
                  </option>
                ))}
              </select>
              {selectedComponent && (
                <p className="component-description">
                  {getComponentDescription()}
                </p>
              )}
            </div>
    )
}

export default ShipComponentSelector;