'use client'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

interface IData {
  info: object
  results: object[]
}

interface ICharacter {
  id: number
  name: string
  image: string
  status: string
  species: string
  episode: string[]
}

interface IEpisode {
  name: string
  episode: string
}

export default function Home() {
  const [characters, setCharacters] = useState<object[]>([])
  const [selectCharacter, setSelectCharacter] = useState<ICharacter>()
  const [episodes, setEpisodes] = useState<IEpisode[]>([])

  useEffect(() => {
    getCharacters()
  }, [])

  const getCharacters = async () => {
    try {
      const response: Response = await fetch('https://rickandmortyapi.com/api/character')
      const data: IData = await response.json()
      setCharacters(data.results)
    } catch (error) {
      console.log(error)
    }
  }

  const showCharacter = async (character: ICharacter) => {
    const { episode } = character
    const allEpisodes: IEpisode[] = []
    if (episode) {
      for (let i = 0; i < episode.length; i++) {
        const url = episode[i]

        try {
          const response: Response = await fetch(url)
          const { name, episode } = await response.json()
          allEpisodes.push({ name, episode })
        } catch (error) {
          console.log(error)
        }
      }

      setEpisodes(allEpisodes)
    }
    setSelectCharacter(character)
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {characters.length > 0 && (
          <div className={styles.containerList}>
            <h2>Lista de Personagens</h2>
            {characters.map((character: any) => {
              return (
                <ul onClick={() => showCharacter(character)} className={styles.list} key={character.id}>
                  <li>
                    <img className={styles.image} src={character.image} alt="Foto" />
                  </li>
                  <li className={styles.text}>{character.name}</li>
                </ul>
              )
            })}
          </div>
        )}

        {selectCharacter && (
          <div className={styles.details}>
            <h2>Detalhes do Personagem</h2>
            <div className={styles.containerImage}>
              <img className={styles.image} src={selectCharacter.image} alt="Foto" />
            </div>
            <div className={styles.info}>
              <span>Nome: {selectCharacter.name}</span>
              <span>Status: {selectCharacter.status}</span>
              <span>Espécie: {selectCharacter.species}</span>
              {episodes.length > 0 && (
                <div className={styles.listEpisodes}>
                  <span>Episódios:</span>
                  {episodes.map((ep) => {
                    return (
                      <ul className={styles.list}>
                        <li>
                          Número: {ep.episode} Title: {ep.name}
                        </li>
                      </ul>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
