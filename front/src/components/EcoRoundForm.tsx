import React from 'react';
import styles from './EcoRound.module.css';

interface EcoRoundFormProps {
  firstBloodTime: number
  teamCredits: number
  setTeamCredits: (val: number) => void
  setFirstBloodTime: (val: number) => void
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const EcoRoundForm: React.FC<EcoRoundFormProps> = ({
  firstBloodTime,
  teamCredits,
  setTeamCredits,
  setFirstBloodTime,
  onSubmit,
  isLoading,
}) => {
  const handleCreditsChange = (val: number) => {
    const team_credits = Math.max(0, Math.min(45000, val));
    setTeamCredits(team_credits);
  };

  const handleFirstBloodChange = (val: number) => {
    const first_blood_time = Math.max(0, Math.min(100, Number(val.toFixed(1))));
    setFirstBloodTime(first_blood_time);
  };

  const creditPresets = [
    { label: 'Pistol Round', value: 4000, desc: '800/player' },
    { label: 'Eco / Half Buy', value: 12500, desc: '2500/player' },
    { label: 'Force Buy', value: 17500, desc: '3500/player' },
    { label: 'Full Buy', value: 20000, desc: '4000/player' },
    { label: 'Max Credits', value: 45000, desc: '9000/player' },
  ];

  const timePresets = [
    { label: 'Pistol Duel', value: 5.0, desc: 'Early clash (5s)' },
    { label: 'Mid Control', value: 25.0, desc: 'Default play (25s)' },
    { label: 'Late Exec', value: 65.0, desc: 'Late execute (65s)' },
  ];

  return (
    <form onSubmit={onSubmit} className={styles['eco-card']}>
      <h2 className={styles['eco-card-title']}>Datos del Round</h2>

      <div className={styles['form-group']}>
        <div className={styles['form-label-container']}>
          <label htmlFor="team_credits" className={styles['form-label']}>
            Créditos del Equipo (Team Credits)
          </label>
          <span className={styles['form-value-badge']}>
            {teamCredits.toLocaleString()} ¤
          </span>
        </div>
        <div className={styles['input-row']}>
          <input
            id="team_credits"
            type="number"
            min="0"
            max="45000"
            step="100"
            value={teamCredits}
            onChange={(e) => handleCreditsChange(Number(e.target.value))}
            className={styles['number-input']}
            disabled={isLoading}
            required
          />
          <input
            type="range"
            min="0"
            max="45000"
            step="100"
            value={teamCredits}
            onChange={(e) => handleCreditsChange(Number(e.target.value))}
            className={styles['range-slider']}
            disabled={isLoading}
          />
        </div>
        <p className={styles['form-desc']}>
          Suma total de los créditos de los 5 jugadores del equipo. Rango válido: 0 a 45,000 ¤.
        </p>
        
        <div className={styles['presets-container']}>
          {creditPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={styles['preset-btn']}
              onClick={() => handleCreditsChange(preset.value)}
              disabled={isLoading}
              title={preset.desc}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles['form-group']}>
        <div className={styles['form-label-container']}>
          <label htmlFor="first_blood_time" className={styles['form-label']}>
            Tiempo de Primera Sangre (First Blood Time)
          </label>
          <span className={styles['form-value-badge']}>
            {firstBloodTime.toFixed(1)} s
          </span>
        </div>
        <div className={styles['input-row']}>
          <input
            id="first_blood_time"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={firstBloodTime}
            onChange={(e) => handleFirstBloodChange(Number(e.target.value))}
            className={styles['number-input']}
            disabled={isLoading}
            required
          />
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={firstBloodTime}
            onChange={(e) => handleFirstBloodChange(Number(e.target.value))}
            className={styles['range-slider']}
            disabled={isLoading}
          />
        </div>
        <p className={styles['form-desc']}>
          Segundo en el que ocurre la primera baja del round. Rango válido: 0 a 100 segundos.
        </p>

        <div className={styles['presets-container']}>
          {timePresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={styles['preset-btn']}
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
        className={styles['val-btn']}
        disabled={isLoading || teamCredits < 0 || firstBloodTime < 0}
      >
        {isLoading ? 'Analizando...' : 'Predecir Resultado'}
      </button>
    </form>
  );
};
