import { useState, useEffect } from "react";

function App() {
  const [status, setStatus] = useState<"inicial" | "playing" | "finished">("inicial");
  const [timer, setTimer] = useState<number>(0);
  const [position, setPosition] = useState<[number, number]>([
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100)
  ]);

  const [score, setScore] = useState<number>(0);
  const [bestScores, setBestScores] = useState<number[]>([]);

  function handleClick() {
    setScore(prevScore => {
      const newScore = prevScore + 1;
      if (newScore === 9) {
        setStatus('finished');
        saveScore(newScore);
      }
      return newScore;
    });

    setPosition([
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100)
    ]);
  }

  function handleReset() {
    setScore(0);
    setTimer(0);
    setStatus('inicial');
  }

  function saveScore(newScore: number) {
    const scores = [...bestScores, newScore];
    scores.sort((a, b) => b - a);
    const updatedScores = scores.slice(0, 5);
    setBestScores(updatedScores);
    localStorage.setItem('bestScores', JSON.stringify(updatedScores));
  }

  useEffect(() => {
    const storedScores = localStorage.getItem('bestScores');
    if (storedScores) {
      const parsedScores = JSON.parse(storedScores);
      setBestScores(parsedScores);
    }
  }, []);

  useEffect(() => {
    let interval: number;
    if (status === "playing") {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <main>
      <header>
        <h1>{Math.round((timer / 10) * 100) / 100} segundos</h1>
      </header>
      <section style={{ position: "relative", marginRight: 48, marginBottom: 48 }}>
        {status === "playing" && (
          <figure
            onClick={handleClick}
            style={{ position: "absolute", top: `${position[0]}%`, left: `${position[1]}%` }}
          />
        )}
      </section>
      <footer>
        {status === "inicial" && <button onClick={() => setStatus('playing')}>Jugar</button>}
        {status === "playing" && <button onClick={() => setStatus('finished')}>Pausar</button>}
        {status === "finished" && <button onClick={handleReset}>Reiniciar</button>}
      </footer>
      <section>
        <h2>Mejores puntajes:</h2>
        {bestScores.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Puesto</th>
                <th>Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {bestScores.map((score, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay puntajes registrados.</p>
        )}
      </section>
    </main>
  );
}

export default App;


