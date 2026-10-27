import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      await register(teamName, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.message || 'Error al registrar';
      setError(msg);
      const lower = msg.toLowerCase();
      if (lower.includes('email')) setFieldErrors({ email: msg });
      else if (lower.includes('team') || lower.includes('nombre') || lower.includes('crew')) setFieldErrors({ teamName: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            ⚓ Log Pose Console
          </h1>
          <p className="text-amber-800 italic">"Formar Tripulación"</p>
        </div>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-amber-800 rounded-lg shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-4 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            Registro de Tripulación
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-amber-900 font-semibold mb-1">Nombre de la Tripulación</label>
              <input
                className="w-full border-2 border-amber-700 rounded px-3 py-2 bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Sombrero de Paja"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
              {fieldErrors.teamName && <div className="text-red-700 text-sm mt-1">{fieldErrors.teamName}</div>}
            </div>
            <div>
              <label className="block text-amber-900 font-semibold mb-1">Correo Electrónico</label>
              <input
                className="w-full border-2 border-amber-700 rounded px-3 py-2 bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
                type="email"
                placeholder="capitan@tripulacion.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {fieldErrors.email && <div className="text-red-700 text-sm mt-1">{fieldErrors.email}</div>}
            </div>
            <div>
              <label className="block text-amber-900 font-semibold mb-1">Contraseña</label>
              <input
                className="w-full border-2 border-amber-700 rounded px-3 py-2 bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-orange-600"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && !fieldErrors.email && !fieldErrors.teamName && <div className="text-red-700 bg-red-100 border border-red-400 rounded p-2 text-sm">{error}</div>}
            <button
              className="bg-gradient-to-r from-green-700 to-green-900 hover:from-green-800 hover:to-green-950 text-white font-bold py-2 px-4 rounded border-2 border-green-950 shadow-lg transition-all disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? '⏳ Zarpar...' : '🏴‍☠️ Registrar Tripulación'}
            </button>
          </form>
          <button
            className="mt-4 w-full text-amber-900 underline hover:text-orange-700 font-semibold"
            onClick={() => navigate('/login')}
          >
            Ya tengo una tripulación
          </button>
        </div>
      </div>
    </div>
  );
}
