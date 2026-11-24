// Regras copiadas do login.js / cadastro.js do site
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(email) {
  const valor = (email || '').trim();
  if (valor === '') return 'Digite seu e-mail.';
  if (!EMAIL_REGEX.test(valor)) return 'Digite um e-mail válido.';
  return null;
}

// Retorno visual enquanto digita: null (vazio) | 'valido' | 'invalido'
export function estadoEmail(email) {
  const valor = (email || '').trim();
  if (valor === '') return null;
  return EMAIL_REGEX.test(valor) ? 'valido' : 'invalido';
}

// Lista de regras (usada na tela de cadastro para mostrar ✓ / ✗)
export function regrasSenha(senha = '') {
  return [
    { texto: 'Pelo menos 6 caracteres', ok: senha.length >= 6 },
    { texto: 'Uma letra maiúscula', ok: /[A-Z]/.test(senha) },
    { texto: 'Uma letra minúscula', ok: /[a-z]/.test(senha) },
    { texto: 'Um número', ok: /[0-9]/.test(senha) },
    { texto: 'Um caractere especial', ok: /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(senha) },
  ];
}

const MENSAGENS_SENHA = [
  'A senha deve ter pelo menos 6 caracteres.',
  'A senha deve conter pelo menos uma letra maiúscula.',
  'A senha deve conter pelo menos uma letra minúscula.',
  'A senha deve conter pelo menos um número.',
  'A senha deve conter pelo menos um caractere especial.',
];

export function validarSenha(senha) {
  if (!senha) return 'Digite sua senha.';
  const falha = regrasSenha(senha).findIndex((r) => !r.ok);
  return falha === -1 ? null : MENSAGENS_SENHA[falha];
}

// Funciona com os códigos do Firebase Auth também (auth/...)
export function mensagemErroAuth(codigo, padrao = 'Algo deu errado. Tente novamente.') {
  const mensagens = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
    'auth/invalid-email': 'Digite um e-mail válido.',
    'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
    'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Libere pop-ups e tente de novo.',
    'auth/unauthorized-domain': 'Este domínio não está autorizado no Firebase (Authentication > Settings > Authorized domains).',
    'auth/operation-not-supported-in-this-environment': 'Login com Google ainda não está disponível no app.',
    'google/play-services-indisponivel': 'Atualize o Google Play Services para entrar com o Google.',
    'permission-denied': 'Sem permissão. Verifique as regras do Firestore.',
  };
  return mensagens[codigo] || padrao;
}

const CREDENCIAIS_INVALIDAS = ['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found'];

// Em qual campo do login cada erro aparece (mesma distribuição do login.js do site).
// `credenciais` é um erro dos dois campos juntos: a mensagem fica no e-mail e os dois tremem.
export function errosDoLogin(codigo) {
  if (CREDENCIAIS_INVALIDAS.includes(codigo)) return { credenciais: mensagemErroAuth(codigo) };
  if (codigo === 'auth/too-many-requests') return { senha: mensagemErroAuth(codigo) };
  return { email: mensagemErroAuth(codigo, 'Não foi possível entrar. Tente novamente.') };
}

// Fechar a janela do Google (web) ou a lista de contas (celular) não é erro de verdade
const CANCELAMENTOS = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'google/cancelado'];
export const loginCancelado = (codigo) => CANCELAMENTOS.includes(codigo);

// Barra "Força da Senha" (mesmas faixas e cores do cadastro.js do site)
export function forcaSenha(senha = '') {
  const pontos = regrasSenha(senha).filter((r) => r.ok).length;
  if (pontos <= 1) return { largura: 20, texto: 'Muito Fraca', cor: '#ef4444' };
  if (pontos === 2) return { largura: 40, texto: 'Fraca', cor: '#f97316' };
  if (pontos === 3) return { largura: 60, texto: 'Média', cor: '#eab308' };
  if (pontos === 4) return { largura: 80, texto: 'Boa', cor: '#3d82f6' };
  return { largura: 100, texto: 'Forte', cor: '#22c55e' };
}

export const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
