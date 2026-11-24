// ================================================================
// ÚNICO LUGAR que decide de onde vêm os dados.
// Agora: Firebase (Auth + Firestore), o mesmo projeto do site.
// Os arquivos em ./local ficaram só de referência / uso offline de teste:
// para voltar ao modo local basta trocar estes imports.
// ================================================================
import * as authService from './firebase/authFirebase';
import * as perfilService from './firebase/perfilFirebase';
import { criarColecaoFirebase } from './firebase/colecaoFirebase';
import { excluirComTarefas } from './firebase/pastaFirebase';
import { definirConcluida } from './firebase/tarefaFirebase';

export { authService, perfilService };

// Mesmos nomes de coleção e mesmos valores padrão do site (task-repository.js)
export const tarefaService = {
  ...criarColecaoFirebase('tarefas', {
    description: '', dueDate: '', priority: 'medium', folderId: null, completed: false, concluidoEm: null,
  }),
  definirConcluida,
};
export const pastaService = {
  ...criarColecaoFirebase('pastas', { color: '#3b82f6' }),
  excluirComTarefas,
};
