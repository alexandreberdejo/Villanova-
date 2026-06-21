const detail = document.getElementById('detail');


async function chargerDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        afficherErreur('Événement introuvable. Veuillez retourner à la liste.');
        return;
    }

    const stocke = sessionStorage.getItem('evenement');
    if (stocke) {
        try {
            const e = JSON.parse(stocke);
            afficher(e);
            return;
        } catch (err) {
            // continue vers l'API si JSON corrompu
        }
    }

    try {
        const url = `https://api.openagenda.com/v2/agendas/92498485/events/${id}?key=ba35a5e5f7e844ce8398aaab8e5a0db7`;
        const reponse = await fetch(url);
        const donnees = await reponse.json();
        if (donnees.event) {
            afficher(donnees.event);
        } else {
            afficherErreur('Événement introuvable.');
        }
    } catch (erreur) {
        afficherErreur('Impossible de charger cet événement. Vérifiez votre connexion internet.');
    }
}


function afficher(e) {
    const titre = obtenirTexte(e.title);
    const description = obtenirTexte(e.description) || 'Pas de description disponible.';
    const cat = obtenirCategorie(e);
    const lieu = e.location?.name || 'Marseille';
    const adresse = e.location?.address || '';
    const date = formaterDate(e.timings?.[0]?.begin);
    const tarif = obtenirTexte(e.conditions) || 'Voir sur place';
    // Image : reconstituer l'URL complète (base = préfixe CDN, filename = nom du fichier)
    const imageBase = (e.image?.base && e.image?.filename)
        ? e.image.base + e.image.filename
        : null;

    document.title = titre + ' - VillaNova';
    detail.innerHTML = '';

    const article = document.createElement('article');
    article.className = 'detail-contenu';

    // === IMAGE ===
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.alt = titre;
    img.setAttribute('loading', 'lazy');
    img.width = 800;
    img.height = 400;

    if (imageBase) {
        img.src = imageBase;
        img.onerror = function() {
            this.onerror = null;
            this.src = 'https://picsum.photos/seed/' + encodeURIComponent(titre) + '/800/400';
        };
    } else {
        img.src = 'https://picsum.photos/seed/' + encodeURIComponent(titre) + '/800/400';
    }

    picture.appendChild(img);
    article.appendChild(picture);

    // === BLOC INFOS ===
    const infos = document.createElement('div');
    infos.className = 'detail-infos';

    const spanCat = document.createElement('span');
    spanCat.className = 'categorie';
    spanCat.textContent = cat;
    infos.appendChild(spanCat);

    const h2 = document.createElement('h2');
    h2.textContent = titre;
    infos.appendChild(h2);

    const pratique = document.createElement('div');
    pratique.className = 'pratique';
    pratique.appendChild(creerLigneInfo('📅 Date', date));
    pratique.appendChild(creerLigneInfo('📍 Lieu', lieu));
    if (adresse) pratique.appendChild(creerLigneInfo('🗺️ Adresse', adresse));
    pratique.appendChild(creerLigneInfo('🎟️ Tarif', tarif));
    infos.appendChild(pratique);

    const blocDesc = document.createElement('div');
    blocDesc.className = 'description';
    const h3Desc = document.createElement('h3');
    h3Desc.textContent = 'À propos';
    blocDesc.appendChild(h3Desc);
    const pDesc = document.createElement('p');
    pDesc.textContent = description;
    blocDesc.appendChild(pDesc);
    infos.appendChild(blocDesc);

    // === BOUTON RÉSERVATION ===
    const boutonReservation = document.createElement('button');
    boutonReservation.className = 'bouton-reservation';
    boutonReservation.textContent = '🎟️ Réserver maintenant';
    boutonReservation.setAttribute('aria-label', 'Réserver pour ' + titre);
    boutonReservation.addEventListener('click', () => {
        alert('Merci pour votre intérêt ! La réservation pour "' + titre + '" sera bientôt disponible.');
    });
    infos.appendChild(boutonReservation);

    article.appendChild(infos);
    detail.appendChild(article);
}


function creerLigneInfo(label, valeur) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = label + ' : ';
    p.appendChild(strong);
    p.appendChild(document.createTextNode(valeur));
    return p;
}


function afficherErreur(message) {
    detail.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding:2rem;text-align:center;color:#0C1F5F;';
    const p = document.createElement('p');
    p.textContent = message;
    wrapper.appendChild(p);
    const lien = document.createElement('a');
    lien.href = 'index.html';
    lien.textContent = '← Retour à la liste';
    lien.style.cssText = 'display:inline-block;margin-top:1rem;color:#C8A951;font-weight:600;';
    wrapper.appendChild(lien);
    detail.appendChild(wrapper);
}


function obtenirTexte(champ) {
    if (!champ) return '';
    if (typeof champ === 'string') return champ;
    return champ.fr || '';
}

function obtenirCategorie(e) {
    return e.keywords?.fr?.[0] || 'Événement';
}

function formaterDate(date) {
    if (!date) return 'À venir';
    return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}


chargerDetail();
