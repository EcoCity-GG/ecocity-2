// Arquivo: js/mapa.js

document.addEventListener('DOMContentLoaded', function() {
    const pontosZona = document.querySelectorAll('.ponto-zona');
    const mapaTooltip = document.getElementById('mapa-tooltip');

    pontosZona.forEach(ponto => {
        ponto.addEventListener('mouseenter', function(event) {
            const infoText = this.getAttribute('data-info');
            if (infoText) {
                mapaTooltip.textContent = infoText;
                mapaTooltip.style.display = 'block';
                mapaTooltip.style.opacity = '1';
                
                // Posicionar o tooltip
                // Obtém a posição do ponto na tela
                const pontoRect = this.getBoundingClientRect();
                const wrapperRect = this.closest('.mapa-estatico-wrapper').getBoundingClientRect();

                // Calcula a posição do tooltip relativa ao wrapper, centralizado horizontalmente
                const tooltipX = pontoRect.left - wrapperRect.left + (pontoRect.width / 2);
                const tooltipY = pontoRect.top - wrapperRect.top;

                mapaTooltip.style.left = `${tooltipX}px`;
                mapaTooltip.style.top = `${tooltipY}px`;
                mapaTooltip.style.transform = `translate(-50%, calc(-100% - 10px))`; // Move para cima do ponto + margem
            }
        });

        ponto.addEventListener('mouseleave', function() {
            mapaTooltip.style.opacity = '0';
            mapaTooltip.style.display = 'none'; // Esconde após a transição
        });
    });

    // Removendo funcionalidades de filtro e pesquisa que não interagem com o mapa estático
    // (As caixas de seleção no HTML já estão disabled para evitar confusão)
    const pesquisaInput = document.getElementById('pesquisa-zona');
    const aplicarFiltrosBtn = document.getElementById('aplicar-filtros');
    
    if (pesquisaInput) pesquisaInput.addEventListener('input', () => { /* Nenhuma ação */ });
    if (aplicarFiltrosBtn) aplicarFiltrosBtn.addEventListener('click', (e) => { e.preventDefault(); /* Nenhuma ação */ });
});