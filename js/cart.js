// ===== KUNDVAGNSHANTERING =====
// Denna fil hanterar all funktionalitet kopplad till kundvagnen

// Array som lagrar alla produkter som användaren har lagt till i kundvagnen
// Denna array fungerar som en databas för kundvagnen
let kundvagnsProdukter = [];

/**
 * Lägger till en produkt i kundvagnen
 * Anropas när användaren klickar på "Lägg i kundvagn"-knappen på en produkt
 * @param {Object} produkt - Produktobjekt med egenskaper som namn, pris, etc.
 */
export function läggTillProduktIKundvagn(produkt) {

    // Enkel kontroll om produkten är tillgänglig i lager
    if (produkt.lagerStatus <= 0) {
        // Produkten är slut i lager
        alert(`Tyvärr är ${produkt.namn} slut i lager!`);
        return; // Avbryt funktionen här
    }
    
    // Lägger till produkten i vår kundvagnsarray
    kundvagnsProdukter.push(produkt);
    
    // Minska lagerstatusen med 1 när en produkt läggs till
    produkt.lagerStatus -= 1;
    
    // Visar ett meddelande i konsolen (syns endast i utvecklarverktygen med F12)
    // Detta är mycket snabbare än alert() eftersom det inte blockerar användargränssnittet
    //alert(`${produkt.namn} har lagts till i kundvagnen!`);
    console.log(`${produkt.namn} har lagts till i kundvagnen!`);
    
    // Uppdaterar användargränssnittet så att den nya produkten visas i kundvagnen
    uppdateraKundvagnsVy();
}

/**
 * Uppdaterar kundvagnsvyn i gränssnittet
 * Denna funktion bygger all HTML för kundvagnen på en gång, vilket är mycket snabbare
 * än att manipulera DOM-trädet element för element
 */
export function uppdateraKundvagnsVy() {
  // Hittar HTML-elementet där kundvagnsinnehållet ska visas
  const kundvagnsContainer = document.getElementById('shopping-cart');
  
  // Kontroll om container-elementet finns på sidan
  if (!kundvagnsContainer) {
    console.error('Kunde inte hitta kundvagnscontainer med id "shopping-cart"');
    return; // Avbryter funktionen om elementet inte hittades
  }
  
  // Variabel för att lagra den totala summan av produkterna i kundvagnen
  let totalSumma = 0;
  
  // VIKTIGT: Skapar en sträng för all HTML på en gång 
  // Detta är mycket snabbare än att bygga DOM-element ett i taget
  let allHTML = '';
  
  // Går igenom varje produkt i kundvagnen
  kundvagnsProdukter.forEach((produkt, produktIndex) => {
    // För varje iteration får 'produkt' värdet av den aktuella produkten
    // och 'produktIndex' får värdet av produktens position i arrayen (0, 1, 2, osv)
    
    // Lägger till HTML för varje produkt i vår sträng
    // Attributet 'data-produktIndex' lagrar produktens index i arrayen
    // Detta attribut används senare för att identifiera vilken produkt som ska tas bort
    allHTML += `
      <div class="cartItem">
        <span class="item-name">${produkt.namn}</span>
        <span class="item-price">${produkt.pris} kr</span>
        <button class="remove-btn" data-produktIndex="${produktIndex}">X</button>
      </div>
    `;
    
    // Adderar denna produkts pris till den totala summan
    totalSumma += produkt.pris;
  });
  
  // SNABB UPPDATERING: Sätter all HTML på en gång till containern
  // Detta minimerar DOM-manipulationer och gör sidan mycket snabbare
  // än att lägga till ett element i taget
  kundvagnsContainer.innerHTML = allHTML;
  
  // Uppdaterar elementet som visar totalbeloppet
  // Uppdaterar elementet som visar totalbeloppet
  const totalBelopp = document.getElementById('cart-total');
  if (totalBelopp) {  // Kontrollerar om elementet finns
    totalBelopp.textContent = totalSumma;
 }
  
  // VIKTIGT: Lägger till händelselyssnare EFTER att HTML har lagts till
  // Detta måste göras eftersom innerHTML ersätter alla tidigare element
  // och deras händelselyssnare
  
  // Väljer alla ta-bort-knappar i kundvagnen
  const allaTaBortKnappar = kundvagnsContainer.querySelectorAll('.remove-btn');
  
  // Lägger till en händelselyssnare på varje knapp
  allaTaBortKnappar.forEach(knapp => {
    knapp.addEventListener('click', (e) => {
      // När knappen klickas, hämtar vi produktens index från data-attributet
      // getAttribute hämtar värdet på ett HTML-attribut
      // data-produktIndex är attributet vi skapade tidigare i HTML-koden
      // parseInt konverterar strängen till ett heltal
      const produktIndex = parseInt(knapp.getAttribute('data-produktIndex'));
      
      // Anropar funktionen för att ta bort produkten med det specifika indexet
      taBortProduktFrånKundvagn(produktIndex);
    });
  });
}

/**
 * Tar bort en produkt från kundvagnen baserat på dess index
 * @param {number} produktIndex - Index för produkten som ska tas bort från kundvagnsarrayen
 */
export function taBortProduktFrånKundvagn(produktIndex) {
  // Tar bort produkten från vår kundvagnsarray
  // splice() ändrar originalarrayen genom att ta bort element
  // Första argumentet är startindex (vilken position vi vill börja ta bort från)
  // Andra argumentet är antal element att ta bort (i detta fall 1)
  // Spara referens till produkten först, innan den tas bort
  const borttagen = kundvagnsProdukter[produktIndex];

  // Öka lagerstatusen igen när produkten tas bort
  borttagen.lagerStatus += 1;
  
  kundvagnsProdukter.splice(produktIndex, 1);
  
  // Uppdaterar kundvagnsvyn så att den speglar förändringen
  // Vi behöver bygga om hela vyn eftersom produkterna har ändrats
  uppdateraKundvagnsVy();
}