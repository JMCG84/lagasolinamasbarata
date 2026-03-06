export function getStationLogo(name) {
  if (!name) return null;
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('repsol') || lowerName.includes('campsa')) return 'https://upload.wikimedia.org/wikipedia/commons/8/82/Repsol_logo.svg';
  if (lowerName.includes('cepsa')) return 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Cepsa_Logo.svg';
  if (lowerName.includes('galp')) return 'https://upload.wikimedia.org/wikipedia/commons/d/da/Galp_Energia_logo.svg';
  if (lowerName.includes('bp') || lowerName.includes('b.p.')) return 'https://upload.wikimedia.org/wikipedia/commons/a/a2/BP_logo_2000.svg';
  if (lowerName.includes('shell')) return 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Shell_logo.svg';
  if (lowerName.includes('petronor')) return 'https://upload.wikimedia.org/wikipedia/commons/1/15/Petronor_logo.svg';
  if (lowerName.includes('carrefour')) return 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Carrefour_logo.svg';
  if (lowerName.includes('alcampo')) return 'https://upload.wikimedia.org/wikipedia/commons/1/18/Alcampo_logo.svg';
  if (lowerName.includes('eroski')) return 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Eroski_logo.svg';
  if (lowerName.includes('leclerc') || lowerName.includes('e.leclerc')) return 'https://upload.wikimedia.org/wikipedia/commons/b/b3/E.Leclerc_logo.svg';
  if (lowerName.includes('avia')) return 'https://upload.wikimedia.org/wikipedia/commons/4/4c/AVIA_logo.svg';
  if (lowerName.includes('texaco')) return 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Texaco_logo.svg';
  if (lowerName.includes('ballenoil')) return 'https://icon.horse/icon/ballenoil.es';
  if (lowerName.includes('plenoil')) return 'https://icon.horse/icon/plenoil.es';
  if (lowerName.includes('petroprix')) return 'https://icon.horse/icon/petroprix.com';
  if (lowerName.includes('valcarce')) return 'https://icon.horse/icon/grupovalcarce.com';

  return null;
}
