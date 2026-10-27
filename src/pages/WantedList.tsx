import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import type { WantedPage } from '../types/wanted';

const SIZES = [10, 20, 50];
const SORTS = [
  { value: 'updatedAt,desc', label: 'Más recientes' },
  { value: 'bounty,desc', label: 'Recompensa Mayor' },
  { value: 'name,asc', label: 'Nombre A-Z' },
];

export function WantedList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageParam = searchParams.get('page');
  const sizeParam = searchParams.get('size');
  const status = searchParams.get('status') || '';
  const crewId = searchParams.get('crewId') || '';
  const fruit = searchParams.get('fruit') || '';
  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'updatedAt,desc';

  const page = Math.max(0, parseInt(pageParam || '0'));
  const size = SIZES.includes(Number(sizeParam)) ? Number(sizeParam) : 10;

  const [data, setData] = useState<WantedPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reqId, setReqId] = useState(0);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== q) {
        const next = new URLSearchParams(searchParams);
        if (searchInput) next.set('q', searchInput);
        else next.delete('q');
        next.set('page', '0');
        setSearchParams(next);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('size', String(size));
    if (sort) params.set('sort', sort);
    if (status) params.set('status', status);
    if (crewId) params.set('crewId', crewId);
    if (fruit) params.set('fruit', fruit);
    if (q) params.set('q', q);
    return params.toString();
  };

  const load = async () => {
    const id = reqId + 1;
    setReqId(id);
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<WantedPage>(`/wanted?${buildQuery()}`);
      setData(res);
    } catch (e: any) {
      setError(e.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, size, status, crewId, fruit, q, sort]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.set('page', '0');
    setSearchParams(next);
  };

  const goToPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 border-4 border-amber-950 rounded-t-lg p-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-amber-50" style={{ fontFamily: 'Georgia, serif' }}>
              🏴‍☠️ CARTELERAS DE "SE BUSCA"
            </h1>
            <p className="text-amber-200 italic">"¡Recompensas por los Piratas más peligrosos!"</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded font-bold hover:from-gray-800 hover:to-gray-950 border-2 border-gray-950"
          >
            ← Volver al Dashboard
          </button>
        </div>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-t-0 border-amber-800 p-6">
          <div className="bg-amber-50 border-2 border-amber-700 rounded-lg p-4 mb-6 shadow-lg">
            <h2 className="text-lg font-bold text-amber-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              🔍 Filtros de Búsqueda
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <input
                className="border-2 border-amber-700 rounded px-3 py-2 bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Buscar por nombre o epíteto"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <select
                className="border-2 border-amber-700 rounded px-3 py-2 bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
                value={status}
                onChange={(e) => updateParam('status', e.target.value)}
              >
                <option value="">Todos los Estados</option>
                <option value="AT_LARGE">AT_LARGE</option>
                <option value="CAPTURED">CAPTURED</option>
                <option value="MISSING">MISSING</option>
              </select>
              <input
                className="border-2 border-amber-700 rounded px-3 py-2 bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="CrewId"
                value={crewId}
                onChange={(e) => updateParam('crewId', e.target.value)}
              />
              <select
                className="border-2 border-amber-700 rounded px-3 py-2 bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
                value={fruit}
                onChange={(e) => updateParam('fruit', e.target.value)}
              >
                <option value="">Todas las Frutas</option>
                <option value="PARAMECIA">PARAMECIA</option>
                <option value="ZOAN">ZOAN</option>
                <option value="LOGIA">LOGIA</option>
                <option value="NONE">NONE</option>
              </select>
              <select
                className="border-2 border-amber-700 rounded px-3 py-2 bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                className="border-2 border-amber-700 rounded px-3 py-2 bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
                value={size}
                onChange={(e) => updateParam('size', e.target.value)}
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s} por página
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-center text-2xl text-amber-900 font-bold py-8">⏳ Buscando en los mares...</div>
          )}
          {error && (
            <div className="bg-red-100 border-2 border-red-600 rounded-lg p-4 text-center mb-4">
              <div className="text-red-700 mb-2 font-semibold">{error}</div>
              <button onClick={load} className="bg-gradient-to-r from-red-700 to-red-900 text-white px-4 py-2 rounded font-bold hover:from-red-800 hover:to-red-950">
                🔄 Reintentar
              </button>
            </div>
          )}
          {!loading && !error && data && data.content.length === 0 && (
            <div className="text-center text-xl text-amber-900 font-bold py-8 bg-amber-50 border-2 border-amber-700 rounded-lg">
              🏝️ No se encontraron carteles en estas aguas...
            </div>
          )}
          {!loading && !error && data && data.content.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {data.content.map((w) => (
                  <div
                    key={w.id}
                    className="relative bg-[#f5e6d3] border-8 border-[#8b4513] rounded-sm cursor-pointer shadow-2xl hover:shadow-[0_0_30px_rgba(139,69,19,0.8)] hover:scale-105 transition-all overflow-hidden"
                    style={{ 
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,69,19,0.1) 2px, rgba(139,69,19,0.1) 4px)',
                      boxShadow: '0 10px 30px rgba(101,67,33,0.6), inset 0 0 20px rgba(139,69,19,0.2)'
                    }}
                    onClick={() => navigate(`/wanted/${w.id}`)}
                  >
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-[#8b0000] via-[#dc2626] to-[#8b0000] flex items-center justify-center">
                      <div className="text-[#fbbf24] font-black text-xs tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>WANTED</div>
                    </div>
                    <div className="pt-8 px-4 pb-4">
                      <div className="border-2 border-[#8b4513] mb-3 h-32 bg-gradient-to-b from-[#d2691e]/20 to-[#8b4513]/20 flex items-center justify-center">
                        <div className="text-6xl opacity-40">🏴‍☠️</div>
                      </div>
                      <div className="text-center mb-2 border-b-2 border-[#8b4513] pb-2">
                        <div className="text-lg font-black text-[#8b0000] uppercase tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                          {w.name}
                        </div>
                        {w.epithet && <div className="text-sm font-bold text-[#654321] italic">"{w.epithet}"</div>}
                      </div>
                      <div className="space-y-2 text-[#4a2c2a]">
                        <div className="bg-[#8b0000] text-[#fbbf24] p-2 rounded text-center">
                          <div className="text-xs font-bold">RECOMPENSA</div>
                          <div className="text-xl font-black">฿{w.bounty?.toLocaleString()}</div>
                        </div>
                        <div className="flex justify-between text-xs border-t border-[#8b4513] pt-2">
                          <span className="font-semibold">ESTADO:</span>
                          <span className="font-bold">{w.status || '-'}</span>
                        </div>
                        {(w.crewName || w.crew?.name) && (
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold">TRIPULACIÓN:</span>
                            <span className="text-right font-bold">{w.crewName || w.crew?.name}</span>
                          </div>
                        )}
                        {(w.fruit || w.devilFruit?.type) && (
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold">FRUTA:</span>
                            <span className="text-right font-bold text-purple-800">{w.fruit || w.devilFruit?.type}</span>
                          </div>
                        )}
                        {w.role && (
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold">RANGO:</span>
                            <span className="text-right font-bold">{w.role}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-center text-xs text-[#8b0000] font-bold border-t border-[#8b4513] pt-2">
                        MARINE HEADQUARTERS
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8b0000] to-transparent"></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-4 bg-amber-50 border-2 border-amber-700 rounded-lg p-3">
                <button
                  disabled={page <= 0}
                  onClick={() => goToPage(page - 1)}
                  className="bg-gradient-to-r from-amber-700 to-amber-900 text-white px-4 py-2 rounded font-bold hover:from-amber-800 hover:to-amber-950 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-amber-950"
                >
                  ← Anterior
                </button>
                <span className="text-amber-900 font-bold">
                  Página {page + 1} / {data.totalPages || 1}
                </span>
                <button
                  disabled={!!(data.totalPages && page + 1 >= data.totalPages)}
                  onClick={() => goToPage(page + 1)}
                  className="bg-gradient-to-r from-amber-700 to-amber-900 text-white px-4 py-2 rounded font-bold hover:from-amber-800 hover:to-amber-950 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-amber-950"
                >
                  Siguiente →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
