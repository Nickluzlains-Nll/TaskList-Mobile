import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

// Gradiente RADIAL (o React Native não tem radial-gradient do CSS).
// Renderize antes do conteúdo: fica no fundo.
export default function Radial({ id, cx = '50%', cy = '50%', r = '50%', cor, opacidade = 1 }) {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <RadialGradient id={id} cx={cx} cy={cy} r={r} fx={cx} fy={cy}>
          <Stop offset="0" stopColor={cor} stopOpacity={opacidade} />
          <Stop offset="1" stopColor={cor} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}
