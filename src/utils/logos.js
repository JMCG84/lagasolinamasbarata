export function getStationLogo(name) {
  if (!name) return null;
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('repsol')) return 'https://logo.clearbit.com/repsol.com';
  if (lowerName.includes('cepsa')) return 'https://logo.clearbit.com/cepsa.es';
  if (lowerName.includes('galp')) return 'https://logo.clearbit.com/galp.com';
  if (lowerName.includes('bp') || lowerName.includes('b.p.')) return 'https://logo.clearbit.com/bp.com';
  if (lowerName.includes('shell')) return 'https://logo.clearbit.com/shell.com';
  if (lowerName.includes('petronor')) return 'https://logo.clearbit.com/petronor.eus';
  if (lowerName.includes('avia')) return 'https://logo.clearbit.com/aviaenergias.es';
  if (lowerName.includes('ballenoil')) return 'https://logo.clearbit.com/ballenoil.es';
  if (lowerName.includes('plenoil')) return 'https://logo.clearbit.com/plenoil.es';
  if (lowerName.includes('carrefour')) return 'https://logo.clearbit.com/carrefour.es';
  if (lowerName.includes('alcampo')) return 'https://logo.clearbit.com/alcampo.es';
  if (lowerName.includes('eroski')) return 'https://logo.clearbit.com/eroski.es';
  if (lowerName.includes('leclerc') || lowerName.includes('e.leclerc')) return 'https://logo.clearbit.com/e-leclerc.es';
  if (lowerName.includes('valcarce')) return 'https://logo.clearbit.com/grupovalcarce.com';
  if (lowerName.includes('petroprix')) return 'https://logo.clearbit.com/petroprix.com';
  if (lowerName.includes('q8')) return 'https://logo.clearbit.com/q8.es';
  if (lowerName.includes('texaco')) return 'https://logo.clearbit.com/texaco.com';
  if (lowerName.includes('campsa')) return 'https://logo.clearbit.com/repsol.com'; // Campsa belongs to Repsol group

  return null;
}
