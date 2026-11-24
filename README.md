# TaskList Mobile

Aplicativo de tarefas para Android e iOS feito com **React Native (Expo)** e **Firebase**.
É a versão mobile do [TaskList Web](https://github.com/vinicius-beitum/Task-List): os dois usam o mesmo
projeto Firebase, então a mesma conta vê as mesmas tarefas no celular e no navegador, em tempo real.

## Download

- **Android:** baixe o APK na página de [Releases](../../releases) e instale no celular.
- **iPhone:** use a versão web pelo navegador (Safari → Compartilhar → *Adicionar à Tela de Início*).
  A versão nativa para iOS exige uma conta paga do Apple Developer Program.

## Funcionalidades

- Cadastro, login com e-mail e senha, login com Google e recuperação de senha
- Tarefas com descrição, prazo (data e hora), prioridade e pasta
- Visões: Meu Dia, Caixa de Entrada, Próximos 7 dias e Concluídas
- Pastas com cor, contador de pendentes e exclusão com ou sem as tarefas
- Dashboard com total, concluídas, pendentes, atrasadas e progresso geral
- Perfil com nome de exibição e foto
- Sincronização em tempo real com o site e funcionamento offline

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Interface | React Native 0.88, Expo SDK 58, React Navigation |
| Autenticação | Firebase Authentication (e-mail/senha e Google) |
| Banco de dados | Cloud Firestore, com regras de segurança por usuário |
| Login com Google (Android) | `@react-native-google-signin/google-signin` |
| Build | EAS Build |

## Estrutura

```
src/
├── components/        # Componentes reutilizáveis (campos, botões, layout de autenticação)
│   └── home/          # Componentes da tela principal (sidebar, dashboard, modais, itens)
├── hooks/             # useAuth: sessão do usuário compartilhada entre as telas
├── screens/           # Login, Cadastro, Recuperar e Home
├── services/          # Único ponto de acesso a dados (index.js decide a origem)
│   ├── firebase/      # Auth, Firestore e login com Google por plataforma
│   └── local/         # Versão local (AsyncStorage) usada no desenvolvimento
├── theme/             # Paleta de cores
└── utils/             # Regras puras: datas, validação, estatísticas, erros
```

As telas não falam com o Firebase diretamente: tudo passa por `src/services`.
Diferenças entre plataformas ficam em arquivos `.web.js` (por exemplo, o login com Google
usa popup no navegador e a conta do aparelho no Android).

## Como rodar

Pré-requisitos: Node.js 20+ e o app **Expo Go** no celular.

```bash
git clone https://github.com/vinicius-beitum/task-list-mobile.git
cd task-list-mobile
npm install
npx expo start
```

Leia o QR code com o Expo Go. No Expo Go tudo funciona, menos o login com Google,
que precisa de um *development build*:

```bash
npx eas-cli@latest build --profile development --platform android
```

O build usa o `google-services.json` do Firebase, que **não fica no repositório**: ele é enviado ao EAS
como variável de ambiente secreta (`GOOGLE_SERVICES_JSON`), lida pelo `app.config.js`.

## Segurança

A configuração do Firebase no código é pública por natureza (o mesmo vale para o site).
Quem protege os dados são as [regras do Firestore](firestore.rules): cada usuário só lê e grava
os próprios documentos, e os campos são validados no servidor.

## Licença

[MIT](LICENSE)
