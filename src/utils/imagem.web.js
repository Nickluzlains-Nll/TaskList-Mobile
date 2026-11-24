// Web: redimensiona para no máx. 512px e salva em JPEG (igual ao home.js do site)
export function assetParaDataUrl(asset) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const escala = Math.min(1, 512 / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * escala));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * escala));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => reject(new Error('Não foi possível abrir esta imagem.'));
    img.src = asset.uri;
  });
}
