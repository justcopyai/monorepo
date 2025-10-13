'use client';

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

export function ItemCard({ item, onDelete }: ItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
      {item.description && (
        <p className="text-gray-600 mb-4">{item.description}</p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        <button
          onClick={() => onDelete(item.id)}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
