import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import type { NewsFeedResponse, NewsItem } from '../types/news';

export function NewsFeed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type') || '';
  const priority = searchParams.get('priority') || '';
  const status = searchParams.get('status') || '';

  const [items, setItems] = useState<NewsItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const inFlight = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const buildQuery = (c: string | null) => {
    const params = new URLSearchParams();
    if (c) params.set('cursor', c);
    params.set('limit', '20');
    if (type) params.set('type', type);
    if (priority) params.set('priority', priority);
    if (status) params.set('status', status);
    return params.toString();
  };

  const loadInitial = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<NewsFeedResponse>(`/news/feed?${buildQuery(null)}`);
      setItems(res.items || []);
      setCursor(res.nextCursor || null);
      setHasMore(!!res.hasMore);
    } catch (e: any) {
      setError(e.message || 'Error al cargar');
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  };

  const loadMore = async () => {
    if (inFlight.current || !hasMore || !cursor) return;
    inFlight.current = true;
    setLoadingMore(true);
    setError(null);
    try {
      const res = await apiFetch<NewsFeedResponse>(`/news/feed?${buildQuery(cursor)}`);
      setItems((prev) => {
        const existing = new Set(prev.map((p) => p.id));
        const newItems = (res.items || []).filter((n) => !existing.has(n.id));
        return [...prev, ...newItems];
      });
      setCursor(res.nextCursor || null);
      setHasMore(!!res.hasMore);
    } catch (e: any) {
      setError(e.message || 'Error al cargar');
    } finally {
      setLoadingMore(false);
      inFlight.current = false;
    }
  };

  useEffect(() => {
    setItems([]);
    setCursor(null);
    setHasMore(true);
    loadInitial();
  }, [type, priority, status]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, cursor]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 border-4 border-blue-950 rounded-t-lg p-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cyan-50" style={{ fontFamily: 'Georgia, serif' }}>
              🗞️ NEWS COO - NOTICIAS DEL MUNDO
            </h1>
            <p className="text-cyan-200 italic">"Información veraz de los mares"</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded font-bold hover:from-gray-800 hover:to-gray-950 border-2 border-gray-950"
          >
            ← Volver al Dashboard
          </button>
        </div>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-t-0 border-amber-800 p-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-700 rounded-lg p-4 mb-6 shadow-lg">
            <h2 className="text-lg font-bold text-blue-900 mb-3">🔍 Filtrar Noticias</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="border-2 border-blue-700 rounded px-3 py-2 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-cyan-600" placeholder="Tipo" value={type} onChange={(e) => updateParam('type', e.target.value)} />
              <input className="border-2 border-blue-700 rounded px-3 py-2 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-cyan-600" placeholder="Prioridad" value={priority} onChange={(e) => updateParam('priority', e.target.value)} />
              <input className="border-2 border-blue-700 rounded px-3 py-2 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-cyan-600" placeholder="Estado" value={status} onChange={(e) => updateParam('status', e.target.value)} />
            </div>
          </div>
          {loading && <div className="text-center text-2xl text-blue-900 font-bold py-8">📡 Recibiendo noticias...</div>}
          {error && items.length === 0 && (
            <div className="bg-red-100 border-2 border-red-600 rounded-lg p-4 text-center">
              <div className="text-red-700 mb-2 font-semibold">{error}</div>
              <button onClick={loadInitial} className="bg-gradient-to-r from-red-700 to-red-900 text-white px-4 py-2 rounded font-bold">🔄 Reintentar</button>
            </div>
          )}
          {error && items.length > 0 && <div className="text-red-700 bg-red-100 p-2 rounded mb-2">{error}</div>}
          <div className="space-y-3">
            {items.map((n) => (
              <div key={n.id} className="bg-gradient-to-r from-white to-blue-50 border-2 border-blue-700 rounded-lg p-4 cursor-pointer shadow-lg hover:shadow-xl hover:border-cyan-600 transition-all" onClick={() => navigate(`/news/${n.id}`)}>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-blue-900 text-lg">{n.title}</div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    n.status === 'CONFIRMED' ? 'bg-green-600 text-white' : 
                    n.status === 'DEBUNKED' ? 'bg-red-600 text-white' : 
                    'bg-yellow-600 text-white'
                  }`}>{n.status}</span>
                </div>
                <div className="flex gap-3 text-sm text-blue-800">
                  <span>📰 {n.type}</span>
                  <span>⚡ {n.priority}</span>
                </div>
              </div>
            ))}
          </div>
          <div ref={sentinelRef} />
          {loadingMore && <div className="text-center text-blue-900 py-4">Cargando más noticias...</div>}
          {!hasMore && items.length > 0 && <div className="text-center text-blue-900 font-bold py-4 border-t-2 border-blue-700 mt-4">📰 Fin de las noticias</div>}
        </div>
      </div>
    </div>
  );
}
