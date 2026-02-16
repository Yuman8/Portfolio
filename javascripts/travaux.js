/**
 * LIGHTBOX POUR GALERIE DE PROJETS
 * Gère l'affichage et la navigation dans les screenshots de projets
 * Auteur: Alexandre Anselin
 */

(function() {
    'use strict';

    // ==================== VARIABLES GLOBALES ====================
    let currentProject = null;
    let currentIndex = 0;
    let projectImages = [];
    
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // ==================== INITIALISATION ====================
    function init() {
        // Récupérer tous les projets
        const projects = document.querySelectorAll('[data-project]');
        
        projects.forEach(project => {
            // Gérer les clics sur les images de la galerie
            const galleryTriggers = project.querySelectorAll('.gallery-trigger');
            galleryTriggers.forEach(trigger => {
                trigger.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    openLightbox(project, index);
                });
                
                // Accessibilité : ouvrir avec Entrée sur les vignettes
                trigger.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        const index = parseInt(this.getAttribute('data-index'));
                        openLightbox(project, index);
                    }
                });
            });
            
            // Gérer le clic sur le bouton "Voir les screenshots"
            const viewBtn = project.querySelector('.btn-voir-screenshots');
            if (viewBtn) {
                viewBtn.addEventListener('click', function() {
                    openLightbox(project, 0); // Ouvrir à la première image
                });
            }
        });
        
        // Gérer les contrôles de la lightbox
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', showPrevImage);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', showNextImage);
        }
        
        // Fermer en cliquant sur l'overlay (en dehors de l'image)
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
        
        // Gérer les touches clavier
        document.addEventListener('keydown', handleKeyboard);
    }

    // ==================== OUVRIR LA LIGHTBOX ====================
    function openLightbox(project, index) {
        currentProject = project;
        currentIndex = index;
        
        // Récupérer toutes les images du projet
        const images = project.querySelectorAll('.gallery-trigger');
        projectImages = Array.from(images).map(img => ({
            src: img.src,
            alt: img.alt
        }));
        
        // Afficher l'image
        showImage(currentIndex);
        
        // Ouvrir la lightbox avec animation
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le scroll
        
        // Focus sur le bouton fermer pour l'accessibilité
        setTimeout(() => {
            closeBtn.focus();
        }, 100);
    }

    // ==================== FERMER LA LIGHTBOX ====================
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Réactiver le scroll
        currentProject = null;
        currentIndex = 0;
        projectImages = [];
    }

    // ==================== AFFICHER UNE IMAGE ====================
    function showImage(index) {
        if (index < 0 || index >= projectImages.length) {
            return;
        }
        
        currentIndex = index;
        const image = projectImages[index];
        
        // Mettre à jour l'image
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        
        // Mettre à jour la caption
        lightboxCaption.textContent = image.alt;
        
        // Mettre à jour le compteur
        lightboxCounter.textContent = `${index + 1} / ${projectImages.length}`;
        
        // Gérer l'état des boutons de navigation
        updateNavigationButtons();
    }

    // ==================== IMAGE PRÉCÉDENTE ====================
    function showPrevImage() {
        if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }
    }

    // ==================== IMAGE SUIVANTE ====================
    function showNextImage() {
        if (currentIndex < projectImages.length - 1) {
            showImage(currentIndex + 1);
        }
    }

    // ==================== METTRE À JOUR LES BOUTONS ====================
    function updateNavigationButtons() {
        // Désactiver le bouton précédent si on est à la première image
        if (currentIndex === 0) {
            prevBtn.disabled = true;
            prevBtn.setAttribute('aria-disabled', 'true');
        } else {
            prevBtn.disabled = false;
            prevBtn.setAttribute('aria-disabled', 'false');
        }
        
        // Désactiver le bouton suivant si on est à la dernière image
        if (currentIndex === projectImages.length - 1) {
            nextBtn.disabled = true;
            nextBtn.setAttribute('aria-disabled', 'true');
        } else {
            nextBtn.disabled = false;
            nextBtn.setAttribute('aria-disabled', 'false');
        }
    }

    // ==================== GESTION CLAVIER ====================
    function handleKeyboard(e) {
        // Ne rien faire si la lightbox n'est pas ouverte
        if (!lightbox.classList.contains('active')) {
            return;
        }
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }

    // ==================== DÉMARRAGE ====================
    // Attendre que le DOM soit complètement chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();