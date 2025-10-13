'use client';

import { useState, useEffect } from 'react';
import { ItemCard } from '@/components/ItemCard';
import { CreateItemForm } from '@/components/CreateItemForm';
import { api } from '@/lib/api-client';

export default function HomePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await api.getItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to load items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleItemCreated = () => {
    loadItems();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteItem(id);
      loadItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ⚡ Serverless App
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Next.js + AWS CDK + Lambda + DynamoDB
          </p>
          <a
            href="https://justcopy.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            🚀 Copy this template on JustCopy.ai
          </a>
        </div>

        {/* Create Item Form */}
        <div className="mb-8">
          <CreateItemForm onItemCreated={handleItemCreated} />
        </div>

        {/* Items List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Items</h2>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading items...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No items yet. Create one above!</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Serverless</h3>
            <p className="text-gray-600 text-sm">
              Auto-scaling Lambda functions with API Gateway
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🗄️</div>
            <h3 className="text-lg font-semibold mb-2">DynamoDB</h3>
            <p className="text-gray-600 text-sm">
              NoSQL database with single-table design
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-lg font-semibold mb-2">Infrastructure as Code</h3>
            <p className="text-gray-600 text-sm">
              AWS CDK for repeatable deployments
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
