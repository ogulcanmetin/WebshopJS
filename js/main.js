// Importerar alla moduler
import { initNavigation } from './navigation.js';
import { visaProdukter } from './products.js';
import { uppdateraKundvagnsVy } from './cart.js';
import { initSök } from './search.js';

// Global variabel för produkter
let allaProdukter = [];

// Exporterar den så att andra moduler kan använda den
export { allaProdukter };

// Initiering när sidan laddas
// Sidan laddas först (med DOMcontentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    
    // Visa startprodukter och uppdatera kundvagnen
    visaProdukter(3, '.featured-products .product-grid');
    uppdateraKundvagnsVy();
    
    // Istället för att köra initSök direkt, väntar vi tills användaren går till produktsidan
    // Detta gör att startsidan laddas snabbare
    const produktLänk = document.querySelector('a[data-section="products"]');
    if (produktLänk) {
        produktLänk.addEventListener('click', () => {
            // Initiera sök bara om det inte redan har gjorts
            if (!window.sökInitierad) {
                initSök();
                window.sökInitierad = true;
            }
        });
    }
});