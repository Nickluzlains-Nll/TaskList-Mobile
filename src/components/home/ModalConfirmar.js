import React from 'react';
import { Text, StyleSheet } from 'react-native';
import ModalBase, { AcoesModal } from './ModalBase';
import { Botao, BotaoTexto } from './ui';

// Confirmação de exclusão de tarefa (no site é o window.confirm)
export function ModalExcluirTarefa({ visivel, onConfirmar, onFechar }) {
  return (
    <ModalBase visivel={visivel} onFechar={onFechar} eyebrow="EXCLUIR TAREFA" titulo="Excluir esta tarefa?">
      <Text style={s.desc}>Você realmente deseja excluir essa tarefa?</Text>
      <AcoesModal>
        <Botao tipo="secundario" titulo="Cancelar" onPress={onFechar} />
        <Botao tipo="perigo" titulo="Excluir" onPress={onConfirmar} />
      </AcoesModal>
    </ModalBase>
  );
}

// "O que fazer com as tarefas?" ao excluir uma pasta
export function ModalExcluirPasta({ visivel, pasta, onManter, onExcluir, onFechar }) {
  return (
    <ModalBase visivel={visivel} onFechar={onFechar} eyebrow="EXCLUIR PASTA" titulo={pasta ? `Excluir a pasta "${pasta.name}"?` : ''}>
      <Text style={s.desc}>
        Escolha se deseja manter as tarefas na Caixa de Entrada ou excluí-las também. Esta ação não pode ser desfeita.
      </Text>
      <AcoesModal empilhado>
        <Botao tipo="secundario" titulo="Manter tarefas sem pasta" onPress={onManter} />
        <Botao tipo="perigo" titulo="Excluir pasta e tarefas" onPress={onExcluir} />
      </AcoesModal>
      <BotaoTexto titulo="Cancelar" onPress={onFechar} style={{ alignSelf: 'center', marginTop: 8 }} />
    </ModalBase>
  );
}

const s = StyleSheet.create({ desc: { color: '#9ca3af', fontSize: 12, lineHeight: 18, marginTop: 4 } });
