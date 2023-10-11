import { ChangeEvent } from 'react'
import styles from './headerSearch.module.css'

interface IProps {
  select: (event: ChangeEvent<HTMLSelectElement>) => void
  inputSearch: (event: ChangeEvent<HTMLInputElement>) => void
}

const HeaderSearch = ({ select, inputSearch }: IProps) => {
  return (
    <header className={styles.header}>
      <div>
        <input
          className={styles.inputSearch}
          type="text"
          placeholder="Pesquisar"
          onChange={(event) => inputSearch(event)}
        />
        <button className={styles.btnSearch}>Pesquisar</button>
      </div>
      <select className={styles.selectFilter} onChange={(event) => select(event)}>
        <option value={''}>Todos</option>
        <option value={'Alive'}>Vivo</option>
        <option value={'Dead'}>Morto</option>
        <option value={'unknown'}>Desconhecido</option>
      </select>
    </header>
  )
}

export default HeaderSearch
