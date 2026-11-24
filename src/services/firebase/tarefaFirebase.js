// Operações de tarefa com regra própria, além do criar/atualizar/excluir genérico.
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { comTimeout } from './util';

// Concluir grava quando foi concluída (o site ordena "Concluídas" por esse campo); reabrir limpa.
export async function definirConcluida(uid, tarefaId, concluida) {
  await comTimeout(updateDoc(doc(db, 'usuarios', uid, 'tarefas', tarefaId), {
    completed: concluida,
    concluidoEm: concluida ? Date.now() : null,
  }));
}
