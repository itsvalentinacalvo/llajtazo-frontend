export function formatSpanishDate(dt: Date): string {
  const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
  ];
  const day = dt.getDate().toString().padStart(2, "0");
  const monthName = months[dt.getMonth()];
  const year = dt.getFullYear();
  return `${day} de ${monthName}, ${year}`;
}

export function formatSpanishTime(dt: Date): string {
  const hours = dt.getHours();
  const minutes = dt.getMinutes().toString().padStart(2, "0");
  const suffix = hours >= 12 ? "pm" : "am";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${h12}:${minutes} ${suffix}`;
}

export function dayOfWeekSpanish(dt: Date): string {
  const days = [
    "Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado",
  ];
  return days[dt.getDay()];
}

export function badgePartsFromDate(dt: Date): { day: string; monthAbbr: string } {
  const monthsAbbr = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  return { day: dt.getDate().toString(), monthAbbr: monthsAbbr[dt.getMonth()] };
}

export function parseIsoToDate(iso: string): Date {
  return new Date(iso);
}