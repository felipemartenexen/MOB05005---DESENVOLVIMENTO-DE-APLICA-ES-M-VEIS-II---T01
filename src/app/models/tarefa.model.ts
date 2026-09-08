/**
 * Modelo de uma tarefa do app TODO.
 */
export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  concluida: boolean;
  criadaEm: string;
  atualizadaEm: string;
}

/** Dados aceitos na criacao de uma tarefa (o restante e gerado pelo servico). */
export type NovaTarefa = Pick<Tarefa, 'titulo' | 'descricao'>;

/** Campos que podem ser alterados em uma atualizacao (UPDATE). */
export type AtualizacaoTarefa = Partial<Pick<Tarefa, 'titulo' | 'descricao' | 'concluida'>>;

/** Filtro aplicado na listagem. */
export type FiltroTarefa = 'todas' | 'pendentes' | 'concluidas';
