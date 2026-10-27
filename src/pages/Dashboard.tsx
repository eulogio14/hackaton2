import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Summary {
  [key: string]: any;
}

interface LogPose {
  [key: string]: any;
}

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [logPose, setLogPose] = useState<LogPose | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, lp] = await Promise.all([
        apiFetch<Summary>('/dashboard/summary'),
        apiFetch<LogPose>('/log-pose'),
      ]);
      setSummary(s);
      setLogPose(lp);
    } catch (e: any) {
      if (e.message === 'UNAUTHORIZED') {
        logout();
        return;
      }
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
        <div className="text-2xl text-amber-900 font-bold">⏳ Cargando Log Pose...</div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-red-800 rounded-lg p-6 max-w-md w-full text-center">
          <div className="text-red-700 mb-4 font-semibold">{error}</div>
          <button onClick={load} className="bg-gradient-to-r from-amber-700 to-amber-900 text-white px-4 py-2 rounded font-bold hover:from-amber-800 hover:to-amber-950">
            🔄 Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 border-4 border-amber-950 rounded-t-lg p-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-amber-50" style={{ fontFamily: 'Georgia, serif' }}>
              ⚓ LOG POSE CONSOLE
            </h1>
            <p className="text-amber-200">
              Tripulación: <span className="font-bold">{user?.teamName || summary?.team?.name || summary?.teamName || '-'}</span> | {user?.email}{' '}
              {(user?.teamCode || summary?.team?.code) ? `| Código: ${user?.teamCode || summary?.team?.code}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/wanted')}
              className="bg-gradient-to-r from-red-700 to-red-900 text-white px-3 py-2 rounded font-bold hover:from-red-800 hover:to-red-950 border-2 border-red-950"
            >
              🏴‍☠️ Carteles
            </button>
            <button
              onClick={() => navigate('/news')}
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-3 py-2 rounded font-bold hover:from-blue-800 hover:to-blue-950 border-2 border-blue-950"
            >
              🗞️ Noticias
            </button>
            <button
              onClick={() => navigate('/sagas')}
              className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-3 py-2 rounded font-bold hover:from-purple-800 hover:to-purple-950 border-2 border-purple-950"
            >
              🗿 Poneglyphs
            </button>
            <button onClick={logout} className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-3 py-2 rounded font-bold hover:from-gray-800 hover:to-gray-950 border-2 border-gray-950">
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-t-0 border-amber-800 rounded-b-lg p-6 space-y-6">
          <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-amber-900 rounded-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-800 via-yellow-600 to-red-800"></div>
            <div className="p-4 mt-2">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                🏴‍☠️ OFICINA DEL GOBIERNO MUNDIAL - WANTED BOARD
              </h2>
              {summary?.team && (
                <div className="bg-gradient-to-r from-red-900 to-red-800 text-amber-50 p-3 rounded border-2 border-red-950 mb-4 text-center">
                  <div className="text-xl font-bold">TRIPULACIÓN: {summary.team.name}</div>
                  <div className="text-sm">CÓDIGO: {summary.team.code}</div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-gradient-to-b from-red-100 to-red-200 border-2 border-red-800 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-red-900">{summary?.wanted?.total || 0}</div>
                  <div className="text-xs font-semibold text-red-800">CARTELES TOTALES</div>
                </div>
                <div className="bg-gradient-to-b from-yellow-100 to-yellow-200 border-2 border-yellow-700 rounded p-3 text-center">
                  <div className="text-lg font-bold text-yellow-900">฿{(summary?.wanted?.totalBounty || 0).toLocaleString()}</div>
                  <div className="text-xs font-semibold text-yellow-800">RECOMPENSA TOTAL</div>
                </div>
                <div className="bg-gradient-to-b from-orange-100 to-orange-200 border-2 border-orange-700 rounded p-3 text-center">
                  <div className="text-lg font-bold text-orange-900">฿{Math.round(summary?.wanted?.averageBounty || 0).toLocaleString()}</div>
                  <div className="text-xs font-semibold text-orange-800">PROMEDIO</div>
                </div>
                <div className="bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-700 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-amber-900">{summary?.crews?.total || 0}</div>
                  <div className="text-xs font-semibold text-amber-800">TRIPULACIONES</div>
                </div>
              </div>
              {summary?.wanted?.byStatus && (
                <div className="mb-4">
                  <h3 className="font-bold text-amber-900 mb-2">POR ESTADO</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-red-700 text-white px-3 py-1 rounded font-semibold">LIBRE: {summary.wanted.byStatus.AT_LARGE || 0}</span>
                    <span className="bg-gray-700 text-white px-3 py-1 rounded font-semibold">CAPTURADO: {summary.wanted.byStatus.CAPTURED || 0}</span>
                    <span className="bg-yellow-700 text-white px-3 py-1 rounded font-semibold">DESAPARECIDO: {summary.wanted.byStatus.MISSING || 0}</span>
                  </div>
                </div>
              )}
              {summary?.wanted?.byFruit && (
                <div className="mb-4">
                  <h3 className="font-bold text-amber-900 mb-2">POR FRUTA DEL DIABLO</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-purple-700 text-white px-3 py-1 rounded">PARAMECIA: {summary.wanted.byFruit.PARAMECIA || 0}</span>
                    <span className="bg-green-700 text-white px-3 py-1 rounded">ZOAN: {summary.wanted.byFruit.ZOAN || 0}</span>
                    <span className="bg-blue-700 text-white px-3 py-1 rounded">LOGIA: {summary.wanted.byFruit.LOGIA || 0}</span>
                    <span className="bg-gray-700 text-white px-3 py-1 rounded">NINGUNA: {summary.wanted.byFruit.NONE || 0}</span>
                  </div>
                </div>
              )}
              {summary?.crews?.mostWanted && (
                <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-800 rounded p-3 mb-4">
                  <h3 className="font-bold text-amber-900 mb-1">🔥 TRIPULACIÓN MÁS BUSCADA</h3>
                  <div className="text-amber-900">
                    <div className="font-bold">{summary.crews.mostWanted.name}</div>
                    <div>Barco: {summary.crews.mostWanted.shipName}</div>
                    <div>Miembros: {summary.crews.mostWanted.memberCount} | Recompensa: ฿{summary.crews.mostWanted.totalBounty?.toLocaleString()}</div>
                  </div>
                </div>
              )}
              {summary?.topBounties && summary.topBounties.length > 0 && (
                <div>
                  <h3 className="font-bold text-amber-900 mb-3 text-xl" style={{ fontFamily: 'Georgia, serif' }}>
                    💀 TOP 5 MAYORES RECOMPENSAS
                  </h3>
                  <div className="space-y-2">
                    {summary.topBounties.map((p: any, idx: number) => (
                      <div key={p.id} className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-700 rounded p-3 flex items-center gap-3">
                        <div className="text-2xl font-bold text-red-900 w-8">#{idx + 1}</div>
                        <div className="flex-1">
                          <div className="font-bold text-red-900 text-lg">
                            {p.name} {p.epithet ? `"${p.epithet}"` : ''}
                          </div>
                          <div className="text-sm text-amber-900">
                            {p.crew?.name} | {p.role} | {p.lastSeenIsland}
                          </div>
                          {p.devilFruit && <div className="text-xs text-purple-800">{p.devilFruit.name} ({p.devilFruit.type})</div>}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-red-700">฿{p.bounty?.toLocaleString()}</div>
                          <div className="text-xs">{p.status} | Nivel {p.threatLevel}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-amber-900 rounded-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-800 via-cyan-400 to-blue-800"></div>
            <div className="p-4 mt-2">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                🧭 LOG POSE - BRÚJULA DEL GRAN LINE
              </h2>
              {logPose && (
                <div className="space-y-4">
                  <div className="relative bg-gradient-to-b from-[#1e3a5f] to-[#0f172a] border-4 border-blue-900 rounded-lg p-6 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #38bdf8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-cyan-300 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                          ⚓ INSTRUMENTO DE NAVEGACIÓN ⚓
                        </div>
                        <div className="text-cyan-400 text-sm">REVERSE MOUNTAIN INSPECTION</div>
                      </div>
                      {(() => {
                        const isGranted = logPose.hasLogPose || logPose.granted || logPose.logPoseGranted || logPose.approved || logPose.logPose === true || logPose.status === 'GRANTED' || logPose.inspectionPassed === true || logPose.canEnterGrandLine === true;
                        const needsInspection = logPose.needsInspection || logPose.requiredForGrandLine || (!isGranted && logPose.status !== 'GRANTED');
                        return (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-[#0c1e3d] border-2 border-cyan-600 rounded p-3">
                                <div className="text-cyan-400 text-xs mb-1">ESTADO DE NAVEGACIÓN</div>
                                <div className="text-cyan-100 text-lg font-bold">{logPose.status || logPose.state || logPose.navigationState || (isGranted ? 'GRANTED' : 'PENDING')}</div>
                              </div>
                              <div className="bg-[#0c1e3d] border-2 border-cyan-600 rounded p-3">
                                <div className="text-cyan-400 text-xs mb-1">TRAMO ACTUAL</div>
                                <div className="text-cyan-100 text-lg font-bold">{logPose.route || logPose.stage || logPose.currentStage || 'EAST BLUE'}</div>
                              </div>
                              <div className="bg-[#0c1e3d] border-2 border-cyan-600 rounded p-3">
                                <div className="text-cyan-400 text-xs mb-1">DESTINO</div>
                                <div className="text-cyan-100 text-lg font-bold">{logPose.destination || logPose.target || 'GRAND LINE'}</div>
                              </div>
                              <div className="bg-[#0c1e3d] border-2 border-cyan-600 rounded p-3">
                                <div className="text-cyan-400 text-xs mb-1">LOG POSE</div>
                                <div className={`text-lg font-bold ${isGranted ? 'text-green-400' : 'text-yellow-400'}`}>
                                  {isGranted ? '✓ ADQUIRIDO' : '⏳ NO ADQUIRIDO'}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center mb-4">
                              <div className="relative w-32 h-32">
                                <div className={`absolute inset-0 rounded-full border-4 ${isGranted ? 'border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.6)]' : 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]'} flex items-center justify-center`}>
                                  <div className="text-5xl">🧭</div>
                                </div>
                                <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 ${isGranted ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                              </div>
                            </div>
                            <div className={`text-center p-3 rounded border-2 font-bold ${isGranted ? 'bg-green-900/50 border-green-400 text-green-300' : 'bg-yellow-900/50 border-yellow-400 text-yellow-300'}`}>
                              {isGranted ? '⛵ AUTORIZADO PARA ENTRAR AL GRAND LINE' : '⚠️ SE REQUIERE APROBAR INSPECCIÓN EN REVERSE MOUNTAIN'}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  {logPose.inspection && (
                    <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-800 rounded p-4">
                      <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">📋 INFORME DE INSPECCIÓN</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-amber-900">
                        {logPose.inspection.status && <div><span className="font-semibold">Estado:</span> {logPose.inspection.status}</div>}
                        {logPose.inspection.attempts !== undefined && <div><span className="font-semibold">Intentos:</span> {logPose.inspection.attempts}</div>}
                        {logPose.inspection.passed !== undefined && <div><span className="font-semibold">Aprobado:</span> {logPose.inspection.passed ? 'SÍ' : 'NO'}</div>}
                      </div>
                    </div>
                  )}
                  <details className="bg-[#1a2332] border-2 border-blue-900 rounded">
                    <summary className="cursor-pointer p-2 text-cyan-400 font-semibold hover:bg-[#0c1e3d]">Ver datos técnicos del Log Pose</summary>
                    <div className="p-3">
                      <pre className="text-[#7dd3fc] font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-auto max-h-48">
                        {JSON.stringify(logPose, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
