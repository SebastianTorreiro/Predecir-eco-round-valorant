import React from 'react';
import type { EcoRoundInput } from '../types/prediction';

interface EcoRoundFormProps {
  data: EcoRoundInput;
  onChange: (newData: EcoRoundInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const EcoRoundForm: React.FC<EcoRoundFormProps> = ({
  data,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const handleCreditsChange = (val: number) => {
    // Clamp values between 0 and 45000
    const team_credits = Math.max(0, Math.min(45000, val));
    onChange({ ...data, team_credits });
  };

  const handleFirstBloodChange = (val: number) => {
    // Clamp values between 0 and 100
    const first_blood_time = Math.max(0, Math.min(100, Number(val.toFixed(1))));
    onChange({ ...data, first_blood_time });
  };

  // Preset Configurations for Valorant Team Credits
  const creditPresets = [
    { label: 'Pistol Round', value: 4000, desc: '800/player' },
    { label: 'Eco / Half Buy', value: 12500, desc: '2500/player' },
    { label: 'Force Buy', value: 17500, desc: '3500/player' },
    { label: 'Full Buy', value: 20000, desc: '4000/player' },
    { label: 'Max Credits', value: 45000, desc: '9000/player' },
  ];

  // Preset Configurations for First Blood Time
  const timePresets = [
    { label: 'Pistol Duel', value: 5.0, desc: 'Early clash (5s)' },
    { label: 'Mid Control', value: 25.0, desc: 'Default play (25s)' },
    { label: 'Late Exec', value: 65.0, desc: 'Late execute (65s)' },
  ];

  return (
    <form onSubmit={onSubmit} className="eco-card">
      <h2 className="eco-card-title">Datos del Round</h2>

      {/* Team Credits Input Section */}
      <div className="form-group">
        <div className="form-label-container">
          <label htmlFor="team_credits" className="form-label">
            Créditos del Equipo (Team Credits)
          </label>
          <span className="form-value-badge">
            {data.team_credits.toLocaleString()} ¤
          </span>
        </div>
        <div className="input-row">
          <input
            id="team_credits"
            type="number"
            min="0"
            max="45000"
            step="100"
            value={data.team_credits}
            onChange={(e) => handleCreditsChange(Number(e.target.value))}
            className="number-input"
            disabled={isLoading}
            required
          />
          <input
            type="range"
            min="0"
            max="45000"
            step="100"
            value={data.team_credits}
            onChange={(e) => handleCreditsChange(Number(e.target.value))}
            className="range-slider"
            disabled={isLoading}
          />
        </div>
        <p className="form-desc">
          Suma total de los créditos de los 5 jugadores del equipo. Rango válido: 0 a 45,000 ¤.
        </p>
        
        <div className="presets-container">
          {creditPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-btn"
              onClick={() => handleCreditsChange(preset.value)}
              disabled={isLoading}
              title={preset.desc}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* First Blood Time Input Section */}
      <div className="form-group">
        <div className="form-label-container">
          <label htmlFor="first_blood_time" className="form-label">
            Tiempo de Primera Sangre (First Blood Time)
          </label>
          <span className="form-value-badge">
            {data.first_blood_time.toFixed(1)} s
          </span>
        </div>
        <div className="input-row">
          <input
            id="first_blood_time"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={data.first_blood_time}
            onChange={(e) => handleFirstBloodChange(Number(e.target.value))}
            className="number-input"
            disabled={isLoading}
            required
          />
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={data.first_blood_time}
            onChange={(e) => handleFirstBloodChange(Number(e.target.value))}
            className="range-slider"
            disabled={isLoading}
          />
        </div>
        <p className="form-desc">
          Segundo en el que ocurre la primera baja del round. Rango válido: 0 a 100 segundos.
        </p>

        <div className="presets-container">
          {timePresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-btn"
              onClick={() => handleFirstBloodChange(preset.value)}
              disabled={isLoading}
              title={preset.desc}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="val-btn"
        disabled={isLoading || data.team_credits < 0 || data.first_blood_time < 0}
      >
        {isLoading ? 'Analizando...' : 'Predecir Resultado'}
      </button>
    </form>
  );
};
