// Coleção no Firestore: usuarios/{uid}/{nome}/{id}
// Mesma "forma" do colecaoLocal.js: observar / criar / atualizar / excluir.
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import { comTimeout, limpar } from './util';

// `padroes` completa campos que documentos antigos (ou criados em outro lugar) não têm
export function criarColecaoFirebase(nome, padroes = {}) {
  const colecao = (uid) => collection(db, 'usuarios', uid, nome);
  const documento = (uid, id) => doc(db, 'usuarios', uid, nome, id);

  return {
    // Tempo real: o que for criado no site aparece aqui (e vice-versa)
    observar(uid, callback, onErro) {
      return onSnapshot(
        colecao(uid),
        (snap) => {
          const lista = snap.docs.map((d) => ({ ...padroes, ...d.data(), id: d.id }));
          lista.sort((a, b) => (a.criadoEm || 0) - (b.criadoEm || 0));
          callback(lista);
        },
        (erro) => {
          console.error(`Erro ao ler "${nome}":`, erro);
          if (onErro) onErro(erro);
        },
      );
    },
    async criar(uid, dados) {
      const novo = doc(colecao(uid));
      await comTimeout(setDoc(novo, { ...limpar(dados), criadoEm: Date.now() }));
      return novo.id;
    },
    async atualizar(uid, id, dados) {
      await comTimeout(updateDoc(documento(uid, id), limpar(dados)));
    },
    async excluir(uid, id) {
      await comTimeout(deleteDoc(documento(uid, id)));
    },
  };
}
