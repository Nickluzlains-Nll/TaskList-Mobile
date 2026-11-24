import { parseDueDate } from './datas';

export const PRIORIDADES = { low: 'Baixa', medium: 'Média', high: 'Alta' };

export function tarefasVencidas(tarefas, agora) {
  return tarefas.filter((t) => {
    if (t.completed || !t.dueDate) return false;
    const d = parseDueDate(t.dueDate);
    return !!d && d.getTime() < agora;
  });
}

// Mesmas regras do matchesView() do home.js
export function pertenceAVisao(t, visao, agora) {
  if (visao === 'completed') return !!t.completed;
  if (visao.startsWith('folder:')) return t.folderId === visao.slice(7);
  if (t.completed) return false;
  if (visao === 'inbox') return false;
  if (visao === 'today') return !t.folderId;
  if (visao === 'week') {
    const d = parseDueDate(t.dueDate);
    if (!d) return false;
    const inicio = new Date(agora);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 7);
    return d >= inicio && d < fim;
  }
  return false;
}

export function detalhesVisao(visao, pastas) {
  if (visao.startsWith('folder:')) {
    const pasta = pastas.find((p) => p.id === visao.slice(7));
    if (pasta) return { titulo: pasta.name, descricao: 'Tarefas ativas nesta pasta' };
  }
  return (
    {
      today: { titulo: 'Meu Dia', descricao: 'Suas tarefas do dia a dia' },
      inbox: { titulo: 'Caixa de Entrada', descricao: 'Avisos de tarefas vencidas' },
      week: { titulo: 'Próximos 7 Dias', descricao: 'Tarefas com vencimento nos próximos sete dias' },
      completed: { titulo: 'Concluídos', descricao: 'Tarefas que você já concluiu' },
    }[visao] || { titulo: 'Meu Dia', descricao: 'Tarefas com vencimento hoje' }
  );
}

// Mesmas contas do getTaskStats() do site
export function estatisticasTarefas(tarefas, agora) {
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.completed).length;

  return {
    total,
    concluidas,
    pendentes: total - concluidas,
    atrasadas: tarefasVencidas(tarefas, agora).length,
    taxaConclusao: total ? Math.round((concluidas / total) * 100) : 0,
  };
}

export function descreverProgresso({ total, concluidas }) {
  if (total === 0) return 'Crie sua primeira tarefa para acompanhar o progresso.';
  if (concluidas === 0) return 'Nenhuma tarefa concluída ainda.';
  if (concluidas === total) return 'Todas as tarefas concluídas.';
  return `${concluidas} de ${total} tarefas concluídas.`;
}
