'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import styles from './page.module.css'
import HeaderSearch from '@/components/headerSearch/HeaderSearch'

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

const initialValue: ICharacter = { id: 0, name: '', image: '', status: '', species: '', episode: [] }

export default function Home() {
  const [characters, setCharacters] = useState<object[]>([])
  const [selectCharacter, setSelectCharacter] = useState<ICharacter>(initialValue)
  const [episodes, setEpisodes] = useState<IEpisode[]>([])
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    getCharacters()
  }, [filter])

  const getCharacters = async () => {
    setSelectCharacter(initialValue)
    try {
      const response: Response = await fetch('https://rickandmortyapi.com/api/character')
      const { results }: IData = await response.json()
      if (filter) {
        const filterCharacters = results.filter((item: any) => item.status === filter)
        return setCharacters(filterCharacters)
      }
      setCharacters(results)
    } catch (error) {
      console.log(error)
    }
  }

  const showCharacter = async (character: ICharacter) => {
    const { episode } = character
    const allEpisodes: IEpisode[] = []
    if (episode) {
      for (let i = 0; i < episode.length; i++) {
        const url: string = episode[i]

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

  const handleChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value)
  }

  const handleChangeSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    try {
      const response: Response = await fetch(`https://rickandmortyapi.com/api/character/?name=${text}`)
      const { results }: IData = await response.json()
      setCharacters(results)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {characters.length > 0 && (
          <div className={styles.containerList}>
            <h2>Lista de Personagens</h2>
            <HeaderSearch
              select={(event) => handleChangeSelect(event)}
              inputSearch={(event) => handleChangeSearch(event)}
            />
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

        {selectCharacter!.name !== '' && (
          <div className={styles.details}>
            <h2>Detalhes do Personagem</h2>
            <div className={styles.containerImage}>
              <img className={styles.image} src={selectCharacter!.image} alt="Foto" />
            </div>
            <div className={styles.info}>
              <span>Nome: {selectCharacter!.name}</span>
              <span>Status: {selectCharacter!.status}</span>
              <span>Espécie: {selectCharacter!.species}</span>
              {episodes.length > 0 && (
                <div className={styles.listEpisodes}>
                  <span>Episódios:</span>
                  {episodes.map((ep, i) => {
                    return (
                      <ul className={styles.list} key={i}>
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
