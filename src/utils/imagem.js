// Celular: reduz a foto para no máx. 512px e salva em JPEG (mesmo resultado do canvas no site)
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

const LADO_MAXIMO = 512;
const QUALIDADE_JPEG = 0.82;
// Mesmo limite das regras do Firestore (isValidProfile): conta o texto inteiro, prefixo incluso
const TAMANHO_MAXIMO_FOTO = 900000;

function tamanhoReduzido({ width, height }) {
  if (Math.max(width, height) <= LADO_MAXIMO) return null;
  return width >= height
    ? { width: LADO_MAXIMO, height: null }
    : { width: null, height: LADO_MAXIMO };
}

export async function assetParaDataUrl(asset) {
  if (!asset || !asset.uri) throw new Error('Não foi possível abrir esta imagem.');

  const contexto = ImageManipulator.manipulate(asset.uri);
  const tamanho = tamanhoReduzido(asset);
  if (tamanho) contexto.resize(tamanho);

  const imagem = await contexto.renderAsync();
  const { base64 } = await imagem.saveAsync({ format: SaveFormat.JPEG, compress: QUALIDADE_JPEG, base64: true });

  if (!base64) throw new Error('Não foi possível abrir esta imagem.');
  const foto = `data:image/jpeg;base64,${base64}`;
  if (foto.length > TAMANHO_MAXIMO_FOTO) throw new Error('A imagem é muito grande. Escolha uma menor.');
  return foto;
}
