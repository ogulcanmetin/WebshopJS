// Importera funktionen vi behöver
import { visaProduktLista } from './products.js';

// ===== PAGINERING =====

// Håller reda på vilken sida vi är på just nu
let aktuellSida = 1;    
// Hur många produkter vi visar per sida
const produkterPerSida = 6; 

// Starta paginering genom att lägga till klick-händelser på knapparna
export function initieraPaginering(visningsElement) {
  // Hitta knapparna
  const föregåendeKnapp = document.getElementById('prev-page');
  const nästaKnapp = document.getElementById('next-page');
  
  // När någon klickar på Föregående-knappen
  föregåendeKnapp.onclick = () => {
    if (aktuellSida > 1) {
      visaSida(aktuellSida - 1, visningsElement);
    }
  };
  
  // När någon klickar på Nästa-knappen
  nästaKnapp.onclick = () => {
    const sistaIndex = window.allaProdukter.length;
    const sistaIndexPåAktuellSida = aktuellSida * produkterPerSida;
    
    if (sistaIndexPåAktuellSida < sistaIndex) {
      visaSida(aktuellSida + 1, visningsElement);
    }
  };
  
  // Sätt knapparnas ursprungliga status
  uppdateraKnappStatus();
  
  // Visa första sidan direkt vid initiering
  visaSida(1, visningsElement);
}

// Visa en specifik sida med produkter
export function visaSida(sidnummer, visningsElement) {
  // Hämta produkter för just denna sida
  const start = (sidnummer - 1) * produkterPerSida;
  const slut = start + produkterPerSida;
  const sidaProdukter = window.allaProdukter.slice(start, slut);
  
  // Visa produkterna
  visaProduktLista(sidaProdukter, visningsElement);
  
  // Uppdatera sidnummer-texten
  const sidnummerElement = document.getElementById('page-num');
  if (sidnummerElement) {
    sidnummerElement.textContent = `Sida ${sidnummer}`;
  }
  
  // Spara vilken sida vi är på
  aktuellSida = sidnummer;
  
  // Uppdatera knapparna (aktivera/inaktivera)
  uppdateraKnappStatus();
}

// Uppdatera knapparnas status (aktivera/inaktivera)
function uppdateraKnappStatus() {
  const föregåendeKnapp = document.getElementById('prev-page');
  const nästaKnapp = document.getElementById('next-page');
  
  // Inaktivera Föregående-knappen om vi är på första sidan
  föregåendeKnapp.disabled = (aktuellSida === 1);
  
  // Inaktivera Nästa-knappen om vi är på sista sidan
  const meraProdukterFinns = (aktuellSida * produkterPerSida) < window.allaProdukter.length;
  nästaKnapp.disabled = !meraProdukterFinns;
}