# TODO! CRUD — Ionic + Angular

Aplicativo de lista de tarefas construído com **Ionic 8 + Angular 20 (standalone components)**, com o **CRUD completo**: criar, listar, **editar** e **excluir** tarefas.

O app do módulo implementava apenas Create e Read. Esta entrega acrescenta as duas letras que faltavam:

| Operação | Onde aparece no app | Método do serviço |
|---|---|---|
| **C**reate | Campo "Nova tarefa" + botão **Adicionar** | `TarefaService.criar()` |
| **R**ead | Lista da tela principal, com filtros Todas / Pendentes / Concluídas | `TarefaService.tarefas()`, `filtrar()` |
| **U**pdate | Botão **EDITAR** em cada item (abre um alerta com título e descrição) e a caixa de seleção que marca a tarefa como concluída | `TarefaService.atualizar()`, `alternarConclusao()` |
| **D**elete | Botão **EXCLUIR** em cada item (com confirmação) e o botão do cabeçalho que remove todas as concluídas | `TarefaService.excluir()`, `excluirConcluidas()` |

As tarefas ficam salvas no `localStorage`, então continuam lá depois de fechar e reabrir o app.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Ionic CLI (opcional): `npm install -g @ionic/cli`

## Como executar

```bash
# 1. instalar as dependências
npm install

# 2. rodar em modo de desenvolvimento
npm start
# ou, se preferir o CLI do Ionic:
ionic serve
```

O app abre em `http://localhost:4200`. Para ver no formato de celular, abra as ferramentas do desenvolvedor do navegador (F12) e ative a visualização responsiva.

Para gerar a versão de produção:

```bash
npm run build
```

## Estrutura do projeto

```
src/
├── app/
│   ├── app.ts                       # componente raiz (ion-app + ion-router-outlet)
│   ├── app.config.ts                # provideIonicAngular + rotas
│   ├── app.routes.ts                # rota principal apontando para a HomePage
│   ├── models/
│   │   └── tarefa.model.ts          # interface Tarefa e tipos auxiliares
│   ├── services/
│   │   └── tarefa.service.ts        # CRUD completo + persistência no localStorage
│   └── pages/home/
│       ├── home.page.ts             # regras da tela (alertas de edição e exclusão)
│       ├── home.page.html           # lista com os botões EDITAR e EXCLUIR
│       └── home.page.scss           # estilos da tela
├── theme/variables.scss             # cores do tema Ionic
├── styles.scss                      # estilos globais
└── index.html
```

## Como funcionam as duas operações implementadas

### Update (editar)

1. O botão **EDITAR** chama `editarTarefa(tarefa)` na `HomePage`.
2. O método abre um `AlertController` já preenchido com o título e a descrição atuais.
3. Ao confirmar, o handler valida o título (mínimo de 2 caracteres) e chama `TarefaService.atualizar(id, dados)`.
4. O serviço percorre a lista, substitui apenas a tarefa com o id correspondente, grava a nova data em `atualizadaEm` e salva no `localStorage`.
5. Como a lista é um `signal`, a tela se atualiza sozinha, sem nenhum comando extra de recarregamento.

A caixa de seleção ao lado de cada tarefa também é um update: ela chama `alternarConclusao(id)`, que inverte o campo `concluida`.

### Delete (excluir)

1. O botão **EXCLUIR** chama `excluirTarefa(tarefa)`.
2. Um alerta de confirmação é exibido com o título da tarefa, evitando exclusão acidental.
3. Ao confirmar, `TarefaService.excluir(id)` filtra a lista removendo o registro e persiste o resultado.
4. Um toast confirma a operação.

O ícone no canto superior direito remove de uma vez todas as tarefas já concluídas (`excluirConcluidas()`).

## Se você já tem o projeto do módulo com Create e Read

Dá para aproveitar este código sem recriar o app inteiro. São três pontos:

1. **Serviço**: copie os métodos `atualizar()`, `alternarConclusao()`, `excluir()` e `excluirConcluidas()` de `src/app/services/tarefa.service.ts` para o serviço que já guarda as tarefas.
2. **Template**: adicione os dois `ion-button` com `slot="end"` dentro do `ion-item` da lista, chamando `editarTarefa(tarefa)` e `excluirTarefa(tarefa)`.
3. **Página**: copie os métodos `editarTarefa()` e `excluirTarefa()` de `home.page.ts`, junto com a injeção de `AlertController` e `ToastController`.

Se o seu projeto usa NgModules (padrão do Ionic 4/5, como no material da disciplina) em vez de standalone components, a diferença é apenas onde os componentes são declarados: em vez do array `imports` no `@Component`, deixe o `IonicModule` importado no `app.module.ts` ou no módulo da página. A lógica do CRUD é idêntica.

## Rodar no celular (opcional)

A tarefa pode ser demonstrada no navegador, mas se quiser gerar o app nativo:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npm run build
npx cap add android
npx cap open android
```

## Tecnologias

- Ionic Framework 8
- Angular 20 com standalone components, signals e o novo control flow (`@if` / `@for`)
- TypeScript 5.9
- Ionicons 7
- Persistência com `localStorage`
