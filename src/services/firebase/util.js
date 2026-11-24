// Offline, o Firestore guarda a gravação numa fila e só confirma quando a internet volta.
// Sem isto a tela ficaria "salvando" para sempre. Passado o prazo seguimos em frente
// (a gravação continua na fila e sincroniza sozinha). Erros reais (ex.: permissão) ainda rejeitam.
export function comTimeout(promessa, ms = 4000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    promessa.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
}

// Firestore não aceita `undefined`; o id vai no nome do documento, não nos dados.
export function limpar(dados) {
  const saida = {};
  Object.keys(dados).forEach((k) => {
    if (k !== 'id' && dados[k] !== undefined) saida[k] = dados[k];
  });
  return saida;
}
