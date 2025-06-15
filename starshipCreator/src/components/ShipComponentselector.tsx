import '../starshipBuilder.css'
import { components } from '../constants/shipComponents';

interface ShipComponentSelectorProps {
  componentName: string;
  selectedComponent: string | null;
  handleComponentChange: (componentType: string, value: string) => void;
  selectedHull?: string; // Optional, needed for getValidBridges logic
}


const ShipComponentSelector: React.FC<ShipComponentSelectorProps> = ({ 
  componentName, 
  selectedComponent, 
  handleComponentChange,
  selectedHull = 'frigate'
}) => {

    

    const getValidComponents = () => {
    const componentType = componentName.toLowerCase();
    
    switch (componentType) {
      case 'bridge':
        if (selectedHull === 'fighter') {
          return { fighterCockpit: components.bridges.fighterCockpit };
        } else {
          const { fighterCockpit, ...otherBridges } = components.bridges;
          return otherBridges;
        }
      case 'crew quarters':
        return components.crewquarters;
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
        return components.bridges[selectedComponent as keyof typeof components.bridges]?.description;
      case 'crew quarters':
        return components.crewquarters[selectedComponent as keyof typeof components.crewquarters]?.description;
      case 'thrusters':
        return components.thrusters[selectedComponent as keyof typeof components.thrusters]?.description;
      case 'core':
        return components.cores[selectedComponent as keyof typeof components.cores]?.description;
      case 'life support':
        return components.lifeSupport[selectedComponent as keyof typeof components.lifeSupport]?.description;
      case 'shields':
        return components.shields[selectedComponent as keyof typeof components.shields]?.description;
      default:
        return 'component not found';
    }
  };



    return (
    <div className="card">
              <h3>{componentName}</h3>
              <select 
                value={selectedComponent || ''} 
                onChange={(e) => handleComponentChange(componentName.toLowerCase().replace(/\s+/g, ''), e.target.value)}
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