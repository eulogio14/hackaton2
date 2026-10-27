import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import type { NewsItem } from '../types/news';

export function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<NewsItem | any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [prevStatus, setPrevStatus] = useState<string | undefined>(undefined);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<NewsItem>(`/news/${id}`);
      setData(res);
      setPrevStatus((res as any).status);
    } catch (e: any) {
      setError(e.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const verify = async (status: 'CONFIRMED' | 'DEBUNKED') => {
    if (!id || !data) return;
    if ((data as any).status !== 'RUMOR') return;
    setUpdating(true);
    setUpdateError(null);
    setPrevStatus((data as any).status);
    setData({ ...data, status });
    try {
      const res = await apiFetch<NewsItem>(`/news/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setData(res);
      setPrevStatus((res as any).status);
    } catch (e: any) {
      setData((d: any) => (d ? { ...d, status: prevStatus } : d));
      setUpdateError(e.message || 'Error al actualizar');
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-amber-900 font-bold">⏳ Abriendo periódico del mundo...</div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-red-800 rounded-lg p-6 max-w-md w-full text-center">
          <div className="text-red-700 mb-4 font-semibold">{error}</div>
          <button onClick={load} className="bg-gradient-to-r from-red-700 to-red-900 text-white px-4 py-2 rounded font-bold mr-2">🔄 Reintentar</button>
          <button onClick={() => navigate(-1)} className="bg-gradient-to-r from-amber-700 to-amber-900 text-white px-4 py-2 rounded font-bold">← Volver</button>
        </div>
      </div>
    );
  if (!data) return <div className="p-4">No encontrado</div>;

  const formatDate = (d: any) => {
    if (!d) return null;
    try {
      return new Date(d).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
    } catch {
      return String(d);
    }
  };

  const statusLabel = (s: string) => {
    if (s === 'CONFIRMED') return '✅ CONFIRMADO';
    if (s === 'DEBUNKED') return '❌ DESMENTIDO';
    if (s === 'RUMOR') return '⚠️ RUMOR';
    return s;
  };

  const typeLabel = (t: string) => {
    if (t === 'WORLD') return 'MUNDO';
    if (t === 'MARINE') return 'MARINA';
    if (t === 'PIRATE') return 'PIRATAS';
    return t || 'GENERAL';
  };

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: 'radial-gradient(circle at top, #f5deb3 0%, #deb887 40%, #8b4513 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 bg-gradient-to-r from-amber-700 to-amber-900 text-white px-4 py-2 rounded font-bold border-2 border-amber-950">← Volver al Periódico</button>
        <article className="relative bg-[#fdf6e3] border-[10px] border-[#8b4513] shadow-[0_20px_60px_rgba(101,67,33,0.8)] overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(139,69,19,0.08) 4px, rgba(139,69,19,0.08) 8px)' }}>
          <div className="border-b-4 border-[#8b4513] bg-gradient-to-r from-[#8b4513] to-[#654321] text-center py-3">
            <div className="text-[#fbbf24] text-3xl font-black tracking-[0.5em]" style={{ fontFamily: 'Georgia, serif' }}>PERIÓDICO DE LOS MARES</div>
            <div className="text-[#f5deb3] text-xs mt-1">"La verdad tras los mares" • EDICIÓN EXTRAORDINARIA</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="text-center mb-6 border-b-2 border-[#8b4513] pb-4">
              <h1 className="text-3xl md:text-4xl font-black text-[#8b0000] mb-3" style={{ fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>{data.title}</h1>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-[#654321]">
                <span className="bg-[#8b4513] text-[#f5deb3] px-3 py-1 rounded font-bold">📁 {typeLabel(data.type)}</span>
                <span className="bg-[#654321] text-[#f5deb3] px-3 py-1 rounded font-bold">⚡ PRIORIDAD: {data.priority || 'NORMAL'}</span>
                <span className={`px-3 py-1 rounded font-bold ${data.status === 'CONFIRMED' ? 'bg-green-800 text-white' : data.status === 'DEBUNKED' ? 'bg-red-800 text-white' : 'bg-yellow-700 text-white'}`}>{statusLabel(data.status)}</span>
                {data.publishedAt && <span>📅 {formatDate(data.publishedAt)}</span>}
                {data.createdAt && !data.publishedAt && <span>📅 {formatDate(data.createdAt)}</span>}
              </div>
            </div>
            {data.summary && <div className="text-lg font-bold text-[#8b0000] mb-4 italic border-l-4 border-[#8b0000] pl-4">{data.summary}</div>}
            <div className="prose max-w-none text-[#4a2c2a] leading-relaxed text-lg whitespace-pre-wrap mb-6" style={{ fontFamily: 'Georgia, serif' }}>{data.content}</div>
            {(data.author || data.source || data.location) && (
              <div className="mb-6 p-4 bg-[#e6d3a3] border-2 border-[#8b4513] rounded">
                <div className="font-bold text-[#8b0000] mb-2">🗞️ DATOS DEL CORRESPONSAL</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#4a2c2a]">
                  {data.author && <div><span className="font-semibold">Autor:</span> {data.author}</div>}
                  {data.source && <div><span className="font-semibold">Fuente:</span> {data.source}</div>}
                  {data.location && <div><span className="font-semibold">Lugar:</span> {data.location}</div>}
                  {data.region && <div><span className="font-semibold">Región:</span> {data.region}</div>}
                </div>
              </div>
            )}
            {data.tags && Array.isArray(data.tags) && data.tags.length > 0 && (
              <div className="mb-6">
                <div className="font-bold text-[#8b0000] mb-2">🏷️ ETIQUETAS</div>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag: string, idx: number) => <span key={idx} className="bg-[#8b4513] text-[#f5deb3] px-2 py-1 rounded text-sm">#{tag}</span>)}
                </div>
              </div>
            )}
            {(data.status === 'RUMOR' || data.verifiable) && (
              <div className="mb-6 p-4 bg-yellow-50 border-3 border-yellow-700 rounded">
                <div className="font-bold text-yellow-900 mb-2 text-xl">⚠️ ¡INFORMACIÓN SIN CONFIRMAR!</div>
                <p className="text-yellow-800 mb-3">Esta noticia requiere verificación por parte de la tripulación. ¿Es cierta o falsa?</p>
                <div className="flex gap-3">
                  <button disabled={updating} onClick={() => verify('CONFIRMED')} className="bg-gradient-to-r from-green-700 to-green-900 text-white px-6 py-2 rounded font-bold disabled:opacity-50 border-2 border-green-950">✅ CONFIRMAR COMO VERDADERA</button>
                  <button disabled={updating} onClick={() => verify('DEBUNKED')} className="bg-gradient-to-r from-red-700 to-red-900 text-white px-6 py-2 rounded font-bold disabled:opacity-50 border-2 border-red-950">❌ DESMENTIR</button>
                </div>
              </div>
            )}
            {updateError && <div className="text-red-700 bg-red-100 p-3 rounded mb-3 border-2 border-red-600">{updateError}</div>}
            {updating && <div className="text-amber-900 font-bold mb-3 text-center">📝 Actualizando reporte...</div>}
            <div className="text-center text-[#654321] text-sm pt-4 border-t-2 border-[#8b4513]">
              <div className="font-bold">MARINE NEWS CO. - IMPRENTA DE LOGUETOWN</div>
              {data.updatedAt && <div>Última actualización: {formatDate(data.updatedAt)}</div>}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
