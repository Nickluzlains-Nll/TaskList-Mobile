// Operações de pasta que mexem em mais de uma coleção ao mesmo tempo.
import { doc, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { comTimeout } from './util';

// Exclui a pasta e trata as tarefas dela numa única operação atômica (writeBatch),
// como o commitCollections() do site: ou tudo é gravado, ou nada é.
// Antes eram várias gravações em sequência — se uma falhasse no meio,
// sobravam tarefas apontando para uma pasta que não existe mais.
export async function excluirComTarefas(uid, pastaId, tarefaIds, { manterTarefas }) {
  const lote = writeBatch(db);
  tarefaIds.forEach((id) => {
    const tarefa = doc(db, 'usuarios', uid, 'tarefas', id);
    if (manterTarefas) lote.update(tarefa, { folderId: null });
    else lote.delete(tarefa);
  });
  lote.delete(doc(db, 'usuarios', uid, 'pastas', pastaId));
  await comTimeout(lote.commit());
}
