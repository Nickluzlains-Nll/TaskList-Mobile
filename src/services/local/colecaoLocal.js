// Coleção genérica (tarefas, pastas) guardada no aparelho.
// Mesma "forma" que o Firestore: observar / criar / atualizar / excluir.
import AsyncStorage from '@react-native-async-storage/async-storage';

const ouvintes = {};
const chave = (uid, nome) => `taskflow:${uid}:${nome}`;
const gerarId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

async function ler(uid, nome) {
  const bruto = await AsyncStorage.getItem(chave(uid, nome));
  return bruto ? JSON.parse(bruto) : [];
}

async function gravar(uid, nome, lista) {
  const k = chave(uid, nome);
  await AsyncStorage.setItem(k, JSON.stringify(lista));
  (ouvintes[k] || []).forEach((cb) => cb(lista));
}

export function criarColecaoLocal(nome) {
  return {
    // Equivalente ao onSnapshot: devolve uma função para cancelar
    observar(uid, callback) {
      const k = chave(uid, nome);
      ouvintes[k] = ouvintes[k] || new Set();
      ouvintes[k].add(callback);
      ler(uid, nome).then(callback);
      return () => ouvintes[k].delete(callback);
    },
    async criar(uid, dados) {
      const lista = await ler(uid, nome);
      const item = { ...dados, id: gerarId() };
      await gravar(uid, nome, [...lista, item]);
      return item.id;
    },
    async atualizar(uid, id, dados) {
      const lista = await ler(uid, nome);
      await gravar(uid, nome, lista.map((i) => (i.id === id ? { ...i, ...dados } : i)));
    },
    async excluir(uid, id) {
      const lista = await ler(uid, nome);
      await gravar(uid, nome, lista.filter((i) => i.id !== id));
    },
  };
}
