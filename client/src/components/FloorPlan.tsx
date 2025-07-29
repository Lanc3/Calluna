import type { Table } from "@shared/schema";

interface FloorPlanProps {
  tables: Table[];
  onTableSelect: (table: Table) => void;
  isTableBooked: (tableId: string) => boolean;
  selectedTable: Table | null;
}

// Default tables for when no database tables are available
const defaultTables: Table[] = [
  { 
    id: '1', name: 'T1', capacity: 2, minCapacity: 1, maxCapacity: 2, 
    tableType: 'high-top', location: 'bar', shape: 'square', description: 'Intimate bar seating',
    xPosition: 50, yPosition: 50, width: 50, height: 50, isActive: true, isPremium: false,
    createdAt: new Date(), updatedAt: new Date() 
  },
  { 
    id: '2', name: 'T2', capacity: 4, minCapacity: 2, maxCapacity: 4, 
    tableType: 'standard', location: 'main', shape: 'round', description: 'Standard dining table',
    xPosition: 150, yPosition: 50, width: 60, height: 60, isActive: true, isPremium: false,
    createdAt: new Date(), updatedAt: new Date() 
  },
  { 
    id: '3', name: 'T3', capacity: 2, minCapacity: 1, maxCapacity: 2, 
    tableType: 'standard', location: 'main', shape: 'square', description: 'Cozy table for two',
    xPosition: 250, yPosition: 50, width: 50, height: 50, isActive: true, isPremium: false,
    createdAt: new Date(), updatedAt: new Date() 
  },
  { 
    id: '4', name: 'T4', capacity: 6, minCapacity: 4, maxCapacity: 6, 
    tableType: 'booth', location: 'main', shape: 'rectangular', description: 'Spacious booth seating',
    xPosition: 350, yPosition: 50, width: 90, height: 70, isActive: true, isPremium: true,
    createdAt: new Date(), updatedAt: new Date() 
  },
];

export default function FloorPlan({ tables, onTableSelect, isTableBooked, selectedTable }: FloorPlanProps) {
  // Use provided tables or fall back to default tables
  const displayTables = tables.length > 0 ? tables : defaultTables;

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

  return (
    <div className="bg-white rounded-lg p-6 shadow-inner min-h-96 relative">
      <div className="absolute inset-4">
        {/* Bar Area */}
        <div className="bg-calluna-sand rounded-lg p-2 mb-4 text-center">
          <span className="text-calluna-brown font-semibold text-sm">Bar</span>
        </div>
        
        {/* Tables Grid */}
        <div className="grid grid-cols-4 gap-3 h-full">
          {displayTables.map((table) => {
            const status = getTableStatus(table);
            return (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`rounded-lg flex items-center justify-center text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${getTableStyle(status)}`}
              >
                <div className="text-center">
                  <div className="text-lg">{table.name}</div>
                  <div className="text-xs">
                    {status === 'booked' ? 'Reserved' : `${table.capacity} seats`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Kitchen Area */}
        <div className="bg-calluna-sand rounded-lg p-2 mt-4 text-center">
          <span className="text-calluna-brown font-semibold text-sm">Kitchen</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-calluna-brown rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-calluna-orange rounded mr-2"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* Selected Table Info */}
      {selectedTable && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-inner">
          <h4 className="font-semibold text-calluna-brown mb-2">
            Selected Table: {selectedTable.name}
          </h4>
          <p className="text-calluna-charcoal text-sm">
            {selectedTable.capacity} seats - Perfect for your party
          </p>
        </div>
      )}

      {!selectedTable && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-inner">
          <h4 className="font-semibold text-calluna-brown mb-2">Selected Table: None</h4>
          <p className="text-calluna-charcoal text-sm">Please select a table from the floor plan above</p>
        </div>
      )}
    </div>
  );
}
