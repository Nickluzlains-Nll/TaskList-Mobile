import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import ModalBase, { AcoesModal } from './ModalBase';
import { Rotulo, Entrada, Botao } from './ui';

// O site usa <input type="color">; aqui, uma paleta (o azul padrão é o mesmo do site)
const CORES = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#6366f1', '#94a3b8'];

export default function ModalPasta({ visivel, pasta, pastas, onSalvar, onFechar }) {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#3b82f6');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!visivel) return;
    setNome(pasta ? pasta.name : '');
    setCor(pasta ? pasta.color : '#3b82f6');
    setErro('');
  }, [visivel, pasta]);

  function enviar() {
    const n = nome.trim();
    if (!n) return setErro('Informe o nome da pasta.');
    const repetida = pastas.some((p) => p.name.toLowerCase() === n.toLowerCase() && (!pasta || p.id !== pasta.id));
    if (repetida) return setErro('Já existe uma pasta com esse nome.');
    onSalvar({ name: n, color: cor });
  }

  // se a pasta já tinha uma cor fora da paleta, mantém ela como opção
  const paleta = CORES.includes(cor) ? CORES : [cor, ...CORES];

  return (
    <ModalBase visivel={visivel} onFechar={onFechar} eyebrow="ORGANIZAÇÃO" titulo={pasta ? 'Editar pasta' : 'Nova pasta'}>
      <Rotulo>Nome da pasta</Rotulo>
      <Entrada value={nome} onChangeText={setNome} maxLength={50} placeholder="Ex.: Estudos" autoFocus />

      <Rotulo>Cor da pasta</Rotulo>
      <View style={s.paleta}>
        {paleta.map((c) => (
          <Pressable key={c} onPress={() => setCor(c)} style={[s.cor, { backgroundColor: c }, cor === c ? s.corAtiva : null]} />
        ))}
      </View>

      {erro ? <Text style={s.erro}>{erro}</Text> : null}

      <AcoesModal>
        <Botao tipo="secundario" titulo="Cancelar" onPress={onFechar} />
        <Botao titulo={pasta ? 'Salvar alterações' : 'Criar pasta'} onPress={enviar} />
      </AcoesModal>
    </ModalBase>
  );
}

const s = StyleSheet.create({
  paleta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingVertical: 4 },
  cor: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  corAtiva: { borderColor: '#ffffff' },
  erro: { color: '#fca5a5', fontSize: 12, marginTop: 2 },
});
