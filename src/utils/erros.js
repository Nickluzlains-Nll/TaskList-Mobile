// Mesmas mensagens do showSaveError() e do onError do startListeners() no home.js do site
const MENSAGENS = {
  salvar: {
    permissao: 'Sem permissão para salvar. Verifique as regras do Firestore.',
    conexao: 'Não foi possível salvar no servidor. Verifique sua conexão.',
  },
  ler: {
    permissao: 'Sem permissão para ler seus dados. Verifique as regras do Firestore.',
    conexao: 'Não foi possível carregar seus dados. Verifique sua conexão.',
  },
};

// operacao: 'salvar' | 'ler'
export function mensagemErroDados(erro, operacao) {
  const textos = MENSAGENS[operacao];
  return erro && erro.code === 'permission-denied' ? textos.permissao : textos.conexao;
}
