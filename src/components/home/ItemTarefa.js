import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { statusPrazo, formatDueDate } from '../../utils/datas';
import { PRIORIDADES } from '../../utils/tarefas';

const BORDA = { overdue: '#f87171', today: '#fbbf24', future: '#60a5fa' };
const COR_PRAZO = { overdue: '#fca5a5', today: '#fcd34d', future: '#93c5fd', 'no-date': '#9ca3af' };
const PRIORIDADE_COR = {
  low: { bg: 'rgba(74,222,128,0.12)', txt: '#86efac' },
  medium: { bg: 'rgba(96,165,250,0.12)', txt: '#93c5fd' },
  high: { bg: 'rgba(248,113,113,0.13)', txt: '#fca5a5' },
};
const semHover = Platform.OS !== 'web';

function BotaoAcao({ children, onPress, corHover = '#343944', cor = '#9ca3af' }) {
  return (
    <Pressable onPress={onPress} hitSlop={4}>
      {({ hovered }) => (
        <View style={[s.acaoBtn, hovered ? { backgroundColor: corHover } : null]}>
          <Text style={{ color: hovered ? '#fff' : cor, fontSize: 16 }}>{children}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function ItemTarefa({ tarefa, pasta, agora, primeiro, estreito, onAlternar, onEditar, onExcluir }) {
  const status = statusPrazo(tarefa.dueDate, agora);
  const rotulo = formatDueDate(tarefa.dueDate);
  const prioridade = PRIORIDADES[tarefa.priority] ? tarefa.priority : 'medium';
  const borda = !tarefa.completed ? BORDA[status] : null;
  const prefixo = status === 'overdue' ? 'Atrasada · ' : status === 'today' ? 'Hoje · ' : '';

  return (
    <Pressable>
      {({ hovered }) => (
        <View
          style={[
            s.linha,
            { gap: estreito ? 10 : 15, borderTopWidth: primeiro ? 0 : 1 },
            borda ? { borderLeftWidth: 2, borderLeftColor: borda, paddingLeft: 10 } : null,
            hovered ? { backgroundColor: 'rgba(255,255,255,0.025)' } : null,
            tarefa.completed ? { opacity: 0.5 } : null,
          ]}
        >
          <Pressable onPress={onAlternar} hitSlop={8} style={[s.check, tarefa.completed ? s.checkOn : null]}>
            {tarefa.completed ? <View style={s.checkMiolo} /> : null}
          </Pressable>

          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={s.titulo}>
              <Text style={[s.nome, tarefa.completed ? { textDecorationLine: 'line-through' } : null]} numberOfLines={1}>
                {tarefa.name}
              </Text>
              <View style={[s.badge, { backgroundColor: PRIORIDADE_COR[prioridade].bg }]}>
                <Text style={[s.badgeTxt, { color: PRIORIDADE_COR[prioridade].txt }]}>{PRIORIDADES[prioridade]}</Text>
              </View>
            </View>
            {tarefa.description ? <Text style={s.descricao}>{tarefa.description}</Text> : null}
            <View style={s.meta}>
              {rotulo ? (
                <Text style={[s.prazo, { color: status === 'overdue' || status === 'today' || status === 'future' ? COR_PRAZO[status] : '#c7cbd2' }]}>
                  {prefixo}{rotulo}
                </Text>
              ) : (
                <Text style={[s.prazo, { color: COR_PRAZO['no-date'] }]}>Sem prazo</Text>
              )}
              {pasta ? (
                <View style={s.pasta}>
                  <View style={[s.ponto, { backgroundColor: pasta.color }]} />
                  <Text style={s.pastaTxt}>{pasta.name}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={[s.acoes, { opacity: estreito || semHover || hovered ? 1 : 0 }]}>
            <BotaoAcao onPress={onEditar}>✎</BotaoAcao>
            <BotaoAcao onPress={onExcluir}>×</BotaoAcao>
          </View>
        </View>
      )}
    </Pressable>
  );
}

// Aviso de tarefa vencida (Caixa de Entrada)
export function ItemAviso({ tarefa, agora, primeiro, estreito, onEditar, onConcluir }) {
  return (
    <View
      style={[
        s.linha,
        { gap: estreito ? 10 : 15, borderTopWidth: primeiro ? 0 : 1, borderLeftWidth: 2, borderLeftColor: '#f87171', paddingLeft: 10 },
      ]}
    >
      <View style={s.aviso}><Text style={{ color: '#fca5a5', fontSize: 12, fontWeight: '700' }}>!</Text></View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.nome}>{`Atenção: A tarefa '${tarefa.name}' está vencida`}</Text>
        <View style={s.meta}>
          <Text style={[s.prazo, { color: '#fca5a5' }]}>Venceu em {formatDueDate(tarefa.dueDate)}</Text>
        </View>
      </View>
      <View style={s.acoes}>
        <BotaoAcao onPress={onEditar}>✎</BotaoAcao>
        <BotaoAcao onPress={onConcluir} cor="#86efac" corHover="rgba(74,222,128,0.12)">✓</BotaoAcao>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', minHeight: 68, paddingVertical: 12, paddingHorizontal: 2, borderTopColor: '#2b2f3a' },
  check: { width: 19, height: 19, borderRadius: 10, borderWidth: 1, borderColor: '#737b89', alignItems: 'center', justifyContent: 'center' },
  checkOn: { borderColor: '#4ade80', backgroundColor: '#4ade80' },
  checkMiolo: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#1a1d26' },
  titulo: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  nome: { color: '#fff', fontSize: 14, fontWeight: '600', flexShrink: 1 },
  badge: { borderRadius: 20, paddingVertical: 1, paddingHorizontal: 8 },
  badgeTxt: { fontSize: 11, fontWeight: '600', lineHeight: 16 },
  descricao: { marginTop: 5, color: '#c0c4cc', fontSize: 12, lineHeight: 17 },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 12, rowGap: 7, marginTop: 7 },
  prazo: { fontSize: 11, lineHeight: 16 },
  pasta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pastaTxt: { color: '#c7cbd2', fontSize: 11, lineHeight: 16 },
  ponto: { width: 8, height: 8, borderRadius: 4 },
  acoes: { flexDirection: 'row', gap: 4, alignSelf: 'flex-start' },
  acaoBtn: { width: 28, height: 28, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  aviso: { width: 19, height: 19, borderRadius: 10, borderWidth: 1, borderColor: '#f87171', alignItems: 'center', justifyContent: 'center' },
});
