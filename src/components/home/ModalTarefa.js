import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import ModalBase, { AcoesModal } from './ModalBase';
import { Rotulo, Entrada, Selecao, Botao } from './ui';
import CampoDataHora from '../CampoDataHora';
import { parseDueDate } from '../../utils/datas';

const PRIORIDADES = [
  { valor: 'low', rotulo: 'Baixa' },
  { valor: 'medium', rotulo: 'Média' },
  { valor: 'high', rotulo: 'Alta' },
];

export default function ModalTarefa({ visivel, tarefa, pastas, pastaAtiva, onSalvar, onFechar }) {
  const { width } = useWindowDimensions();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prazo, setPrazo] = useState('');
  const [prioridade, setPrioridade] = useState('medium');
  const [pasta, setPasta] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!visivel) return;
    setTitulo(tarefa ? tarefa.name : '');
    setDescricao(tarefa ? tarefa.description || '' : '');
    setPrazo(tarefa ? tarefa.dueDate || '' : '');
    setPrioridade(tarefa && PRIORIDADES.some((p) => p.valor === tarefa.priority) ? tarefa.priority : 'medium');
    setPasta(tarefa ? tarefa.folderId || '' : pastaAtiva || '');
    setErro('');
  }, [visivel, tarefa, pastaAtiva]);

  function enviar() {
    const nome = titulo.trim();
    if (!nome) return setErro('Informe o título da tarefa.');
    if (prazo && !parseDueDate(prazo)) return setErro('Informe uma data e um horário válidos.');
    onSalvar({ name: nome, description: descricao.trim(), dueDate: prazo, folderId: pasta || null, priority: prioridade });
  }

  const opcoesPasta = [{ valor: '', rotulo: 'Sem pasta' }, ...pastas.map((p) => ({ valor: p.id, rotulo: p.name, cor: p.color }))];
  const duasColunas = width > 450;

  return (
    <ModalBase visivel={visivel} onFechar={onFechar} eyebrow="TAREFA" titulo={tarefa ? 'Editar tarefa' : 'Adicionar tarefa'}>
      <Rotulo>Título</Rotulo>
      <Entrada value={titulo} onChangeText={setTitulo} maxLength={160} placeholder="O que você precisa fazer?" autoFocus />

      <Rotulo opcional>Descrição</Rotulo>
      <Entrada value={descricao} onChangeText={setDescricao} maxLength={1000} multiline numberOfLines={3} placeholder="Adicione detalhes sobre esta tarefa" />

      <View style={{ flexDirection: duasColunas ? 'row' : 'column', gap: duasColunas ? 12 : 4 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Rotulo opcional>Data e hora</Rotulo>
          <View style={{ marginTop: 9 }}><CampoDataHora valor={prazo} onChange={setPrazo} /></View>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Rotulo>Prioridade</Rotulo>
          <View style={{ marginTop: 9 }}><Selecao valor={prioridade} opcoes={PRIORIDADES} onChange={setPrioridade} /></View>
        </View>
      </View>

      <Rotulo opcional>Pasta</Rotulo>
      <Selecao valor={pasta} opcoes={opcoesPasta} onChange={setPasta} />

      {erro ? <Text style={s.erro}>{erro}</Text> : null}

      <AcoesModal>
        <Botao tipo="secundario" titulo="Cancelar" onPress={onFechar} />
        <Botao titulo={tarefa ? 'Salvar alterações' : 'Adicionar tarefa'} onPress={enviar} />
      </AcoesModal>
    </ModalBase>
  );
}

const s = StyleSheet.create({ erro: { color: '#fca5a5', fontSize: 12, marginTop: 2 } });
