// O app.json continua sendo a configuração principal (o EAS também escreve nele).
// Aqui entra só o que precisa ser decidido na hora do build.
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    // No EAS: arquivo enviado como variável secreta. No seu PC: o arquivo da raiz (fora do git).
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
});
