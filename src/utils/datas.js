// Port das funções de data do home.js (sem depender de Intl, que varia entre aparelhos)
const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const dois = (n) => String(n).padStart(2, '0');

// Aceita "2026-11-04T15:30" (mesmo formato do <input type="datetime-local"> do site)
export function parseDueDate(valor) {
  if (!valor) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(valor);
  if (m) {
    const [, ano, mes, dia, hora, min, seg = '0'] = m;
    const d = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(min), Number(seg));
    if (
      d.getFullYear() !== Number(ano) || d.getMonth() !== Number(mes) - 1 || d.getDate() !== Number(dia) ||
      d.getHours() !== Number(hora) || d.getMinutes() !== Number(min)
    ) return null;
    return d;
  }
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? null : d;
}

// "04/11/2026 às 15:30"
export function formatDueDate(valor) {
  const d = parseDueDate(valor);
  if (!d) return '';
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()} às ${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

export function chaveDia(d) {
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

// "no-date" | "overdue" | "today" | "future"
export function statusPrazo(valor, agora = Date.now()) {
  const d = parseDueDate(valor);
  if (!d) return 'no-date';
  if (d.getTime() < agora) return 'overdue';
  if (chaveDia(d) === chaveDia(new Date(agora))) return 'today';
  return 'future';
}

// Date -> "2026-11-04T15:30"
export function paraCampo(d) {
  return `${chaveDia(d)}T${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

// "QUARTA-FEIRA, 04 DE NOVEMBRO DE 2026"
export function dataPorExtenso(d = new Date()) {
  return `${DIAS[d.getDay()]}, ${dois(d.getDate())} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`.toUpperCase();
}
