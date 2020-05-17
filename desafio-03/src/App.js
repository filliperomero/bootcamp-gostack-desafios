import React, { useState, useEffect } from "react";
import api from './services/api'

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([])

  async function getRepositories() {
    try {
      const repos = await api.get('/repositories');

      setRepositories(repos.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRepositories()
  }, [])

  async function handleAddRepository() {
    try {
      const repo = {
        url: "https://github.com/filliperomero",
        title: "Fillipe",
        techs: ["React", "Node.js"],
      }

      const res = await api.post('/repositories', repo)

      setRepositories([...repositories, res.data])
    } catch (error) {
      console.log(error)
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`/repositories/${id}`);

      const newRepositories = repositories.filter(r => r.id !== id)

      setRepositories(newRepositories)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        { repositories.length > 0 && repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
