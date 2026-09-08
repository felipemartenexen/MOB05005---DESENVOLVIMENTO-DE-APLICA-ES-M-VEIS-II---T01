# Roteiro do vídeo (2 a 3 minutos)

Grave a tela com o app aberto no navegador em visualização de celular (F12, modo responsivo).

**00:00 — Abertura (15s)**
"Olá, professor. Sou o Felipe, da pós em Desenvolvimento Web e Mobile. Este é o app TODO do módulo de Ionic, agora com o CRUD completo: o módulo trazia Create e Read, e eu implementei o Update e o Delete."

**00:15 — Create e Read (20s)**
Adicione três tarefas: "Fazer compras", "Fazer deveres", "Limpar a casa". Mostre a lista sendo preenchida e o contador de pendentes subindo.

**00:35 — Update pelo botão EDITAR (40s)**
Clique em **EDITAR** na tarefa "Fazer compras". Mostre o alerta abrindo já preenchido, altere para "Fazer compras no mercado", salve e mostre a lista atualizada com a nova data de alteração.
Marque a caixa de seleção de uma tarefa e comente que essa é a segunda forma de update, alterando a situação para concluída.

**01:15 — Delete pelo botão EXCLUIR (30s)**
Clique em **EXCLUIR** em uma tarefa, mostre o alerta de confirmação e confirme. Mostre a tarefa saindo da lista.
Use o botão do cabeçalho para remover todas as concluídas de uma vez.

**01:45 — Persistência (15s)**
Recarregue a página (F5) e mostre que as tarefas continuam lá, salvas no localStorage.

**02:00 — Código (40s)**
Abra `src/app/services/tarefa.service.ts` e mostre os blocos comentados de UPDATE e DELETE.
Abra `src/app/pages/home/home.page.ts` e mostre `editarTarefa()` com o AlertController e `excluirTarefa()` com a confirmação.
Abra `home.page.html` e mostre os dois botões dentro do `ion-item`.

**02:40 — Encerramento (10s)**
"O repositório com o código está no link da entrega, com o README explicando como executar. Obrigado."
