import React, { useState } from 'react';
import type { EcoRoundOutput } from '../types/prediction';
import styles from './EcoRound.module.css';
import { EcoRoundForm } from './EcoRoundForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const EcoRoundContainer: React.FC = () => {
  
  const [teamCredits, setTeamCredits] = useState<number>(3000);
  const [firstBloodTime, setFirstBloodTime] = useState<number>(10.0);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EcoRoundOutput | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/predict/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({"team_credits":teamCredits, "first_blood_time":firstBloodTime}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Error en el servidor: ${response.status} ${response.statusText}`
        );
      }

      const data: EcoRoundOutput = await response.json();
      setResult(data);
    } catch (err) {
      if(err instanceof Error){
        console.error('Fetch error:', err);
        setError(err.message)
      }else{
        setError(String(err))
      }
    } finally {
      setLoading(false);
    }
  };

  const isWinPrediction = result ? result.prediction === 1 : false;
  const percentage = result ? (result.probability * 100).toFixed(1) : '0';

  return (
    <div className={styles['eco-predictor-container']}>
      <header className={styles['eco-header']}>
        <h1>
          Valorant Eco-Round <span>Predictor</span>
        </h1>
        <p className={styles['eco-subtitle']}>Analizador Táctico de Probabilidad de Victoria</p>
      </header>

      <div className={styles['eco-grid']}>
        <EcoRoundForm
          teamCredits={teamCredits}
          firstBloodTime={firstBloodTime}
          setTeamCredits={setTeamCredits}
          setFirstBloodTime={setFirstBloodTime}
          onSubmit={handleSubmit}
          isLoading={loading}
        />

        <div className={styles['results-wrapper']}>
          <div
            className={`${styles['eco-card']} ${
              result ? (isWinPrediction ? styles['glow-green'] : styles['glow-red']) : ''
            }`}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <h2 className={styles['eco-card-title']}>Resultado de Simulación</h2>

            {error && (
              <div className={styles['error-box']}>
                <div className={styles['error-title']}>Fallo de Conexión</div>
                <div className={styles['error-msg']}>{error}</div>
              </div>
            )}

            {loading && (
              <div className={styles['val-loader']}>
                <div className={styles['scan-line']}></div>
                <div className={styles['loading-text']}>Corriendo Regresión...</div>
              </div>
            )}

            {!loading && !error && !result && (
              <div className={styles['placeholder-results']}>
                <div className={styles['placeholder-icon']}>⌬</div>
                <p>Ingresa los datos tácticos a la izquierda y presiona "Predecir" para calcular la probabilidad de victoria.</p>
              </div>
            )}

            {!loading && !error && result && (
              <div className={styles['result-card']}>
                <div className={`${styles['outcome-badge']} ${isWinPrediction ? styles.win : styles.lose}`}>
                  {isWinPrediction ? 'Victoria' : 'Derrota'}
                </div>

                <div className={styles['probability-container']}>
                  <div className={styles['probability-label']}>
                    <span>Probabilidad de ganar</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className={styles['probability-bar-bg']}>
                    <div
                      className={`${styles['probability-bar-fill']} ${isWinPrediction ? styles.win : styles.lose}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                <p className={styles['result-explanation']}>
                  Basado en una regresión logística entrenada con partidas competitivas, el equipo tiene un{' '}
                  <strong>{percentage}%</strong> de probabilidad de ganar el round al comenzar con{' '}
                  <strong>{teamCredits.toLocaleString()} ¤</strong> de créditos totales y ocurrir la primera
                  baja a los <strong>{firstBloodTime.toFixed(1)} segundos</strong>.
                </p>

                <div className={styles['radar-graph-placeholder']}>
                  [ System Status: Active // model_type: logistic_regression ]
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
