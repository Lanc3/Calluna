import type { Table, FloorPlanElement } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface EnhancedFloorPlanProps {
  tables: Table[];
  onTableSelect: (table: Table) => void;
  isTableBooked: (tableId: string) => boolean;
  selectedTable: Table | null;
  showElements?: boolean;
  enableElementDragging?: boolean;
  onElementPositionUpdate?: (elementId: string, x: number, y: number) => void;
}

export default function EnhancedFloorPlan({ 
  tables, 
  onTableSelect, 
  isTableBooked, 
  selectedTable, 
  showElements = true,
  enableElementDragging = false,
  onElementPositionUpdate
}: EnhancedFloorPlanProps) {
  const { data: elements } = useQuery<FloorPlanElement[]>({
    queryKey: ["/api/admin/floor-plan-elements"],
    retry: false,
    enabled: showElements,
  });

  // Filter elements by the same locations as the tables
  const locationIds = Array.from(new Set(tables.map(t => t.locationId)));
  const filteredElements = elements?.filter(element => 
    locationIds.includes(element.locationId)
  ) || [];

  const getTableStatus = (table: Table) => {
    if (isTableBooked(table.id)) return 'booked';
    if (selectedTable?.id === table.id) return 'selected';
    return 'available';
  };

  const getTableStyle = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-gray-400 cursor-not-allowed';
      case 'selected':
        return 'bg-calluna-orange cursor-pointer hover:bg-calluna-orange';
      default:
        return 'bg-calluna-brown cursor-pointer hover:bg-calluna-orange';
    }
  };

  const handleTableClick = (table: Table) => {
    if (!isTableBooked(table.id)) {
      onTableSelect(table);
    }
  };

  const getTableIcon = (type: string) => {
    switch (type) {
      case "booth": return "🪑";
      case "high-top": return "🍺";
      case "outdoor": return "🌿";
      case "private": return "🔒";
      default: return "🍽️";
    }
  };

  const getTableShape = (shape: string) => {
    switch (shape) {
      case "square": return "rounded-md";
      case "rectangular": return "rounded-lg";
      default: return "rounded-full";
    }
  };

  const getLocationColor = (location: string) => {
    switch (location) {
      case "patio": return "bg-green-50 border-green-200";
      case "bar": return "bg-purple-50 border-purple-200";
      case "private-room": return "bg-yellow-50 border-yellow-200";
      default: return "bg-blue-50 border-blue-200";
    }
  };

  if (!tables || tables.length === 0) {
    return (
      <div className="bg-gradient-to-br from-calluna-cream to-white rounded-lg p-6 shadow-inner min-h-96 flex items-center justify-center border-2 border-calluna-sand">
        <div className="text-center text-calluna-charcoal">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-lg font-semibold mb-2">No Tables Available</h3>
          <p className="text-sm">Please check back later or contact us directly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-calluna-cream to-white rounded-lg p-6 shadow-inner min-h-[600px] relative border-2 border-calluna-sand">
      <div className="absolute inset-4 overflow-auto">
        {/* Restaurant Layout Background */}
        <div className="absolute inset-0 bg-calluna-sand/20 rounded-lg"></div>
        
        {/* Bar Area */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-calluna-brown/10 rounded-lg px-4 py-2 border border-calluna-brown/20">
          <span className="text-calluna-brown font-semibold text-sm flex items-center gap-2">
            🍺 Bar Area
          </span>
        </div>
        
        {/* Main Dining Area Label */}
        <div className="absolute top-2 left-2 bg-calluna-brown/10 rounded-lg px-3 py-1 border border-calluna-brown/20">
          <span className="text-calluna-brown font-medium text-xs">Main Dining</span>
        </div>

        {/* Patio Area Label */}
        <div className="absolute bottom-2 right-2 bg-green-100 rounded-lg px-3 py-1 border border-green-300">
          <span className="text-green-700 font-medium text-xs flex items-center gap-1">
            🌿 Patio
          </span>
        </div>
        
        {/* Floor Plan Elements */}
        {filteredElements.map((element) => {
          const getElementIcon = () => {
            switch (element.elementType) {
              case 'bar': return '🍸';
              case 'stairs': return '🪜';
              case 'toilet': return '🚻';
              case 'window': return '🪟';
              case 'door': return '🚪';
              case 'wall': return '🧱';
              case 'kitchen': return '👨‍🍳';
              default: return '📦';
            }
          };

          return (
            <div
              key={element.id}
              className={cn(
                "absolute flex items-center justify-center border-2 shadow-md text-white font-bold z-10",
                "transition-all duration-200 hover:shadow-lg",
                enableElementDragging ? "cursor-move hover:scale-105" : "cursor-default"
              )}
              style={{
                left: element.xPosition,
                top: element.yPosition + 40,
                width: element.width,
                height: element.height,
                backgroundColor: element.color || "#8B4513",
                borderColor: element.color ? `${element.color}88` : "#8B451388",
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              title={`${element.name} (${element.elementType})`}
              onMouseDown={enableElementDragging ? (e) => {
                const startX = e.clientX - element.xPosition;
                const startY = e.clientY - (element.yPosition + 40);

                const handleMouseMove = (e: MouseEvent) => {
                  const newX = Math.max(0, e.clientX - startX);
                  const newY = Math.max(0, e.clientY - startY - 40);
                  
                  // Update position visually during drag
                  const elementDiv = document.getElementById(`element-${element.id}`);
                  if (elementDiv) {
                    elementDiv.style.left = `${newX}px`;
                    elementDiv.style.top = `${newY + 40}px`;
                  }
                };

                const handleMouseUp = (e: MouseEvent) => {
                  const newX = Math.max(0, e.clientX - startX);
                  const newY = Math.max(0, e.clientY - startY - 40);
                  
                  if (onElementPositionUpdate) {
                    onElementPositionUpdate(element.id, newX, newY);
                  }
                  
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              } : undefined}
              id={`element-${element.id}`}
            >
              <span className="text-lg">{getElementIcon()}</span>
            </div>
          );
        })}

        {/* Tables positioned based on coordinates */}
        <div className="relative w-full min-h-[500px]">
          {tables.map((table) => {
            const status = getTableStatus(table);
            const tableShape = getTableShape(table.shape || 'round');
            const isPremium = table.isPremium;
            
            return (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`table-element absolute flex items-center justify-center text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 cursor-pointer border-2 group ${tableShape} ${getTableStyle(status)} ${
                  isPremium ? 'border-yellow-400 shadow-yellow-200' : 'border-white/50'
                } ${status === 'booked' ? 'cursor-not-allowed' : ''}`}
                style={{
                  left: `${table.xPosition}px`,
                  top: `${table.yPosition + 40}px`, // Offset for bar area
                  width: `${table.width || 60}px`,
                  height: `${table.height || 60}px`,
                }}
              >
                <div className="text-center relative">
                  {isPremium && (
                    <div className="absolute -top-1 -right-1 text-yellow-300 text-xs">⭐</div>
                  )}
                  <div className="text-lg mb-1">{getTableIcon(table.tableType || 'standard')}</div>
                  <div className="text-sm font-bold">{table.name}</div>
                  <div className="text-xs opacity-90">
                    {status === 'booked' ? 'Reserved' : `${table.minCapacity || 1}-${table.maxCapacity || table.capacity}`}
                  </div>
                  {table.description && status !== 'booked' && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                      {table.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg p-3 border border-calluna-brown/20 shadow-md">
          <h4 className="text-xs font-semibold text-calluna-brown mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-calluna-brown rounded"></div>
              <span className="text-calluna-charcoal">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-calluna-orange rounded"></div>
              <span className="text-calluna-charcoal">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span className="text-calluna-charcoal">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-calluna-brown border-2 border-yellow-400 rounded"></div>
              <span className="text-calluna-charcoal">Premium ⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}