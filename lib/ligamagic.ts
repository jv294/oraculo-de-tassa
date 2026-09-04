/**
 * Utilitário para gerar URLs de busca no LigaMagic
 */
export function buildLigaMagicUrl(cardName: string, printedName?: string): string {
  // Prioriza o nome em português (printedName) caso a API do scryfall tenha retornado
  const nameToSearch = printedName || cardName;
  
  // O LigaMagic substitui lidar bem com espaços sendo codificados para + ou %20.
  // Usamos encodeURIComponent para segurança máxima nas URLs (substituindo o padrão '&', '?' etc que existam no nome)
  const encodedName = encodeURIComponent(nameToSearch);
  
  return `https://www.ligamagic.com.br/?view=cards/search&card=${encodedName}`;
}
