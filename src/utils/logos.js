export function getStationLogo(name) {
  if (!name) return null;
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('repsol') || lowerName.includes('campsa')) return 'https://icon.horse/icon/repsol.com';
  if (lowerName.includes('cepsa')) return 'https://icon.horse/icon/cepsa.es';
  if (lowerName.includes('galp')) return 'https://icon.horse/icon/galp.com';
  if (lowerName.includes('bp') || lowerName.includes('b.p.')) return 'https://icon.horse/icon/bp.com';
  if (lowerName.includes('shell')) return 'https://icon.horse/icon/shell.es';
  if (lowerName.includes('petronor')) return 'https://icon.horse/icon/petronor.eus';
  if (lowerName.includes('carrefour')) return 'https://icon.horse/icon/carrefour.es';
  if (lowerName.includes('alcampo')) return 'https://icon.horse/icon/alcampo.es';
  if (lowerName.includes('eroski')) return 'https://icon.horse/icon/eroski.es';
  if (lowerName.includes('leclerc') || lowerName.includes('e.leclerc')) return 'https://icon.horse/icon/e-leclerc.es';
  if (lowerName.includes('avia')) return 'https://icon.horse/icon/aviaenergias.es';
  if (lowerName.includes('texaco')) return 'https://icon.horse/icon/texaco.com';
  if (lowerName.includes('ballenoil')) return 'https://icon.horse/icon/ballenoil.es';
  if (lowerName.includes('plenoil')) return 'https://icon.horse/icon/plenoil.es';
  if (lowerName.includes('petroprix')) return 'https://icon.horse/icon/petroprix.com';
  if (lowerName.includes('valcarce')) return 'https://icon.horse/icon/grupovalcarce.com';

  return null;
}
