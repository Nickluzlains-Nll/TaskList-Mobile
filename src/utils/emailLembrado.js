import AsyncStorage from '@react-native-async-storage/async-storage';

// Mesma chave do localStorage do site ("email"). Só o e-mail é guardado, nunca a senha.
const CHAVE = 'email';

export const lerEmailLembrado = () => AsyncStorage.getItem(CHAVE);
export const lembrarEmail = (email) => AsyncStorage.setItem(CHAVE, email);
export const esquecerEmail = () => AsyncStorage.removeItem(CHAVE);
