import React, { useState } from 'react';
import { View, Text, Pressable, Modal, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { parseDueDate, formatDueDate, paraCampo } from '../utils/datas';

// Celular: abre o seletor nativo (Android: data e depois hora; iPhone: roda de data e hora)
export default function CampoDataHora({ valor, onChange }) {
  const [ios, setIos] = useState(false);
  const [temp, setTemp] = useState(new Date());
  const data = parseDueDate(valor);

  function abrir() {
    const base = data || new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: base,
        mode: 'date',
        onChange: (e, d) => {
          if (e.type !== 'set' || !d) return;
          DateTimePickerAndroid.open({
            value: d,
            mode: 'time',
            is24Hour: true,
            onChange: (e2, d2) => {
              if (e2.type === 'set' && d2) onChange(paraCampo(d2));
            },
          });
        },
      });
    } else {
      setTemp(base);
      setIos(true);
    }
  }

  return (
    <>
      <Pressable style={s.campo} onPress={abrir}>
        <Text style={[s.texto, !valor ? { color: '#747b87' } : null]}>
          {valor ? formatDueDate(valor) : 'Selecionar data e hora'}
        </Text>
        {valor ? (
          <Pressable onPress={() => onChange('')} hitSlop={10}>
            <Text style={s.limpar}>×</Text>
          </Pressable>
        ) : null}
      </Pressable>

      {Platform.OS === 'ios' ? (
        <Modal visible={ios} transparent animationType="fade" onRequestClose={() => setIos(false)}>
          <View style={s.fundo}>
            <View style={s.cartao}>
              <DateTimePicker
                value={temp}
                mode="datetime"
                display="spinner"
                themeVariant="dark"
                locale="pt-BR"
                onChange={(e, d) => d && setTemp(d)}
              />
              <View style={s.linha}>
                <Pressable onPress={() => setIos(false)}>
                  <Text style={s.cancelar}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={() => { onChange(paraCampo(temp)); setIos(false); }}>
                  <Text style={s.ok}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const s = StyleSheet.create({
  campo: {
    minHeight: 40, paddingHorizontal: 11, paddingVertical: 9, borderWidth: 1, borderColor: '#353b47',
    borderRadius: 7, backgroundColor: '#12151c', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  texto: { color: '#ffffff', fontSize: 13 },
  limpar: { color: '#9ca3af', fontSize: 20, lineHeight: 20 },
  fundo: { flex: 1, backgroundColor: 'rgba(3,6,13,0.74)', justifyContent: 'center', padding: 20 },
  cartao: { backgroundColor: '#1a1d26', borderRadius: 13, padding: 16, borderWidth: 1, borderColor: '#343a46' },
  linha: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingTop: 8 },
  cancelar: { color: '#9ca3af', fontSize: 14, fontWeight: '600' },
  ok: { color: '#3b82f6', fontSize: 14, fontWeight: '700' },
});
