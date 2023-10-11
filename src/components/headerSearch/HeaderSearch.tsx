import { ChangeEvent } from 'react'
import styles from './headerSearch.module.css'

interface IProps {
  select: (e: ChangeEvent<HTMLSelectElement>) => void
}

const HeaderSearch = ({ select }: IProps) => {
  return (
    <header className={styles.header}>
      <div>
        <input className={styles.inputSearch} type="text" placeholder="Pesquisar" />
        <button className={styles.btnSearch}>Pesquisar</button>
      </div>
      <select className={styles.selectFilter} onChange={(e) => select(e)}>
        <option value={''}>Todos</option>
        <option value={'Alive'}>Vivo</option>
        <option value={'Dead'}>Morto</option>
        <option value={'unknown'}>Desconhecido</option>
      </select>
    </header>
  )
}

export default HeaderSearch
