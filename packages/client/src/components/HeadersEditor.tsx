// packages/client/src/components/HeadersEditor.tsx
import { useAppStore } from '../store/useAppStore';
import { TrashIcon, PlusIcon } from 'lucide-react'; // Suponiendo que usas íconos

export const HeadersEditor = () => {
  const headers = useAppStore((state) => state.request.headers);
  const addHeader = useAppStore((state) => state.addHeader);
  const updateHeader = useAppStore((state) => state.updateHeader);
  const removeHeader = useAppStore((state) => state.removeHeader);

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Request Headers</h3>
        <button onClick={addHeader} className="text-xs flex items-center gap-1 text-blue-500">
          <PlusIcon size={14} /> Agregar
        </button>
      </div>

      {headers.map((header: typeof headers[number]) => (
        <div key={header.id} className="flex gap-2 items-center group">
          {/* Checkbox para activar/desactivar */}
          <input
            type="checkbox"
            checked={header.isEnabled}
            onChange={(e) => updateHeader(header.id, 'isEnabled', e.target.checked)}
          />

          {/* Key Input (ej: Content-Type) */}
          <input
            className="border p-1 rounded text-sm flex-1"
            placeholder="Key"
            value={header.key}
            onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
          />

          {/* Value Input (ej: application/json) */}
          <input
            className="border p-1 rounded text-sm flex-1"
            placeholder="Value"
            value={header.value}
            onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
          />

          {/* Botón Eliminar */}
          <button 
            onClick={() => removeHeader(header.id)}
            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ))}
      
      {headers.length === 0 && (
        <div className="text-gray-400 text-xs text-center py-2">
          No hay headers definidos.
        </div>
      )}
    </div>
  );
};