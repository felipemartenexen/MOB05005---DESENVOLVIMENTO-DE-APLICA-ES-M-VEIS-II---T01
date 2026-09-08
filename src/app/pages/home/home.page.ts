import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonBadge,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, checkmarkDoneOutline } from 'ionicons/icons';

import { FiltroTarefa, Tarefa } from '../../models/tarefa.model';
import { TarefaService } from '../../services/tarefa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [
    DatePipe,
    FormsModule,
    IonBadge,
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage {
  private readonly tarefaService = inject(TarefaService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  /** Texto digitado no campo de nova tarefa. */
  readonly novoTitulo = signal('');

  /** Filtro selecionado no segmento. */
  readonly filtro = signal<FiltroTarefa>('todas');

  /** Lista exibida na tela, ja filtrada. */
  readonly tarefasVisiveis = computed<Tarefa[]>(() => {
    const todas = this.tarefaService.tarefas();
    const filtro = this.filtro();

    if (filtro === 'pendentes') return todas.filter((tarefa) => !tarefa.concluida);
    if (filtro === 'concluidas') return todas.filter((tarefa) => tarefa.concluida);

    return todas;
  });

  readonly totalPendentes = this.tarefaService.totalPendentes;
  readonly totalConcluidas = this.tarefaService.totalConcluidas;

  constructor() {
    addIcons({ addOutline, createOutline, trashOutline, checkmarkDoneOutline });
  }

  // ------------------------------------------------------------------ CREATE
  /** Adiciona a tarefa digitada no campo de texto. */
  async adicionarTarefa(): Promise<void> {
    const titulo = this.novoTitulo().trim();

    if (titulo.length < 2) {
      await this.mostrarToast('Digite um titulo com pelo menos 2 caracteres.', 'warning');
      return;
    }

    this.tarefaService.criar({ titulo, descricao: '' });
    this.novoTitulo.set('');

    await this.mostrarToast('Tarefa adicionada.', 'success');
  }

  // ------------------------------------------------------------------ UPDATE
  /** Abre um alerta com o titulo atual preenchido e grava a alteracao. */
  async editarTarefa(tarefa: Tarefa): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Editar tarefa',
      subHeader: 'Altere o titulo e a descricao',
      inputs: [
        {
          name: 'titulo',
          type: 'text',
          value: tarefa.titulo,
          placeholder: 'Titulo da tarefa',
        },
        {
          name: 'descricao',
          type: 'textarea',
          value: tarefa.descricao,
          placeholder: 'Descricao (opcional)',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (dados: { titulo: string; descricao: string }) => {
            const titulo = (dados.titulo ?? '').trim();

            if (titulo.length < 2) {
              void this.mostrarToast('O titulo precisa ter pelo menos 2 caracteres.', 'warning');
              return false;
            }

            const atualizou = this.tarefaService.atualizar(tarefa.id, {
              titulo,
              descricao: dados.descricao ?? '',
            });

            void this.mostrarToast(
              atualizou ? 'Tarefa atualizada.' : 'Tarefa nao encontrada.',
              atualizou ? 'success' : 'danger'
            );

            return true;
          },
        },
      ],
    });

    await alerta.present();
  }

  /** Marca ou desmarca a tarefa como concluida. */
  alternarConclusao(tarefa: Tarefa): void {
    this.tarefaService.alternarConclusao(tarefa.id);
  }

  // ------------------------------------------------------------------ DELETE
  /** Pede confirmacao antes de remover a tarefa. */
  async excluirTarefa(tarefa: Tarefa): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Excluir tarefa',
      message: `Deseja realmente excluir "${tarefa.titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            const removeu = this.tarefaService.excluir(tarefa.id);
            void this.mostrarToast(
              removeu ? 'Tarefa excluida.' : 'Tarefa nao encontrada.',
              removeu ? 'medium' : 'danger'
            );
          },
        },
      ],
    });

    await alerta.present();
  }

  /** Remove de uma vez todas as tarefas concluidas. */
  async limparConcluidas(): Promise<void> {
    const total = this.totalConcluidas();

    if (total === 0) {
      await this.mostrarToast('Nao ha tarefas concluidas para remover.', 'warning');
      return;
    }

    const removidas = this.tarefaService.excluirConcluidas();
    await this.mostrarToast(`${removidas} tarefa(s) removida(s).`, 'medium');
  }

  // ------------------------------------------------------------------- APOIO
  alterarFiltro(valor: string | number | undefined): void {
    this.filtro.set((valor as FiltroTarefa) ?? 'todas');
  }

  identificarTarefa(_indice: number, tarefa: Tarefa): string {
    return tarefa.id;
  }

  private async mostrarToast(mensagem: string, cor: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 1800,
      color: cor,
      position: 'bottom',
    });

    await toast.present();
  }
}
