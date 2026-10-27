import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import type { Saga } from '../types/sagas';

export function SagasList() {
  const [data, setData] = useState<Saga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<Saga[] | { items: Saga[] } | any>('/sagas');
      if (Array.isArray(res)) setData(res);
      else if (res.items) setData(res.items);
      else setData([]);
    } catch (e: any) {
      setError(e.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-amber-900 font-bold">🗿 Buscando Poneglyphs...</div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-red-800 rounded-lg p-6 max-w-md w-full text-center">
          <div className="text-red-700 mb-4 font-semibold">{error}</div>
          <button onClick={load} className="bg-gradient-to-r from-red-700 to-red-900 text-white px-4 py-2 rounded font-bold">🔄 Reintentar</button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-purple-900 to-purple-800 border-4 border-purple-950 rounded-t-lg p-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-50" style={{ fontFamily: 'Georgia, serif' }}>
              🗿 PONEGLYPHS - LA GRAN SAGA
            </h1>
            <p className="text-purple-200 italic">"La verdadera historia del mundo"</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded font-bold hover:from-gray-800 hover:to-gray-950 border-2 border-gray-950"
          >
            ← Volver al Dashboard
          </button>
        </div>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-t-0 border-amber-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((s: any) => (
              <div key={s.id} className="relative bg-gradient-to-b from-purple-50 to-purple-100 border-4 border-purple-900 rounded-lg p-6 cursor-pointer shadow-xl hover:shadow-2xl hover:scale-105 transition-all overflow-hidden" onClick={() => navigate(`/sagas/${s.id}`)}>
                <div className="absolute top-0 right-0 text-6xl opacity-20">🗿</div>
                <div className="relative">
                  <h2 className="text-xl font-bold text-purple-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>{s.name || s.title || s.sagaName || 'Saga'}</h2>
                  {(s.description || s.summary) && <p className="text-purple-800">{s.description || s.summary}</p>}
                  <div className="mt-4 text-purple-700 font-semibold">Explorar Saga →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
