import AsyncStorage from '@react-native-async-storage/async-storage';

const chave = (uid) => `taskflow:${uid}:perfil`;

// Formato igual ao do site: { displayName, photo }
export async function obterPerfil(uid) {
  const bruto = await AsyncStorage.getItem(chave(uid));
  return bruto ? JSON.parse(bruto) : null;
}

export async function salvarPerfil(uid, perfil) {
  await AsyncStorage.setItem(chave(uid), JSON.stringify(perfil));
}
