    // Importera endast de funktioner som faktiskt används
    import { läggTillProduktIKundvagn } from './cart.js';
    import { initieraPaginering, visaSida } from './pagination.js';

    // ===== PRODUKTHANTERING =====

    // Funktion för att visa produkter med endast visningsElement
    // Bygger en butik där jag först hämtar alla varor från lagret (JSON-filen)
    // Sedan ställer jag ut dem på hyllorna (product-grid)
    // Och slutligen sätter upp prislapper och kassaapparater (köp-knappar)
    export function visaProdukter(antalProdukterAttVisa, elementSelector = '.product-grid') {
    // Hitta elementet där produkterna ska visas
    const visningsElement = document.querySelector(elementSelector);
    
    // Hämta produkter från JSON-filen
    fetch('produkter.json')
        .then(svar => svar.json())
        .then(data => {
        // Hämta ut produktlistan från datan
        let allaProdukterFrånJSON = data.produkter || data;
        
        // Gör produkterna tillgängliga globalt
        window.allaProdukter = allaProdukterFrånJSON;
        
        // Om vi ska visa exakt 3 produkter (startsidan)
        if (antalProdukterAttVisa === 3) {
            const utvaldaProdukter = allaProdukterFrånJSON.slice(0, 3);
            visaProduktLista(utvaldaProdukter, visningsElement);
            return; // Avsluta funktionen här
        }
    
        // Om vi ska visa alla produkter med paginering (produktsidan)
        //(snabblösning)
        if (antalProdukterAttVisa === "all") {
        // Använd endast visningsElement i båda funktionsanropen
            initieraPaginering(visningsElement);
            return; // Avsluta funktionen här
        }
        
        })
        .catch(fel => {
        console.error('Fel vid hämtning av produkter:', fel);
        visningsElement.innerHTML = '<p>Kunde inte ladda produkter</p>';
        });
    }

    // I visaProduktLista-funktionen
    // Tar 2 parametrar
    export function visaProduktLista(produkter, element) {
        // Rensa elementet först
        element.innerHTML = '';
        
        // Skapa all HTML på en gång istället för att lägga till ett element i taget
        let allHTML = '';
        
        produkter.forEach(produkt => {
        allHTML += `
            <div class="product-card">
            <img src="${produkt.bild}" alt="${produkt.namn}">
            <h3>${produkt.namn}</h3>
            <p class="price">${produkt.pris} kr</p>
            <p class="brand">Märke: ${produkt.märke}</p>
            <p class="description">${produkt.beskrivning || ''}</p>
            <button class="buy-button" data-id="${produkt.id}">Lägg i kundvagn</button>
            </div>
        `;
        });
        
        // Sätter all HTML på en gång (mycket snabbare)
        element.innerHTML = allHTML;
        
        // Lägg till händelselyssnare efter att all HTML är på plats
        const allaBuyButtons = element.querySelectorAll('.buy-button');
        allaBuyButtons.forEach(knapp => {
        knapp.addEventListener('click', (e) => {
            console.log("Köpknapp klickad!"); // Detta bör synas i konsolen
            const produktId = knapp.getAttribute('data-id');
            const produkt = window.allaProdukter.find(p => p.id == produktId);
            // kontroll som säkerställer att produkten verkligen hittades innan den försöker lägga till den i kundvagnen
            if (produkt) {
                console.log("Produkt hittad:", produkt.namn); // Bekräfta att produkten hittas
                läggTillProduktIKundvagn(produkt);
            }
        });
        });
    }