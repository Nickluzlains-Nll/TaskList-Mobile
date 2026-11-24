import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform, StyleSheet } from 'react-native';
import { Avatar, Botao } from './ui';

const NAV = [
  { id: 'today', icone: '▦', rotulo: 'Meu Dia' },
  { id: 'inbox', icone: '▤', rotulo: 'Caixa de Entrada' },
  { id: 'week', icone: '□', rotulo: 'Próximos 7 Dias' },
  { id: 'completed', icone: '✓', rotulo: 'Concluídos' },
];

// No computador, os botões "escondidos" só aparecem ao passar o mouse; no celular ficam sempre visíveis
const semHover = Platform.OS !== 'web';

export default function Sidebar({
  largo, largura = 248, style, perfil, visao, onVisao, avisos, pastas, contagem,
  onPerfil, onNovaPasta, onEditarPasta, onExcluirPasta, onSair,
}) {
  const [menuAberto, setMenuAberto] = useState(null);

  const conteudo = (
    <>
      {/* Perfil */}
      <Pressable onPress={onPerfil}>
        {({ hovered }) => (
          <View style={s.perfil}>
            <Avatar nome={perfil.displayName} foto={perfil.photo} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.perfilNome} numberOfLines={1}>{perfil.displayName}</Text>
              <Text style={s.perfilSub}>Conta Pessoal</Text>
            </View>
            <Text style={[s.editar, { opacity: !largo || semHover || hovered ? 1 : 0 }]}>✎</Text>
          </View>
        )}
      </Pressable>

      {/* Navegação */}
      <View style={{ marginTop: largo ? 56 : 32 }}>
        <View style={s.marca}>
          <View style={s.marcaIcone}><Text style={{ color: '#fff', fontSize: 12 }}>✓</Text></View>
          <Text style={s.marcaTxt}>MEU GERENCIADOR</Text>
        </View>
        {NAV.map((item, i) => {
          const ativo = visao === item.id;
          return (
            <Pressable key={item.id} onPress={() => onVisao(item.id)} style={i > 0 ? { marginTop: 4 } : null}>
              {({ hovered }) => (
                <View style={[s.link, ativo || hovered ? s.linkAtivo : null]}>
                  <Text style={[s.linkIcone, ativo ? { color: '#3b82f6' } : null]}>{item.icone}</Text>
                  <Text style={[s.linkTxt, ativo || hovered ? { color: '#ffffff' } : null]}>{item.rotulo}</Text>
                  {item.id === 'inbox' ? (
                    <View style={s.badge}><Text style={s.badgeTxt}>{avisos}</Text></View>
                  ) : null}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Pastas */}
      <View style={s.pastas}>
        <View style={s.pastasTopo}>
          <Text style={s.pastasTitulo}>MINHAS PASTAS</Text>
          <Pressable onPress={onNovaPasta} hitSlop={6}>
            {({ hovered }) => (
              <View style={[s.mais, hovered ? { backgroundColor: '#292d36' } : null]}>
                <Text style={{ color: hovered ? '#fff' : '#cbd5e1', fontSize: 19, lineHeight: 22 }}>+</Text>
              </View>
            )}
          </Pressable>
        </View>

        {pastas.length === 0 ? (
          <Text style={s.vazio}>Você ainda não criou pastas.</Text>
        ) : (
          <View style={{ gap: 3 }}>
            {pastas.map((pasta) => {
              const chave = `folder:${pasta.id}`;
              const sel = visao === chave;
              const aberto = menuAberto === pasta.id;
              return (
                <View key={pasta.id}>
                  <Pressable>
                    {({ hovered }) => (
                      <View style={[s.pastaItem, hovered ? { backgroundColor: '#222630' } : null]}>
                        <Pressable style={[s.pastaCartao, sel ? { backgroundColor: '#292d36' } : null]} onPress={() => { setMenuAberto(null); onVisao(chave); }}>
                          <Text style={[s.pastaIcone, { color: pasta.color }]}>▰</Text>
                          <Text style={[s.pastaNome, sel ? { color: '#fff' } : null]} numberOfLines={1}>{pasta.name}</Text>
                          <View style={s.contador}><Text style={s.contadorTxt}>{contagem[pasta.id] || 0}</Text></View>
                        </Pressable>
                        <Pressable onPress={() => setMenuAberto(aberto ? null : pasta.id)} hitSlop={6}>
                          <View style={[s.menu, { opacity: !largo || semHover || hovered || aberto ? 1 : 0 }, aberto ? { backgroundColor: '#343944' } : null]}>
                            <Text style={{ color: aberto ? '#fff' : '#8b919c', fontSize: 11, letterSpacing: 1 }}>•••</Text>
                          </View>
                        </Pressable>
                      </View>
                    )}
                  </Pressable>
                  {aberto ? (
                    <View style={s.menuAcoes}>
                      <Pressable onPress={() => { setMenuAberto(null); onEditarPasta(pasta); }}>
                        {({ hovered }) => <Text style={[s.menuBtn, hovered ? s.menuBtnHover : null]}>Renomear / cor</Text>}
                      </Pressable>
                      <Pressable onPress={() => { setMenuAberto(null); onExcluirPasta(pasta); }}>
                        {({ hovered }) => <Text style={[s.menuBtn, hovered ? s.menuBtnHover : null]}>Excluir</Text>}
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Rodapé: fica sempre no fim da barra (margin-top: auto do .logout-button no site) */}
      <View style={s.rodape}>
        <Botao tipo="secundario" titulo="Sair da conta" onPress={onSair} />
        <View style={s.status}>
          <View style={s.statusPonto} />
          <Text style={s.statusTxt}>Sincronizado com sua conta</Text>
        </View>
      </View>
    </>
  );

  return (
    <ScrollView
      style={[s.lateral, { width: largura }, style]}
      contentContainerStyle={{ flexGrow: 1, paddingTop: largo ? 36 : 28, paddingHorizontal: 22, paddingBottom: 28 }}
    >
      {conteudo}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  lateral: { width: 248, backgroundColor: '#161922', borderRightWidth: 1, borderRightColor: '#252832' },
  topo: { backgroundColor: '#161922', paddingVertical: 22, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#252832' },
  perfil: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 12 },
  perfilNome: { color: '#fff', fontSize: 16, fontWeight: '700' },
  perfilSub: { color: '#9ca3af', fontSize: 12, marginTop: 3 },
  editar: { color: '#9ca3af', marginLeft: 'auto' },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 9, marginHorizontal: 12, marginBottom: 18 },
  marcaIcone: { width: 19, height: 19, borderRadius: 4, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center' },
  marcaTxt: { color: '#9ca3af', fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 13, minHeight: 44, paddingHorizontal: 12, borderRadius: 7 },
  linkAtivo: { backgroundColor: '#292d36' },
  linkIcone: { width: 18, color: '#a2a8b2', fontSize: 19, textAlign: 'center' },
  linkTxt: { color: '#aeb2b8', fontSize: 13 },
  badge: { marginLeft: 'auto', width: 20, height: 20, borderRadius: 10, backgroundColor: '#326dca', alignItems: 'center', justifyContent: 'center' },
  badgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  pastas: { marginTop: 20, paddingTop: 17, borderTopWidth: 1, borderTopColor: '#2b2f3a' },
  pastasTopo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginRight: 5, marginLeft: 12, marginBottom: 9 },
  pastasTitulo: { color: '#9ca3af', fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  mais: { width: 26, height: 26, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  vazio: { paddingVertical: 8, paddingHorizontal: 12, color: '#737985', fontSize: 12, lineHeight: 18 },
  pastaItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 7 },
  pastaCartao: { flex: 1, minWidth: 0, minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 9, paddingLeft: 12, paddingRight: 5, borderRadius: 7 },
  pastaIcone: { width: 18, fontSize: 15, textAlign: 'center' },
  pastaNome: { flex: 1, color: '#aeb2b8', fontSize: 13 },
  contador: { minWidth: 21, height: 21, borderRadius: 11, backgroundColor: '#292d36', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  contadorTxt: { color: '#cbd5e1', fontSize: 10 },
  menu: { width: 25, height: 28, marginRight: 5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  menuAcoes: {
    alignSelf: 'flex-end', width: 145, marginTop: 3, marginRight: 5, padding: 5, borderWidth: 1, borderColor: '#343a46',
    borderRadius: 7, backgroundColor: '#1d212b',
  },
  menuBtn: { paddingVertical: 8, paddingHorizontal: 9, borderRadius: 5, color: '#d1d5db', fontSize: 12, overflow: 'hidden' },
  menuBtnHover: { backgroundColor: '#303541', color: '#fff' },
  rodape: { marginTop: 'auto', paddingTop: 20 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, paddingHorizontal: 12 },
  statusPonto: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4ade80', shadowColor: '#4ade80', shadowOpacity: 0.5, shadowRadius: 4, shadowOffset: { width: 0, height: 0 } },
  statusTxt: { color: '#737985', fontSize: 11 },
});
