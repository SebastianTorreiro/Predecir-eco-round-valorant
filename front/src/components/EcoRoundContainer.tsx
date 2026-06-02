import React, { useState } from 'react';
import { EcoRoundForm } from './EcoRoundForm';
import type { EcoRoundInput, EcoRoundOutput } from '../types/prediction';
import './EcoRound.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const EcoRoundContainer: React.FC = () => {
  
  const [teamCredits, setTeamCredits] = useState<number>(3000);
  const [firstBloodTime, setFirstBloodTime] = useState<number>(10.0);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EcoRoundOutput | null>(null);

  // 2. Fetch function to Python FastAPI server
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

  // Determine indicator classes based on victory or defeat
  const isWinPrediction = result ? result.prediction === 1 : false;
  const percentage = result ? (result.probability * 100).toFixed(1) : '0';

  return (
    <div className="eco-predictor-container">
      {/* Header Section */}
      <header className="eco-header">
        <h1>
          Valorant Eco-Round <span>Predictor</span>
        </h1>
        <p className="eco-subtitle">Analizador Táctico de Probabilidad de Victoria</p>
      </header>

      {/* Main UI Layout grid */}
      <div className="eco-grid">
        {/* Left Column: Dumb Presentational Form */}
        <EcoRoundForm
          teamCredits={teamCredits}
          firstBloodTime={firstBloodTime}
          setTeamCredits={setTeamCredits}
          setFirstBloodTime={setFirstBloodTime}
          onSubmit={handleSubmit}
          isLoading={loading}
        />

        {/* Right Column: Dynamic Status/Results Panel */}
        <div className="results-wrapper">
          {/* Card with dynamic border color depending on prediction */}
          <div
            className={`eco-card ${
              result ? (isWinPrediction ? 'glow-green' : 'glow-red') : ''
            }`}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <h2 className="eco-card-title">Resultado de Simulación</h2>

            {/* Error State */}
            {error && (
              <div className="error-box">
                <div className="error-title">Fallo de Conexión</div>
                <div className="error-msg">{error}</div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="val-loader">
                <div className="scan-line"></div>
                <div className="loading-text">Corriendo Regresión...</div>
              </div>
            )}

            {/* Initial / Empty State */}
            {!loading && !error && !result && (
              <div className="placeholder-results">
                <div className="placeholder-icon">⌬</div>
                <p>Ingresa los datos tácticos a la izquierda y presiona "Predecir" para calcular la probabilidad de victoria.</p>
              </div>
            )}

            {/* Success Results State */}
            {!loading && !error && result && (
              <div className="result-card">
                <div className={`outcome-badge ${isWinPrediction ? 'win' : 'lose'}`}>
                  {isWinPrediction ? 'Victoria' : 'Derrota'}
                </div>

                <div className="probability-container">
                  <div className="probability-label">
                    <span>Probabilidad de ganar</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="probability-bar-bg">
                    <div
                      className={`probability-bar-fill ${isWinPrediction ? 'win' : 'lose'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tactical breakdown explanation */}
                <p className="result-explanation">
                  Basado en una regresión logística entrenada con partidas competitivas, el equipo tiene un{' '}
                  <strong>{percentage}%</strong> de probabilidad de ganar el round al comenzar con{' '}
                  <strong>{teamCredits.toLocaleString()} ¤</strong> de créditos totales y ocurrir la primera
                  baja a los <strong>{firstBloodTime.toFixed(1)} segundos</strong>.
                </p>

                {/* Valorant styling radar/hud decoration */}
                <div className="radar-graph-placeholder">
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
