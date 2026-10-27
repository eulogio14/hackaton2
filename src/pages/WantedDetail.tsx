import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import type { Wanted } from '../types/wanted';

export function WantedDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Wanted | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<Wanted>(`/wanted/${id}`);
      setData(res);
    } catch (e: any) {
      setError(e.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-amber-900 font-bold">⏳ Cargando Cartel...</div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-red-800 rounded-lg p-6 max-w-md w-full text-center">
          <div className="text-red-700 mb-4 font-semibold">{error}</div>
          <button onClick={load} className="bg-gradient-to-r from-red-700 to-red-900 text-white px-4 py-2 rounded font-bold mr-2">
            🔄 Reintentar
          </button>
          <button onClick={() => navigate(-1)} className="bg-gradient-to-r from-amber-700 to-amber-900 text-white px-4 py-2 rounded font-bold">
            ← Volver
          </button>
        </div>
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-amber-900 font-bold">No encontrado</div>
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gradient-to-r from-amber-700 to-amber-900 text-white px-4 py-2 rounded font-bold hover:from-amber-800 hover:to-amber-950 border-2 border-amber-950"
        >
          ← Volver al Listado
        </button>
        <div
          className="relative bg-[#f5e6d3] border-[12px] border-[#8b4513] rounded-sm shadow-[0_20px_60px_rgba(101,67,33,0.8)] overflow-hidden"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,69,19,0.15) 3px, rgba(139,69,19,0.15) 6px)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-[#8b0000] via-[#dc2626] to-[#8b0000] flex items-center justify-center border-b-4 border-[#600000]">
            <div className="text-[#fbbf24] font-black text-lg tracking-[0.3em]" style={{ fontFamily: 'Georgia, serif' }}>
              ★ WANTED ★
            </div>
          </div>
          <div className="pt-14 px-8 pb-8">
            <div className="text-center mb-6">
              <div className="text-4xl font-black text-[#8b0000] uppercase tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                {data.name}
              </div>
              {data.epithet && (
                <div className="text-2xl font-bold text-[#654321] italic">"{data.epithet}"</div>
              )}
            </div>
            <div className="border-4 border-[#8b4513] mb-6 h-48 bg-gradient-to-b from-[#d2691e]/30 to-[#8b4513]/30 flex items-center justify-center">
              <div className="text-8xl opacity-50">🏴‍☠️</div>
            </div>
            <div className="bg-[#8b0000] border-4 border-[#600000] p-4 mb-6 text-center">
              <div className="text-[#fbbf24] text-sm font-bold tracking-widest mb-1">DEAD OR ALIVE</div>
              <div className="text-[#fbbf24] text-4xl font-black">฿{data.bounty?.toLocaleString() || '???'}</div>
            </div>
            <div className="space-y-2 mb-6">
              {Object.entries(data).map(([key, value]) => {
                if (value === null || value === undefined || key === 'id' || key === 'name' || key === 'epithet' || key === 'bounty' || key === 'imageUrl') return null;
                if (typeof value === 'object' && value !== null) {
                  return (
                    <div key={key} className="border-2 border-[#8b4513] bg-[#e6d3a3]">
                      <div className="bg-[#8b4513] text-[#f5e6d3] px-4 py-1 font-bold text-sm uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="px-4 py-2 text-sm text-[#4a2c2a]">
                        {Object.entries(value as any).map(([k2, v2]) => (
                          <div key={k2} className="flex justify-between border-b border-[#8b4513]/30 last:border-0 py-1">
                            <span className="font-semibold capitalize">{k2.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="text-right">
                              {typeof v2 === 'object' && v2 !== null ? JSON.stringify(v2) : typeof v2 === 'string' && v2.includes('T') && v2.includes('Z') ? new Date(v2).toLocaleString() : String(v2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (typeof value === 'string' && value.includes('T') && value.includes('Z') && value.length > 10) {
                  return (
                    <div key={key} className="flex border-2 border-[#8b4513] bg-[#e6d3a3]">
                      <div className="bg-[#8b4513] text-[#f5e6d3] px-4 py-2 font-bold w-48 text-sm uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="px-4 py-2 font-bold text-[#4a2c2a] flex-1">{new Date(value).toLocaleString()}</div>
                    </div>
                  );
                }
                return (
                  <div key={key} className="flex border-2 border-[#8b4513] bg-[#e6d3a3]">
                    <div className="bg-[#8b4513] text-[#f5e6d3] px-4 py-2 font-bold w-48 text-sm uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="px-4 py-2 font-bold text-[#4a2c2a] flex-1">{String(value)}</div>
                  </div>
                );
              })}
            </div>
            <div className="text-center border-t-4 border-[#8b4513] pt-4">
              <div className="text-[#8b0000] font-black text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                MARINE HEADQUARTERS
              </div>
              <div className="text-[#654321] text-xs mt-1">GOBIERNO MUNDIAL - SECCIÓN DE CAZARECOMPENSAS</div>
              {data.updatedAt && <div className="text-[#654321] text-xs mt-1">ACTUALIZADO: {new Date(data.updatedAt).toLocaleDateString()}</div>}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#8b0000] to-transparent"></div>
        </div>
        <details className="mt-4 bg-amber-50 border-2 border-amber-800 rounded">
          <summary className="cursor-pointer p-2 text-amber-900 font-semibold">Ver datos completos del cartel</summary>
          <div className="p-3">
            <pre className="text-xs overflow-auto bg-[#2b1810] text-[#d4af37] p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
          </div>
        </details>
      </div>
    </div>
  );
}
