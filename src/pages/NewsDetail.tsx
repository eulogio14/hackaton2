import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import type { NewsItem } from '../types/news';

export function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<NewsItem | null>(null);
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
      setPrevStatus(res.status);
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
    if (data.status !== 'RUMOR') return;
    setUpdating(true);
    setUpdateError(null);
    setPrevStatus(data.status);
    setData({ ...data, status });
    try {
      const res = await apiFetch<NewsItem>(`/news/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setData(res);
      setPrevStatus(res.status);
    } catch (e: any) {
      setData((d) => (d ? { ...d, status: prevStatus } : d));
      setUpdateError(e.message || 'Error al actualizar');
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-blue-900 font-bold">📡 Cargando Noticia...</div>
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

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded font-bold">← Volver al Feed</button>
        <div className="bg-gradient-to-b from-white to-blue-50 border-4 border-blue-900 rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4">
            <h1 className="text-2xl font-bold text-cyan-50" style={{ fontFamily: 'Georgia, serif' }}>{data.title}</h1>
            <div className="flex gap-3 mt-2 text-cyan-200 text-sm">
              <span>📰 {data.type}</span>
              <span>⚡ {data.priority}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                data.status === 'CONFIRMED' ? 'bg-green-600 text-white' : 
                data.status === 'DEBUNKED' ? 'bg-red-600 text-white' : 
                'bg-yellow-600 text-white'
              }`}>{data.status}</span>
            </div>
          </div>
          <div className="p-6">
            <div className="whitespace-pre-wrap text-blue-900 leading-relaxed mb-6 bg-blue-50 p-4 rounded border border-blue-200">{data.content}</div>
            {data.status === 'RUMOR' && (
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-600 rounded">
                <div className="font-bold text-yellow-900 mb-3">⚠️ Este es un RUMOR - Verificar noticia</div>
                <div className="flex gap-2">
                  <button disabled={updating} onClick={() => verify('CONFIRMED')} className="bg-gradient-to-r from-green-700 to-green-900 text-white px-4 py-2 rounded font-bold disabled:opacity-50">✅ CONFIRMAR</button>
                  <button disabled={updating} onClick={() => verify('DEBUNKED')} className="bg-gradient-to-r from-red-700 to-red-900 text-white px-4 py-2 rounded font-bold disabled:opacity-50">❌ DESMENTIR</button>
                </div>
              </div>
            )}
            {updateError && <div className="text-red-700 bg-red-100 p-3 rounded mb-3">{updateError}</div>}
            {updating && <div className="text-blue-900 font-bold mb-3">Actualizando estado...</div>}
            <details>
              <summary className="cursor-pointer text-blue-900 font-semibold">Ver datos completos</summary>
              <pre className="mt-2 text-xs overflow-auto bg-[#1a2332] text-[#7dd3fc] p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
