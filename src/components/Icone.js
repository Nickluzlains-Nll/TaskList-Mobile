import React from 'react';
import { FontAwesome6 } from '@expo/vector-icons';

// Mesmos ícones Font Awesome 6 que o site usa
export default function Icone({ nome, marca, tamanho = 16, cor = '#ffffff', style }) {
  return (
    <FontAwesome6 name={nome} size={tamanho} color={cor} style={style} iconStyle={marca ? 'brand' : 'solid'} />
  );
}
