import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import type { SagaStory, SagaStage } from '../types/sagas';

export function SagaStoryPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState<SagaStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stageParam = searchParams.get('stage');
  useEffect(() => {
    if (stageParam !== null && data) {
      const stages = (data as any).stages || (data as any).episodes || [];
      const idx = parseInt(stageParam);
      if (!isNaN(idx) && idx >= 0 && idx < stages.length) {
        setActiveIndex(idx);
        setTimeout(() => {
          stageRefs.current[idx]?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }, 50);
      }
    }
  }, [stageParam, data]);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<SagaStory | any>(`/sagas/${id}/story`);
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

  useEffect(() => {
    const stages = (data as any)?.stages || (data as any)?.episodes || [];
    if (!data || stages.length === 0 || prefersReducedMotion) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = stageRefs.current.findIndex((el) => el === entry.target);
            if (idx >= 0) {
              setActiveIndex(idx);
              const next = new URLSearchParams(searchParams);
              next.set('stage', String(idx));
              setSearchParams(next, { replace: true });
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    stageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [data, prefersReducedMotion]);

  const goToStage = (idx: number) => {
    const stagesArr2 = (data as any)?.stages || (data as any)?.episodes || [];
    if (!data || stagesArr2.length === 0) return;
    if (idx < 0 || idx >= stagesArr2.length) return;
    setActiveIndex(idx);
    const next = new URLSearchParams(searchParams);
    next.set('stage', String(idx));
    setSearchParams(next);
    stageRefs.current[idx]?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const stagesArr2 = (data as any)?.stages || (data as any)?.episodes || [];
    if (!data || stagesArr2.length === 0) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      goToStage(activeIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      goToStage(activeIndex - 1);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-900 font-bold">🗿 Descifrando Poneglyphs...</div>
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
  const stagesArr = (data as any)?.stages || (data as any)?.episodes || [];
  if (!data || stagesArr.length === 0) return <div className="p-4">No encontrado</div>;

  const activeStage: any = stagesArr[activeIndex];
  const progress = ((activeIndex + 1) / stagesArr.length) * 100;

  return (
    <div className="min-h-screen" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-900 to-purple-800 border-b-4 border-purple-950 p-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-3 py-1 rounded font-bold">← Volver</button>
            <h1 className="text-xl font-bold text-purple-50" style={{ fontFamily: 'Georgia, serif' }}>{data.saga?.name || (data as any).name || (data as any).title || 'Saga'}</h1>
          </div>
          <div className="text-purple-200">
            Etapa {activeIndex + 1} / {stagesArr.length} | {Math.round(progress)}%
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-2 h-2 bg-purple-950 rounded">
          <div className="h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-purple-100 border-4 border-purple-900 rounded-lg p-4">
          <div className="font-bold text-purple-900 text-lg mb-1">📍 Etapa Activa: {activeStage?.title || activeStage?.name || `Etapa ${activeIndex + 1}`}</div>
          {(activeStage?.island?.name || activeStage?.island) && <div className="text-purple-800">🏝️ Isla: {activeStage.island?.name || activeStage.island}</div>}
          {activeStage?.metrics && <div className="mt-2 flex flex-wrap gap-2">{Object.entries(activeStage.metrics).map(([k,v]: any) => <span key={k} className="bg-purple-700 text-white px-2 py-1 rounded text-xs">{k}: {typeof v === 'object' && v !== null ? (Array.isArray(v) ? v.join(', ') : JSON.stringify(v)) : String(v)}</span>)}</div>}
        </div>
        <div className="flex flex-col gap-12">
          {stagesArr.map((stage: any, idx: number) => (
            <section
              key={stage.id || idx}
              ref={(el) => {
                stageRefs.current[idx] = el;
              }}
              className="relative bg-gradient-to-b from-amber-50 to-amber-100 border-6 border-purple-900 rounded-lg p-8 min-h-[60vh] shadow-2xl"
              style={idx === activeIndex && (activeStage?.colors?.bg || stage?.colors?.bg) ? { background: activeStage?.colors?.bg || stage?.colors?.bg } : {}}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-900 text-purple-50 px-6 py-2 rounded font-bold">ETAPA {idx + 1}</div>
              <h2 className="text-2xl font-bold text-purple-900 mb-4 mt-4" style={{ fontFamily: 'Georgia, serif' }}>{stage.title || stage.name || `Etapa ${idx + 1}`}</h2>
              {(stage.island?.name || stage.island) && <div className="mb-4 text-purple-800 font-semibold">🏝️ {stage.island?.name || stage.island}</div>}
              <div className="whitespace-pre-wrap text-amber-900 leading-relaxed mb-6 bg-white/50 p-4 rounded">{stage.narrative || stage.description || stage.content || ''}</div>
              {stage.metrics && idx === activeIndex && <div className="flex flex-wrap gap-2">{Object.entries(stage.metrics).map(([k,v]: any) => <span key={k} className="bg-purple-700 text-white px-3 py-1 rounded">{k}: {String(v)}</span>)}</div>}
            </section>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <button disabled={activeIndex <= 0} onClick={() => goToStage(activeIndex - 1)} className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-2 rounded font-bold disabled:opacity-40">← Anterior</button>
          <button disabled={activeIndex >= stagesArr.length - 1} onClick={() => goToStage(activeIndex + 1)} className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-2 rounded font-bold disabled:opacity-40">Siguiente →</button>
        </div>
        <div className="text-center text-sm text-purple-800 mt-4">Usa las flechas del teclado para navegar</div>
      </div>
    </div>
  );
}
