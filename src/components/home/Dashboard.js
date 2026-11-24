import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Icone from '../Icone';
import { descreverProgresso } from '../../utils/tarefas';

// Cores dos ícones iguais às do home.css do site (.stat-icon[data-tone])
const TONS = {
  azul: { fundo: 'rgba(59,130,246,0.14)', cor: '#60a5fa' },
  verde: { fundo: 'rgba(74,222,128,0.13)', cor: '#4ade80' },
  amarelo: { fundo: 'rgba(251,191,36,0.13)', cor: '#fbbf24' },
  vermelho: { fundo: 'rgba(248,113,113,0.13)', cor: '#f87171' },
};

const CARTOES = [
  { chave: 'total', rotulo: 'Total de tarefas', icone: 'list-check', tom: TONS.azul },
  { chave: 'concluidas', rotulo: 'Concluídas', icone: 'check', tom: TONS.verde },
  { chave: 'pendentes', rotulo: 'Pendentes', icone: 'clock', tom: TONS.amarelo },
  { chave: 'atrasadas', rotulo: 'Atrasadas', icone: 'exclamation', tom: TONS.vermelho },
];

function CartaoEstatistica({ valor, rotulo, icone, tom, colunas }) {
  const compacto = colunas === 2;
  return (
    <View style={[s.cartao, { flexBasis: compacto ? '40%' : '22%' }, compacto ? s.cartaoCompacto : null]}>
      <View style={[s.icone, { backgroundColor: tom.fundo }, compacto ? s.iconeCompacto : null]}>
        <Icone nome={icone} tamanho={compacto ? 14 : 16} cor={tom.cor} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[s.valor, compacto ? { fontSize: 21 } : null]}>{valor}</Text>
        <Text style={s.rotulo} numberOfLines={1}>{rotulo}</Text>
      </View>
    </View>
  );
}

function BarraProgresso({ porcentagem }) {
  const preenchimento = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // largura não roda no driver nativo (só transform e opacity), por isso useNativeDriver: false
    Animated.timing(preenchimento, { toValue: porcentagem, duration: 300, useNativeDriver: false }).start();
  }, [porcentagem, preenchimento]);

  const largura = preenchimento.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View
      style={s.trilho}
      accessibilityRole="progressbar"
      accessibilityLabel="Progresso geral"
      accessibilityValue={{ min: 0, max: 100, now: porcentagem }}
    >
      <Animated.View style={[s.preenchimento, { width: largura }]} />
    </View>
  );
}

// `estatisticas` = null enquanto as tarefas ainda não chegaram do Firestore
export default function Dashboard({ estatisticas, colunas }) {
  const carregando = !estatisticas;
  const porcentagem = carregando ? 0 : estatisticas.taxaConclusao;

  return (
    <View style={s.dashboard}>
      <Text style={s.titulo}>Visão geral</Text>
      <Text style={s.subtitulo}>Acompanhe seu desempenho</Text>

      <View style={s.grade}>
        {CARTOES.map(({ chave, ...cartao }) => (
          <CartaoEstatistica key={chave} valor={carregando ? '–' : estatisticas[chave]} colunas={colunas} {...cartao} />
        ))}
      </View>

      <View style={s.progresso}>
        <View style={s.progressoTopo}>
          <View style={{ flex: 1 }}>
            <Text style={s.progressoTitulo}>Progresso geral</Text>
            <Text style={s.progressoDescricao}>
              {carregando ? 'Carregando…' : descreverProgresso(estatisticas)}
            </Text>
          </View>
          <Text style={s.porcentagem}>{`${porcentagem}%`}</Text>
        </View>
        <BarraProgresso porcentagem={porcentagem} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  dashboard: { marginBottom: 24 },
  titulo: { color: '#fff', fontSize: 17, fontWeight: '700' },
  subtitulo: { marginTop: 4, marginBottom: 14, color: '#9ca3af', fontSize: 13 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cartao: {
    flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, minWidth: 0,
    borderWidth: 1, borderColor: '#2b2f3a', borderRadius: 12, backgroundColor: '#1a1d26',
  },
  cartaoCompacto: { gap: 10, padding: 12 },
  icone: { width: 38, height: 38, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  iconeCompacto: { width: 32, height: 32 },
  valor: { color: '#fff', fontSize: 24, fontWeight: '700', fontVariant: ['tabular-nums'] },
  rotulo: { marginTop: 2, color: '#9ca3af', fontSize: 12 },
  progresso: {
    marginTop: 12, paddingVertical: 18, paddingHorizontal: 20,
    borderWidth: 1, borderColor: '#2b2f3a', borderRadius: 12, backgroundColor: '#1a1d26',
  },
  progressoTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 12 },
  progressoTitulo: { color: '#fff', fontSize: 14, fontWeight: '700' },
  progressoDescricao: { marginTop: 4, color: '#9ca3af', fontSize: 13 },
  porcentagem: { color: '#93c5fd', fontSize: 21, fontWeight: '700', fontVariant: ['tabular-nums'] },
  trilho: { height: 8, borderRadius: 999, backgroundColor: '#303541', overflow: 'hidden' },
  preenchimento: { height: '100%', borderRadius: 999, backgroundColor: '#3b82f6' },
});
