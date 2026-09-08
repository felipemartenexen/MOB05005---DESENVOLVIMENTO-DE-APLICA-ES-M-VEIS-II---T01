import { Injectable, computed, signal } from '@angular/core';
import { AtualizacaoTarefa, FiltroTarefa, NovaTarefa, Tarefa } from '../models/tarefa.model';

const CHAVE_STORAGE = 'todo-ionic-crud:tarefas';

/**
 * Servico responsavel por todas as operacoes do CRUD de tarefas.
 *
 *   C - criar(...)      -> adiciona uma tarefa
 *   R - tarefas()       -> lista as tarefas (signal exposto para o template)
 *   U - atualizar(...)  -> altera titulo, descricao ou situacao de uma tarefa
 *   D - excluir(...)    -> remove uma tarefa
 *
 * A persistencia usa o localStorage do dispositivo, portanto os dados
 * continuam disponiveis depois de fechar e reabrir o aplicativo.
 */
@Injectable({ providedIn: 'root' })
export class TarefaService {
  private readonly _tarefas = signal<Tarefa[]>(this.carregar());

  /** Lista completa de tarefas (somente leitura para os componentes). */
  readonly tarefas = this._tarefas.asReadonly();

  /** Quantidade de tarefas pendentes, usada no cabecalho. */
  readonly totalPendentes = computed(() => this._tarefas().filter((t) => !t.concluida).length);

  /** Quantidade de tarefas concluidas. */
  readonly totalConcluidas = computed(() => this._tarefas().filter((t) => t.concluida).length);

  // ------------------------------------------------------------------ CREATE
  /** Cria uma nova tarefa e devolve o registro gravado. */
  criar({ titulo, descricao }: NovaTarefa): Tarefa {
    const agora = new Date().toISOString();

    const tarefa: Tarefa = {
      id: this.gerarId(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      concluida: false,
      criadaEm: agora,
      atualizadaEm: agora,
    };

    this._tarefas.update((lista) => [tarefa, ...lista]);
    this.salvar();

    return tarefa;
  }

  // -------------------------------------------------------------------- READ
  /** Busca uma tarefa pelo id. */
  buscarPorId(id: string): Tarefa | undefined {
    return this._tarefas().find((tarefa) => tarefa.id === id);
  }

  /** Aplica o filtro selecionado na tela (todas, pendentes ou concluidas). */
  filtrar(filtro: FiltroTarefa): Tarefa[] {
    const lista = this._tarefas();

    if (filtro === 'pendentes') return lista.filter((tarefa) => !tarefa.concluida);
    if (filtro === 'concluidas') return lista.filter((tarefa) => tarefa.concluida);

    return lista;
  }

  // ------------------------------------------------------------------ UPDATE
  /** Atualiza os dados de uma tarefa existente. Retorna false se o id nao existir. */
  atualizar(id: string, dados: AtualizacaoTarefa): boolean {
    let alterou = false;

    this._tarefas.update((lista) =>
      lista.map((tarefa) => {
        if (tarefa.id !== id) return tarefa;

        alterou = true;
        return {
          ...tarefa,
          ...dados,
          titulo: dados.titulo !== undefined ? dados.titulo.trim() : tarefa.titulo,
          descricao: dados.descricao !== undefined ? dados.descricao.trim() : tarefa.descricao,
          atualizadaEm: new Date().toISOString(),
        };
      })
    );

    if (alterou) this.salvar();

    return alterou;
  }

  /** Alterna a situacao concluida/pendente (tambem e uma operacao de update). */
  alternarConclusao(id: string): boolean {
    const tarefa = this.buscarPorId(id);
    if (!tarefa) return false;

    return this.atualizar(id, { concluida: !tarefa.concluida });
  }

  // ------------------------------------------------------------------ DELETE
  /** Remove uma tarefa pelo id. Retorna false se o id nao existir. */
  excluir(id: string): boolean {
    const antes = this._tarefas().length;

    this._tarefas.update((lista) => lista.filter((tarefa) => tarefa.id !== id));

    const removeu = this._tarefas().length < antes;
    if (removeu) this.salvar();

    return removeu;
  }

  /** Remove de uma vez todas as tarefas ja concluidas. */
  excluirConcluidas(): number {
    const removidas = this.totalConcluidas();

    if (removidas > 0) {
      this._tarefas.update((lista) => lista.filter((tarefa) => !tarefa.concluida));
      this.salvar();
    }

    return removidas;
  }

  // ---------------------------------------------------------------- INTERNOS
  private gerarId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private salvar(): void {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(this._tarefas()));
    } catch (erro) {
      console.error('Nao foi possivel salvar as tarefas no localStorage.', erro);
    }
  }

  private carregar(): Tarefa[] {
    try {
      const bruto = localStorage.getItem(CHAVE_STORAGE);
      if (!bruto) return [];

      const lista = JSON.parse(bruto) as Tarefa[];
      return Array.isArray(lista) ? lista : [];
    } catch (erro) {
      console.error('Nao foi possivel ler as tarefas do localStorage.', erro);
      return [];
    }
  }
}
