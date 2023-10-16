'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import styles from './page.module.css'
import HeaderSearch from '@/components/headerSearch/HeaderSearch'

type Info = {
  next: string
  prev: string
}
interface IData {
  info: Info
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

interface IPage {
  next: string
  previous: string
}

const initialValue: ICharacter = { id: 0, name: '', image: '', status: '', species: '', episode: [] }

export default function Home() {
  const [characters, setCharacters] = useState<object[]>([])
  const [selectCharacter, setSelectCharacter] = useState<ICharacter>(initialValue)
  const [episodes, setEpisodes] = useState<IEpisode[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [textSearch, setTextSearch] = useState<string>('')
  const [api, setApi] = useState<string>('https://rickandmortyapi.com/api/character')
  const [page, setPage] = useState<IPage>({ next: '', previous: '' })

  useEffect(() => {
    getCharacters()
  }, [filterStatus, api, textSearch])

  const getCharacters = async () => {
    setSelectCharacter(initialValue)
    try {
      const response: Response = await fetch(api)
      const { results, info }: IData = await response.json()
      const linkNext = info.next ? info.next : ''
      const linkPrevious = info.prev ? info.prev : ''
      setPage({ next: linkNext, previous: linkPrevious })
      if (filterStatus) {
        const filterCharactersByStatus = results.filter((item: any) => item.status === filterStatus)
        if (textSearch) {
          const filterCharactersByName = filterCharactersByStatus.filter((item: any) =>
            item.name.toLowerCase().includes(textSearch.toLocaleLowerCase()),
          )
          return setCharacters(filterCharactersByName)
        }
        return setCharacters(filterCharactersByStatus)
      }
      setCharacters(results)
    } catch (error) {
      console.log('Erro ao exibir os personagens!')
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
          console.log('Erro ao tentar mostrar o personagem')
        }
      }

      setEpisodes(allEpisodes)
    }
    setSelectCharacter(character)
  }

  const handleChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value)
  }

  const handleChangeSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    setTextSearch(text)
    try {
      const response: Response = await fetch(`https://rickandmortyapi.com/api/character/?name=${text}`)
      const { results }: IData = await response.json()
      setApi(response.url)
      setCharacters(results)
    } catch (error) {
      console.log('Erro ao tentar pesquisar personagem!')
    }
  }

  const navigateNextPage = (): void => {
    setApi(page.next)
  }

  const navigatePreviousPage = (): void => {
    setApi(page.previous)
  }

  return (
    <main className={styles.main}>
      <div className={styles.containerList}>
        <h2>Lista de Personagens</h2>
        <HeaderSearch
          select={(event) => handleChangeSelect(event)}
          inputSearch={(event) => handleChangeSearch(event)}
        />
        {characters && characters.length > 0 ? (
          <div>
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
            <div className={styles.containerBtn}>
              {page.previous && <button onClick={navigatePreviousPage}>Anterior</button>}
              {page.next && <button onClick={navigateNextPage}>Próximo</button>}
            </div>
          </div>
        ) : (
          <div>
            <span className={styles.textNotFound}>Nenhum personagem encontrado!</span>
            <div className={styles.containerBtn}>
              {page.previous && <button onClick={navigatePreviousPage}>Anterior</button>}
            </div>
          </div>
        )}
      </div>

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
    </main>
  )
}
