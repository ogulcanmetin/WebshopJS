// ===== VARIABLER =====
// Skapar en tom array (lista) för att lagra produkter i kundvagnen
// Vi använder 'let' eftersom innehållet kommer att ändras när användaren lägger till eller tar bort produkter
let kundvagnsProdukter = [];

// ===== NYA PAGINERINGS-VARIABLER =====
// Variabel som lagrar alla produkter från JSON
let allaProdukter = []; 
// Variabel som håller reda på vilken sida vi visar just nu
let aktuellSida = 1;    
// Antal produkter som ska visas per sida - justera detta tal efter behov
const produkterPerSida = 6; 
// Cache för produktdata för att undvika upprepade fetch-anrop
let produktDataCache = null;

// ===== NAVIGATIONSHANTERING =====

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
      visaProdukter(null, '#products .product-grid');
    }
  });
});

// Funktion för att visa rätt sektion och dölja övriga
const visaSektion = (sectionId) => {
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
};

// ===== PRODUKTHANTERING =====

// ===== FÖRBÄTTRAD FUNKTION: VISA PRODUKTER =====
// Generell funktion för att visa produkter
// Denna funktion kan användas både för att visa några få produkter på startsidan eller alla produkter på produktsidan
// antalProdukter = null betyder att om inget antal anges, visas alla produkter med paginering
// containerSelector = '.product-grid' är standardvärdet för var produkterna ska visas
const visaProdukter = (antalProdukter = null, containerSelector = '.product-grid') => {
  // Hitta containern där produkterna ska visas
  const produktContainer = document.querySelector(containerSelector);
  
  // Kontrollera om containern finns på sidan
  if (!produktContainer) {
    console.error('Kunde inte hitta container:', containerSelector);
    return; // Avbryt funktionen om containern inte hittades
  }
  
  // Använd cache om möjligt för att förbättra prestanda
  if (produktDataCache) {
    // Om vi redan har data, använd den direkt
    hanteraProdukter(produktDataCache, antalProdukter, containerSelector, produktContainer);
  } else {
    // Hämta produkter från JSON-filen om vi inte har cachen
    fetch('produkter.json')
      .then(svar => svar.json())
      .then(data => {
        // Hämta ut produktlistan från datan
        // '||' betyder "eller" - om data.produkter inte finns används hela data-objektet istället
        produktDataCache = data.produkter || data;
        
        // Hantera produkterna efter att de hämtats
        hanteraProdukter(produktDataCache, antalProdukter, containerSelector, produktContainer);
      })
      .catch(fel => {
        // Skriver ut felmeddelandet i konsolen (för utvecklare att se)
        console.error('Fel vid hämtning av produkter:', fel);
        // Visar ett felmeddelande på sidan så att användaren förstår att något gick fel
        produktContainer.innerHTML = '<p>Kunde inte ladda produkter</p>';
      });
  }
};

// ===== NY FUNKTION: HANTERA PRODUKTER =====
// Separerar produkthanteringen från hämtning för bättre struktur och prestanda
const hanteraProdukter = (produkter, antalProdukter, containerSelector, container) => {
  // Spara alla produkter i vår globala variabel så vi kan komma åt dem senare
  allaProdukter = produkter;
  
  if (antalProdukter !== null) {
    // Om antalProdukter är specificerat, ta bara så många produkter
    // Detta används för utvalda produkter på startsidan (utan paginering)
    visaProduktLista(produkter.slice(0, antalProdukter), container);
  } else {
    // Om inget antal är specificerat, används paginering
    // Detta används vanligtvis på produktsidan
    initieraPaginering(containerSelector);
    visaSida(1, containerSelector);
  }
};

// ===== FÖRBÄTTRAD FUNKTION: VISA PRODUKTLISTA =====
// Funktion för att visa en lista av produkter i en container
// Använder DocumentFragment för mer effektiv DOM-manipulation
const visaProduktLista = (produkter, container) => {
  // Skapa ett fragment för att samla alla element innan vi sätter in dem i DOM
  // Detta förbättrar prestandan genom att minimera antal DOM-uppdateringar
  const fragment = document.createDocumentFragment();
  
  // Loopa igenom alla produkter och skapa produktkort för varje
  produkter.forEach(produkt => {
    // Skapa ett produktkort med vår skapaProduktKort-funktion
    const produktKort = skapaProduktKort(produkt);
    // Lägg till produktkortet i fragmentet (inte direkt i DOM)
    fragment.appendChild(produktKort);
  });
  
  // Rensa containern först från eventuellt tidigare innehåll
  container.innerHTML = '';
  
  // Lägg till alla produktkort på en gång för bättre prestanda
  container.appendChild(fragment);
};

// Funktion för att skapa ett produktkort för en enskild produkt
const skapaProduktKort = (produkt) => {
  // Skapar ett nytt div-element som ska bli vårt produktkort
  const produktKort = document.createElement('div');
  
  // Ger div-elementet klassen 'product-card' för styling med CSS
  produktKort.className = 'product-card';
  
  // Skapar HTML-innehållet för produktkortet
  // Vi använder backticks (`) för att kunna infoga variabler direkt i HTML-strängen med ${variabelnamn}
  // Detta kallas för "template literals" eller "strängmallar"
  produktKort.innerHTML = `
    <img src="${produkt.bild}" alt="${produkt.namn}">
    <h3>${produkt.namn}</h3>
    <p class="price">${produkt.pris} kr</p>
    <p class="brand">Märke: ${produkt.märke}</p>
    <p class="description">${produkt.beskrivning || ''}</p>
    <button class="buy-button" data-id="${produkt.id}">Lägg i kundvagn</button>
  `;
  
  // Hittar köp-knappen inuti produktkortet
  const läggTillKnapp = produktKort.querySelector('.buy-button');
  
  // Lägger till en händelselyssnare på knappen
  // När knappen klickas, körs funktionen läggTillProduktIKundvagn med produkten som parameter
  läggTillKnapp.addEventListener('click', () => {
    läggTillProduktIKundvagn(produkt);
  });
  
  // Returnerar det färdiga produktkortet
  return produktKort;
};

// ===== KUNDVAGNSHANTERING =====

// Funktion som lägger till en produkt i kundvagnen
const läggTillProduktIKundvagn = (produkt) => {
  // Lägger till produkten i kundvagnslistan
  // push är en array-metod som lägger till ett element i slutet av arrayen
  kundvagnsProdukter.push(produkt);
  
  // Visar en bekräftelse för användaren att produkten har lagts till
  // alert visar en dialogruta med ett meddelande
  alert(`${produkt.namn} har lagts till i kundvagnen!`);
  
  // Uppdaterar kundvagnsvyn så att den visar de aktuella produkterna
  uppdateraKundvagnsVy();
  
  // Skriver ut kundvagnen i konsolen för felsökning
  // Detta syns inte för användaren utan är för utvecklare
  console.log('Kundvagn:', kundvagnsProdukter);
};

// ===== FÖRBÄTTRAD FUNKTION: UPPDATERA KUNDVAGNSVYN =====
// Funktion för att uppdatera kundvagnsvyn i gränssnittet
// Använder DocumentFragment för mer effektiv DOM-manipulation
const uppdateraKundvagnsVy = () => {
  // Hittar HTML-elementet för kundvagnen
  const kundvagnsContainer = document.getElementById('shopping-cart');
  
  // Kontrollera om kundvagnscontainern finns på sidan
  if (!kundvagnsContainer) {
    console.error('Kunde inte hitta kundvagnscontainer');
    return; // Avbryt funktionen om containern inte hittades
  }
  
  // Skapa ett fragment för bättre prestanda
  const fragment = document.createDocumentFragment();
  
  // Skapar en variabel för att hålla reda på totalsumman
  let totalSumma = 0;
  
  // Går igenom varje produkt i kundvagnen
  // Arrow function med två parametrar: produkt och index
  kundvagnsProdukter.forEach((produkt, index) => {
    // Skapar en ny rad för produkten i kundvagnen
    const kundvagnsRad = skapaKundvagnsRad(produkt, index);
    
    // Lägger till raden i fragmentet
    fragment.appendChild(kundvagnsRad);
    
    // Lägger till produktens pris till totalsumman
    totalSumma += produkt.pris;
  });
  
  // Rensar nuvarande innehåll i kundvagnen
  kundvagnsContainer.innerHTML = '';
  
  // Lägger till alla rader på en gång
  kundvagnsContainer.appendChild(fragment);
  
  // Uppdaterar totalsumman i HTML-element med id 'cart-total'
  const totalElement = document.getElementById('cart-total');
  if (totalElement) {
    totalElement.textContent = totalSumma;
  }
};

// Funktion för att skapa en rad i kundvagnen för en produkt
const skapaKundvagnsRad = (produkt, index) => {
  // Skapar ett nytt div-element för kundvagnsraden
  const kundvagnsRad = document.createElement('div');
  
  // Ger elementet klassen 'cartItem' för styling med CSS
  kundvagnsRad.className = 'cartItem';
  
  // Skapar HTML-innehållet för kundvagnsraden
  kundvagnsRad.innerHTML = `
    <span class="item-name">${produkt.namn}</span>
    <span class="item-price">${produkt.pris} kr</span>
    <button class="remove-btn">X</button>
  `;
  
  // Hittar ta bort-knappen
  const taBortKnapp = kundvagnsRad.querySelector('.remove-btn');
  
  // Lägger till en händelselyssnare på ta bort-knappen
  // När knappen klickas, körs funktionen taBortProduktFrånKundvagn med produktens index
  taBortKnapp.addEventListener('click', () => {
    taBortProduktFrånKundvagn(index);
  });
  
  // Returnerar den färdiga kundvagnsraden
  return kundvagnsRad;
};

// Funktion för att ta bort en produkt från kundvagnen
const taBortProduktFrånKundvagn = (index) => {
  // Tar bort produkten på det angivna indexet från kundvagnslistan
  // splice ändrar innehållet i en array genom att ta bort element
  // Första parametern är startpositionen, andra är antalet element att ta bort
  kundvagnsProdukter.splice(index, 1);
  
  // Uppdaterar kundvagnsvyn så att den visar de aktuella produkterna
  uppdateraKundvagnsVy();
};

// ===== PAGINERING - FÖRBÄTTRADE FUNKTIONER =====

// ===== FÖRBÄTTRAD FUNKTION: VISA SIDA =====
// Funktion för att visa en specifik sida av produkter
// sidnummer = vilken sida som ska visas
// containerSelector = CSS-väljare för elementet där produkterna ska visas
const visaSida = (sidnummer, containerSelector) => {
  // Hitta container-elementet där produkterna ska visas
  const container = document.querySelector(containerSelector);
  
  // Beräkna start- och slutindex för produkterna på den aktuella sidan
  // Om vi har 6 produkter per sida:
  // Sida 1: start=0, slut=6
  // Sida 2: start=6, slut=12
  // osv...
  const start = (sidnummer - 1) * produkterPerSida;
  const slut = start + produkterPerSida;
  
  // Hämta bara produkterna för denna sida med slice (skär ut en del av arrayen)
  const sidaProdukter = allaProdukter.slice(start, slut);
  
  // Visa produkterna för denna sida
  visaProduktLista(sidaProdukter, container);
  
  // Uppdatera sidnummer-texten
  const sidnummerElement = document.getElementById('page-num');
  if (sidnummerElement) {
    sidnummerElement.textContent = `Sida ${sidnummer}`;
  }
  
  // Spara aktuell sida i vår globala variabel
  aktuellSida = sidnummer;
  
  // Uppdatera knapparnas status (aktivera/inaktivera)
  uppdateraKnappStatus();
};

// ===== FÖRBÄTTRAD FUNKTION: INITIERA PAGINERING =====
// Funktion för att initiera paginering - lägg till händelselyssnare på knapparna
// Använder onclick istället för addEventListener för enklare hantering
// containerSelector = CSS-väljare för elementet där produkterna ska visas
const initieraPaginering = (containerSelector) => {
  // Hitta knapparna för föregående och nästa sida
  const föregåendeKnapp = document.getElementById('prev-page');
  const nästaKnapp = document.getElementById('next-page');
  
  // Kontrollera om knapparna finns på sidan
  if (föregåendeKnapp && nästaKnapp) {
    // Istället för att klona elementen för att ta bort lyssnare
    // tilldelar vi direkt nya onclick-funktioner
    // När man tilldelar onclick ersätts alla tidigare onclick-funktioner
    föregåendeKnapp.onclick = () => {
      // Om vi inte är på första sidan, gå till föregående sida
      if (aktuellSida > 1) {
        visaSida(aktuellSida - 1, containerSelector);
      }
    };
    
    nästaKnapp.onclick = () => {
      // Om det finns fler produkter att visa, gå till nästa sida
      if (aktuellSida * produkterPerSida < allaProdukter.length) {
        visaSida(aktuellSida + 1, containerSelector);
      }
    };
    
    // Uppdatera knapparnas status direkt
    uppdateraKnappStatus();
  }
};

// ===== FUNKTION: UPPDATERA KNAPPSTATUS =====
// Funktion för att uppdatera knapparnas status (aktivera/inaktivera)
const uppdateraKnappStatus = () => {
  // Hitta knapparna för föregående och nästa sida
  const föregåendeKnapp = document.getElementById('prev-page');
  const nästaKnapp = document.getElementById('next-page');
  
  // Om föregående-knappen finns, inaktivera den om vi är på första sidan
  if (föregåendeKnapp) {
    föregåendeKnapp.disabled = aktuellSida === 1;
  }
  
  // Om nästa-knappen finns, inaktivera den om vi är på sista sidan
  if (nästaKnapp) {
    nästaKnapp.disabled = aktuellSida * produkterPerSida >= allaProdukter.length;
  }
};

// ===== SÖKFUNKTION - FÖRBÄTTRADE FUNKTIONER =====

// ===== FÖRBÄTTRAD FUNKTION: INITIALISERA SÖKFUNKTION =====
// Lägger till händelselyssnare för sökfunktionen när sidan har laddats
// Använder en enda händelselyssnare för hela dokumentet
document.addEventListener('DOMContentLoaded', () => {
  // Hitta sökknappen och sökfältet
  const sökKnapp = document.getElementById('search-button');
  const sökFält = document.getElementById('search-input');
  
  // Kontrollera om sökknappen och sökfältet finns på sidan
  if (sökKnapp && sökFält) {
    // Lägg till händelselyssnare för klick på sökknappen
    sökKnapp.onclick = () => {
      // Anropa sökfunktionen när knappen klickas
      sökProdukter();
    };
    
    // Lägg till möjlighet att söka genom att trycka Enter i sökfältet
    sökFält.onkeyup = (event) => {
      // Kontrollera om användaren tryckte på Enter-tangenten
      if (event.key === 'Enter') {
        // Anropa sökfunktionen när Enter trycks
        sökProdukter();
      }
    };
  }
});

// ===== FÖRBÄTTRAD FUNKTION: SÖK PRODUKTER =====
// Funktion för att söka produkter baserat på märke
// Mer optimerad hantering av DOM och återanvändning av element
const sökProdukter = () => {
  // Hitta produktcontainern en gång
  const produktContainer = document.querySelector('#products .product-grid');
  const pagineringElement = document.querySelector('.pagination-controls');
  
  // Hämta sökfältet och det användaren har skrivit
  const sökFält = document.getElementById('search-input');
  // Konvertera söktermen till gemener för att göra sökningen icke-skiftlägeskänslig
  const sökTerm = sökFält.value.toLowerCase().trim();
  
  // Ta bort eventuella tidigare sökresultat-element
  rensaSökResultatElement();
  
  // Om söktermen är tom, visa alla produkter med paginering
  if (sökTerm === '') {
    // Visa pagineringen igen
    if (pagineringElement) {
      pagineringElement.style.display = 'block';
    }
    
    visaProdukter(null, '#products .product-grid');
    return;
  }
  
  // Filtrera produkterna baserat på märke och namn för bättre sökträffar
  const filtreredeProdukter = allaProdukter.filter(produkt => 
    produkt.märke.toLowerCase().includes(sökTerm) || 
    produkt.namn.toLowerCase().includes(sökTerm)
  );
  
  // Dölj pagineringen när vi visar sökresultat
  if (pagineringElement) {
    pagineringElement.style.display = 'none';
  }
  
  // Om inga produkter hittades
  if (filtreredeProdukter.length === 0) {
    // Visa ett meddelande om att inga produkter hittades
    produktContainer.innerHTML = '<p>Inga produkter hittades som matchar söktermen.</p>';
    return;
  }
  
  // Visa de filtrerade produkterna utan paginering
  visaProduktLista(filtreredeProdukter, produktContainer);
  
  // Skapa element för sökresultatinformation
  skapaResultatInfo(sökTerm, filtreredeProdukter.length, produktContainer);
};

// ===== NY FUNKTION: RENSA SÖKRESULTAT ELEMENT =====
// Separerar borttagning av gamla element för bättre struktur
const rensaSökResultatElement = () => {
  // Ta bort eventuella tidigare sökresultat-information och rensa-knappar
  const gammalInfo = document.querySelector('.search-results-info');
  const gammalKnapp = document.querySelector('.clear-search-button');
  
  if (gammalInfo) gammalInfo.remove();
  if (gammalKnapp) gammalKnapp.remove();
};

// ===== NY FUNKTION: SKAPA RESULTATINFO =====
// Separerar skapande av resultatinfo för bättre struktur
const skapaResultatInfo = (sökTerm, antalResultat, container) => {
  // Skapa ett element för att visa information om hur många produkter som hittades
  const infoElement = document.createElement('p');
  infoElement.className = 'search-results-info';
  infoElement.textContent = `Visar ${antalResultat} produkter som matchar "${sökTerm}"`;
  
  // Skapa en knapp för att rensa sökningen och visa alla produkter igen
  const rensaKnapp = document.createElement('button');
  rensaKnapp.textContent = 'Visa alla produkter';
  rensaKnapp.className = 'clear-search-button';
  
  // Lägg till händelselyssnare på rensa-knappen
  rensaKnapp.onclick = () => {
    // Rensa sökfältet
    document.getElementById('search-input').value = '';
    
    // Visa alla produkter igen med paginering
    visaProdukter(null, '#products .product-grid');
    
    // Visa pagineringen igen
    const pagineringElement = document.querySelector('.pagination-controls');
    if (pagineringElement) {
      pagineringElement.style.display = 'block';
    }
    
    // Ta bort sökresultat-informationen och rensa-knappen
    rensaSökResultatElement();
  };
  
  // Lägg till information och rensa-knapp före produkterna
  container.insertAdjacentElement('beforebegin', infoElement);
  infoElement.insertAdjacentElement('afterend', rensaKnapp);
};

// ===== INITIERING =====

// Ladda utvalda produkter på startsidan när sidan laddas
// Visar de 3 första produkterna i containern för utvalda produkter
visaProdukter(3, '.featured-products .product-grid');

// Rensa bort exempel-kundvagnsrader (de som finns i HTML som platshållare)
uppdateraKundvagnsVy();