import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services';

const AuthContext = createContext({ usuario: null, carregando: true, pausado: false, pausar: () => {} });

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  // pausado = true segura o usuário na tela de login enquanto aparecem
  // "Entrando..." e "Login realizado com sucesso!" (igual ao site)
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const cancelar = authService.observarAuth((u) => {
      setUsuario(u);
      setCarregando(false);
    });
    return cancelar;
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando, pausado, pausar: setPausado }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
