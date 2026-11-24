import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ModalBase, { AcoesModal } from './ModalBase';
import { Rotulo, Entrada, Botao, BotaoTexto, Avatar } from './ui';
import { assetParaDataUrl } from '../../utils/imagem';

export default function ModalPerfil({ visivel, perfil, onSalvar, onFechar }) {
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!visivel) return;
    setNome(perfil.displayName);
    setFoto(perfil.photo || '');
    setErro('');
  }, [visivel, perfil]);

  async function escolherFoto() {
    setErro('');
    try {
      const r = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1,
      });
      if (r.canceled) return;
      setFoto(await assetParaDataUrl(r.assets[0]));
    } catch (e) {
      setErro(e.message || 'Não foi possível abrir esta imagem.');
    }
  }

  function enviar() {
    const n = nome.trim();
    if (!n) return setErro('Informe seu nome de exibição.');
    onSalvar({ displayName: n, photo: foto });
  }

  return (
    <ModalBase visivel={visivel} onFechar={onFechar} eyebrow="CONTA PESSOAL" titulo="Editar perfil">
      <View style={s.previa}>
        <Avatar nome={nome} foto={foto} tamanho={64} fonte={24} />
        <View style={{ flex: 1 }}>
          <Text style={s.previaTitulo}>Sua foto de perfil</Text>
          <Text style={s.previaTxt}>Escolha uma imagem JPG, PNG ou WebP.</Text>
        </View>
      </View>
      <View style={s.fotoAcoes}>
        <Botao tipo="secundario" titulo="Escolher foto" onPress={escolherFoto} />
        <BotaoTexto titulo="Remover foto" onPress={() => setFoto('')} />
      </View>

      <Rotulo>Nome de exibição</Rotulo>
      <Entrada value={nome} onChangeText={setNome} maxLength={60} />

      {erro ? <Text style={s.erro}>{erro}</Text> : null}

      <AcoesModal>
        <Botao tipo="secundario" titulo="Cancelar" onPress={onFechar} />
        <Botao titulo="Salvar perfil" onPress={enviar} />
      </AcoesModal>
    </ModalBase>
  );
}

const s = StyleSheet.create({
  previa: { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 5 },
  previaTitulo: { color: '#fff', fontSize: 13, fontWeight: '700' },
  previaTxt: { color: '#9ca3af', fontSize: 12, lineHeight: 18, marginTop: 4 },
  fotoAcoes: { flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 3, marginBottom: 7 },
  erro: { color: '#fca5a5', fontSize: 12, marginTop: 2 },
});
