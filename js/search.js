// ===== IMPORT =====
// Importerar endast de funktioner vi faktiskt använder för att visa produkter
import { visaProdukter, visaProduktLista } from './products.js';

// ===== SÖKFUNKTION =====
// Denna fil hanterar sökfunktionalitet för produktsidan

/**
 * Funktion för att initiera sökfunktionen
 * Kopplar sökknapp och sökfält till händelsehanterare
 * Anropas en gång när produktsidan laddas
 */
export function initSök() {
  // Hämtar referens till sökknappen och sökfältet från DOM-trädet
  const sökKnapp = document.getElementById('search-button');
  const sökFält = document.getElementById('search-input');
  
  // Kontrollerar att både sökknappen och sökfältet faktiskt finns på sidan
  if (sökKnapp && sökFält) {
    // Lägger till en klickhändelse på sökknappen
    sökKnapp.onclick = () => {
      sökProdukter(); // Anropar sökfunktionen när knappen klickas på
    };
    
    // Lägger till en tangentbordshändelse på sökfältet
    sökFält.onkeyup = (event) => {
      // Om användaren trycker på Enter-tangenten startar sökningen
      if (event.key === 'Enter') {
        sökProdukter();
      }
    };
  }
}

/**
 * Huvudfunktion som utför själva sökningen
 * Filtrerar produkter baserat på märke/varumärke
 * Användaren kan söka på märken som "Nike", "Adidas", "New Balance", etc.
 * Sökningen är inte skiftlägeskänslig (söker i både stora och små bokstäver)
 */
export function sökProdukter() {
  // Hämtar referens till produktvisningsområdet
  const visningsområde = document.querySelector('#products .product-grid');
  
  // Hämtar sökfältet
  const sökFält = document.getElementById('search-input');
  
  // Hämtar söktermen från sökfältet, omvandlar till gemener och tar bort extra mellanslag
  const sökTerm = sökFält.value.toLowerCase().trim();
  
  // Om söktermen är tom (användaren har inte skrivit något), visa alla produkter
  if (sökTerm === '') {
    visaProdukter('all', '#products .product-grid');
    // Avbryter funktionen tidigt med return
    return;
  }
  
  // Filtrerar produkter baserat på märke/varumärke
  // Funktionen filter() skapar en ny array med alla produkter där märket matchar söktermen
  // includes() kollar om söktermen finns någonstans i märkesnamnet
  const matchandeProdukter = window.allaProdukter.filter(produkt => 
    produkt.märke.toLowerCase().includes(sökTerm)
  );
  
  // Visar de matchande produkterna i produktvisningsområdet
  // Om inga produkter matchade söktermen kommer en tom lista att visas
  visaProduktLista(matchandeProdukter, visningsområde);
  
  // Visar information om sökresultatet (kan läggas till här om önskat)
  // Till exempel: "Visar X produkter som matchar 'sökterm'"
}