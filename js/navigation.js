// ===== NAVIGATION.JS =====
// Denna fil hanterar all navigationsrelaterad funktionalitet

// Importera nödvändiga funktioner från andra moduler
import { visaProdukter } from './products.js';

// ===== NAVIGATIONSHANTERING =====

// Funktion för att initiera navigationen - anropas från main.js när sidan laddas
export function initNavigation() {
  // Hämta alla navigationslänkar
  // querySelectorAll hämtar alla element som matchar element/CSS-väljaren
  const navLinks = document.querySelectorAll('.navigation a');

  // Lägger till händelselyssnare på varje navigationslänk
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Förhindra standardbeteendet (att navigera till en ny sida)
      e.preventDefault();
      
      // Hämta värdet på data-section attributet från den klickade länken
      const sectionId = link.getAttribute('data-section');
      
      // Anropa funktionen för att visa rätt sektion
      visaSektion(sectionId);
      
      // Om vi navigerar till produktsektionen, visa alla produkter med paginering
      if (sectionId === 'products') {
        visaProdukter("all", '#products .product-grid');
      }
    });
  });
}

// Funktion för att visa rätt sektion och dölja övriga
export function visaSektion(sectionId) {
  // Hämta alla navigationslänkar igen för att kunna uppdatera aktiv klass
  const navLinks = document.querySelectorAll('.navigation a');
  
  // Hämta alla sektioner
  const sections = document.querySelectorAll('.page-section');
  
  // Ta bort 'active' klassen från alla sektioner
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Ta bort 'active' klassen från alla navigationslänkar
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Lägg till 'active' klassen på den valda sektionen
  document.getElementById(sectionId).classList.add('active');
  
  // Lägg till 'active' klassen på den klickade navigationslänken
  document.querySelector(`.navigation a[data-section="${sectionId}"]`).classList.add('active');
}