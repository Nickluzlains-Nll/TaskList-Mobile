import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Radial from '../components/Radial';
import Sidebar from '../components/home/Sidebar';
import Gaveta, { BordaGaveta } from '../components/home/Gaveta';
import { ItemTarefa, ItemAviso } from '../components/home/ItemTarefa';
import ModalTarefa from '../components/home/ModalTarefa';
import ModalPasta from '../components/home/ModalPasta';
import ModalPerfil from '../components/home/ModalPerfil';
import { ModalExcluirTarefa, ModalExcluirPasta } from '../components/home/ModalConfirmar';
import { Botao } from '../components/home/ui';
import Dashboard from '../components/home/Dashboard';
import { useAuth } from '../hooks/useAuth';
import { authService, tarefaService, pastaService, perfilService } from '../services';
import { dataPorExtenso } from '../utils/datas';
import { tarefasVencidas, pertenceAVisao, detalhesVisao, estatisticasTarefas } from '../utils/tarefas';
import { mensagemErroDados } from '../utils/erros';

// Igual ao site: nome da conta ou, na falta dele, o começo do e-mail
const nomeInicial = (usuario) => usuario.nome || (usuario.email ? usuario.email.split('@')[0] : 'Usuário');

export default function Home() {
  const { usuario } = useAuth();
  const uid = usuario.uid;
  const { width } = useWindowDimensions();
  const largo = width > 760; // abaixo disso a sidebar vira o topo da página (como no @media do site)
  const estreito = width <= 450;
  const insets = useSafeAreaInsets();
  const [gavetaAberta, setGavetaAberta] = useState(false);

  const [tarefas, setTarefas] = useState([]);
  const [carregouTarefas, setCarregouTarefas] = useState(false);
  const [pastas, setPastas] = useState([]);
  const [perfil, setPerfil] = useState({ displayName: nomeInicial(usuario), photo: '' });
  const [visao, setVisao] = useState('today');
  const [agora, setAgora] = useState(Date.now());
  const [mensagem, setMensagem] = useState(null);

  const [modalTarefa, setModalTarefa] = useState({ aberto: false, tarefa: null });
  const [modalPasta, setModalPasta] = useState({ aberto: false, pasta: null });
  const [modalPerfil, setModalPerfil] = useState(false);
  const [excluirPasta, setExcluirPasta] = useState(null);
  const [excluirTarefa, setExcluirTarefa] = useState(null);

  // ---- mensagem no topo do cartão (some em 6s) ----
  const timer = useRef(null);
  const avisar = useCallback((texto, tipo = 'sucesso') => {
    clearTimeout(timer.current);
    setMensagem({ texto, tipo });
    timer.current = setTimeout(() => setMensagem(null), 6000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const erroLer = useCallback((e) => avisar(mensagemErroDados(e, 'ler'), 'erro'), [avisar]);
  const erroSalvar = (e) => avisar(mensagemErroDados(e, 'salvar'), 'erro');

  // ---- dados em tempo real (Firestore) ----
  useEffect(() => tarefaService.observar(uid, (lista) => {
    setTarefas(lista);
    setCarregouTarefas(true);
  }, erroLer), [uid, erroLer]);
  useEffect(() => pastaService.observar(uid, setPastas, erroLer), [uid, erroLer]);
  useEffect(() => perfilService.observarPerfil(uid, (p) => {
    if (p && typeof p.displayName === 'string' && p.displayName.trim()) {
      setPerfil({ displayName: p.displayName, photo: typeof p.photo === 'string' ? p.photo : '' });
    }
  }, erroLer), [uid, erroLer]);

  // Se a tela ficar larga (ex.: girar o tablet), a sidebar fixa assume e a gaveta fecha
  useEffect(() => { if (largo) setGavetaAberta(false); }, [largo]);

  // Atualiza data e avisos de vencimento a cada 60s (igual ao setInterval do site)
  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  // ---- derivados ----
  const vencidas = tarefasVencidas(tarefas, agora);
  const emInbox = visao === 'inbox';
  const visiveis = tarefas.filter((t) => pertenceAVisao(t, visao, agora));
  const pendentes = tarefas.filter((t) => !t.completed).length;
  const detalhes = detalhesVisao(visao, pastas);
  const qtd = emInbox ? vencidas.length : visiveis.length;
  const rotuloQtd = `${qtd} ${emInbox ? (qtd === 1 ? 'aviso' : 'avisos') : qtd === 1 ? 'tarefa' : 'tarefas'}`;
  const contagem = {};
  pastas.forEach((p) => { contagem[p.id] = tarefas.filter((t) => t.folderId === p.id && !t.completed).length; });
  const pastaAtiva = visao.startsWith('folder:') && pastas.some((p) => p.id === visao.slice(7)) ? visao.slice(7) : '';

  // ---- ações: tarefas ----
  async function salvarTarefa(dados) {
    const editando = modalTarefa.tarefa;
    try {
      if (editando) await tarefaService.atualizar(uid, editando.id, dados);
      else await tarefaService.criar(uid, { ...dados, completed: false });
      setModalTarefa((m) => ({ ...m, aberto: false }));
      avisar(editando ? 'Tarefa atualizada.' : 'Tarefa adicionada.');
    } catch (e) {
      erroSalvar(e);
    }
  }

  async function alternar(tarefa) {
    try { await tarefaService.definirConcluida(uid, tarefa.id, !tarefa.completed); } catch (e) { erroSalvar(e); }
  }

  async function concluirAviso(tarefa) {
    try {
      await tarefaService.definirConcluida(uid, tarefa.id, true);
      avisar('Tarefa concluída.');
    } catch (e) { erroSalvar(e); }
  }

  async function confirmarExclusaoTarefa() {
    const t = excluirTarefa;
    setExcluirTarefa(null);
    if (!t) return;
    try {
      await tarefaService.excluir(uid, t.id);
      avisar('Tarefa excluída.');
    } catch (e) { erroSalvar(e); }
  }

  // ---- ações: pastas ----
  async function salvarPasta(dados) {
    const editando = modalPasta.pasta;
    try {
      if (editando) await pastaService.atualizar(uid, editando.id, dados);
      else await pastaService.criar(uid, dados);
      setModalPasta((m) => ({ ...m, aberto: false }));
      avisar(editando ? 'Pasta atualizada.' : 'Pasta criada.');
    } catch (e) { erroSalvar(e); }
  }

  async function removerPasta(manterTarefas) {
    const pasta = excluirPasta;
    if (!pasta) return;
    try {
      const tarefaIds = tarefas.filter((t) => t.folderId === pasta.id).map((t) => t.id);
      await pastaService.excluirComTarefas(uid, pasta.id, tarefaIds, { manterTarefas });
      if (visao === `folder:${pasta.id}`) setVisao('inbox');
      setExcluirPasta(null);
      avisar(manterTarefas ? 'Pasta excluída. As tarefas foram mantidas sem pasta.' : 'Pasta e tarefas associadas excluídas.');
    } catch (e) { erroSalvar(e); }
  }

  // ---- ações: perfil ----
  async function salvarPerfil(novo) {
    try {
      await perfilService.salvarPerfil(uid, novo);
      setPerfil(novo);
      setModalPerfil(false);
      avisar('Perfil atualizado.');
    } catch (e) { erroSalvar(e); }
  }

  // ---- ações: conta ----
  async function sair() {
    try {
      await authService.sair(); // o App volta sozinho para o Login
    } catch (e) {
      avisar('Não foi possível sair da conta. Tente novamente.', 'erro');
    }
  }

  // ---- layout ----
  const larguraConteudo = largo ? Math.min(930, width - 248 - 96) : Math.min(930, width - 32);

  const conteudo = (
    <View style={{ width: larguraConteudo, alignSelf: 'center', paddingTop: largo ? 86 : 18, paddingBottom: largo ? 60 : 42 }}>
      {/* Cabeçalho */}
      <View style={[s.cabecalho, { alignItems: largo ? 'flex-end' : 'flex-start' }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.eyebrow}>{dataPorExtenso(new Date(agora))}</Text>
          <Text style={[s.h1, { fontSize: estreito ? 28 : 34 }]}>Minhas Tarefas</Text>
          <Text style={s.sub}>Tudo o que importa, em um só lugar.</Text>
        </View>
        <View style={s.contador}>
          <Text style={[s.contadorNum, { fontSize: estreito ? 25 : 31 }]}>{pendentes}</Text>
          <Text style={s.contadorTxt}>pendentes</Text>
        </View>
      </View>

      <Dashboard
        estatisticas={carregouTarefas ? estatisticasTarefas(tarefas, agora) : null}
        colunas={larguraConteudo >= 600 ? 4 : 2}
      />

      {/* Cartão de tarefas */}
      <View style={[s.cartao, { paddingVertical: largo ? 26 : 20, paddingHorizontal: largo ? 28 : 18 }]}>
        <View style={s.cartaoTopo}>
          <View style={{ flex: 1 }}>
            <Text style={s.cartaoTitulo}>{detalhes.titulo}</Text>
            <Text style={s.cartaoDesc}>{detalhes.descricao}</Text>
          </View>
          <Text style={s.cartaoDesc}>{rotuloQtd}</Text>
        </View>

        {mensagem ? (
          <View style={[s.mensagem, mensagem.tipo === 'sucesso' ? s.mensagemOk : null]}>
            <Text style={[s.mensagemTxt, mensagem.tipo === 'sucesso' ? { color: '#bbf7d0' } : null]}>{mensagem.texto}</Text>
          </View>
        ) : null}

        {(() => {
          const itens = emInbox
            ? vencidas.map((t, i) => (
                <ItemAviso
                  key={t.id} tarefa={t} agora={agora} primeiro={i === 0} estreito={estreito}
                  onEditar={() => setModalTarefa({ aberto: true, tarefa: t })}
                  onConcluir={() => concluirAviso(t)}
                />
              ))
            : visiveis.map((t, i) => (
                <ItemTarefa
                  key={t.id} tarefa={t} agora={agora} primeiro={i === 0} estreito={estreito}
                  pasta={pastas.find((p) => p.id === t.folderId)}
                  onAlternar={() => alternar(t)}
                  onEditar={() => setModalTarefa({ aberto: true, tarefa: t })}
                  onExcluir={() => setExcluirTarefa(t)}
                />
              ));
          const vazio = (
            <Text style={s.vazio}>{emInbox ? 'Nenhum aviso de tarefa vencida.' : 'Nenhuma tarefa nesta visualização.'}</Text>
          );
          const lista = itens.length ? itens : vazio;
          // Lista com rolagem própria só no computador (no celular a página inteira rola)
          return largo ? (
            <ScrollView style={{ maxHeight: 430 }} nestedScrollEnabled>{lista}</ScrollView>
          ) : (
            <View>{lista}</View>
          );
        })()}

        {!emInbox ? (
          <View style={{ marginTop: 15 }}>
            <Botao onPress={() => setModalTarefa({ aberto: true, tarefa: null })}>
              <Text style={s.addTxt}>+  Adicionar tarefa</Text>
            </Botao>
          </View>
        ) : null}
      </View>
    </View>
  );

  // No celular, escolher algo no menu fecha a gaveta
  const comFechar = (fn) => (...args) => {
    if (!largo) setGavetaAberta(false);
    fn(...args);
  };

  const sidebar = (
    <Sidebar
      largo={largo}
      largura={largo ? 248 : '100%'}
      style={largo ? null : { flex: 1, borderRightWidth: 0 }}
      perfil={perfil}
      visao={visao}
      onVisao={comFechar(setVisao)}
      avisos={vencidas.length}
      pastas={pastas}
      contagem={contagem}
      onPerfil={comFechar(() => setModalPerfil(true))}
      onNovaPasta={comFechar(() => setModalPasta({ aberto: true, pasta: null }))}
      onEditarPasta={comFechar((p) => setModalPasta({ aberto: true, pasta: p }))}
      onExcluirPasta={comFechar((p) => setExcluirPasta(p))}
      onSair={comFechar(sair)}
    />
  );

  return (
    <View style={s.tela}>
      <Radial id="radialHome" cx="85%" cy="0%" r="45%" cor="#17264b" opacidade={1} />
      <View style={{ flex: 1, paddingTop: insets.top }}>
        {largo ? (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {sidebar}
            <ScrollView style={{ flex: 1 }}>{conteudo}</ScrollView>
          </View>
        ) : (
          <ScrollView>
            <View style={s.barra}>
              <Pressable onPress={() => setGavetaAberta(true)} hitSlop={8} accessibilityLabel="Abrir menu">
                {({ pressed }) => (
                  <View style={[s.hamburguer, pressed ? { backgroundColor: '#292d36' } : null]}>
                    <View style={s.linhaMenu} />
                    <View style={s.linhaMenu} />
                    <View style={s.linhaMenu} />
                  </View>
                )}
              </Pressable>
            </View>
            {conteudo}
          </ScrollView>
        )}
      </View>

      {!largo ? <BordaGaveta onAbrir={() => setGavetaAberta(true)} /> : null}
      {!largo ? (
        <Gaveta
          aberta={gavetaAberta}
          onFechar={() => setGavetaAberta(false)}
          largura={Math.min(300, Math.round(width * 0.82))}
          topo={insets.top}
          base={insets.bottom}
        >
          {sidebar}
        </Gaveta>
      ) : null}

      <ModalTarefa
        visivel={modalTarefa.aberto}
        tarefa={modalTarefa.tarefa}
        pastas={pastas}
        pastaAtiva={pastaAtiva}
        onSalvar={salvarTarefa}
        onFechar={() => setModalTarefa((m) => ({ ...m, aberto: false }))}
      />
      <ModalPasta
        visivel={modalPasta.aberto}
        pasta={modalPasta.pasta}
        pastas={pastas}
        onSalvar={salvarPasta}
        onFechar={() => setModalPasta((m) => ({ ...m, aberto: false }))}
      />
      <ModalPerfil
        visivel={modalPerfil}
        perfil={perfil}
        onSalvar={salvarPerfil}
        onFechar={() => setModalPerfil(false)}
      />
      <ModalExcluirPasta
        visivel={!!excluirPasta}
        pasta={excluirPasta}
        onManter={() => removerPasta(true)}
        onExcluir={() => removerPasta(false)}
        onFechar={() => setExcluirPasta(null)}
      />
      <ModalExcluirTarefa visivel={!!excluirTarefa} onConfirmar={confirmarExclusaoTarefa} onFechar={() => setExcluirTarefa(null)} />
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#0f1117' },
  barra: { paddingHorizontal: 16, paddingTop: 14 },
  hamburguer: {
    width: 42, height: 42, borderRadius: 10, backgroundColor: '#161922', borderWidth: 1, borderColor: '#252832',
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  linhaMenu: { width: 18, height: 2, borderRadius: 1, backgroundColor: '#cbd5e1' },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', gap: 24, marginBottom: 38 },
  eyebrow: { color: '#8ba5d3', fontSize: 11, fontWeight: '700', letterSpacing: 1.3 },
  h1: { marginTop: 13, color: '#fff', fontWeight: '700', letterSpacing: -1.2 },
  sub: { marginTop: 8, color: '#9ca3af', fontSize: 14 },
  contador: { minWidth: 74, alignItems: 'flex-end' },
  contadorNum: { color: '#fff', fontWeight: '700', lineHeight: 34 },
  contadorTxt: { marginTop: 5, color: '#9ca3af', fontSize: 12 },
  cartao: {
    minWidth: 0, borderRadius: 12, backgroundColor: '#1a1d26',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 18 }, elevation: 6,
  },
  cartaoTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 14 },
  cartaoTitulo: { color: '#fff', fontSize: 17, fontWeight: '700' },
  cartaoDesc: { marginTop: 4, color: '#9ca3af', fontSize: 12 },
  mensagem: {
    marginBottom: 12, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#713b3b',
    borderRadius: 7, backgroundColor: 'rgba(127,29,29,0.22)',
  },
  mensagemOk: { borderColor: '#236345', backgroundColor: 'rgba(20,83,45,0.22)' },
  mensagemTxt: { color: '#fecaca', fontSize: 13 },
  vazio: { paddingVertical: 38, paddingHorizontal: 16, color: '#9ca3af', textAlign: 'center', fontSize: 13 },
  addTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
