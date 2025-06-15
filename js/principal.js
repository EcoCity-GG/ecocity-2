document.addEventListener('DOMContentLoaded', function() {
    configurarMapaFixo();
    inicializarMapa();
    configurarChatbot();
    configurarFormularioContato();
    mostrarPopupPremium();
    configurarFiltros();
});

// Substitua a função inicializarMapa por esta versão corrigida
function inicializarMapa() {
    const mapaElement = document.getElementById('mapa-interativo');
    if (!mapaElement) return;

    // Configuração inicial do mapa
    const mapa = L.map('mapa-interativo', {
        attributionControl: false,
        zoomControl: false
    }).setView([-22.1276, -51.3856], 14);

    // Camada base do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Adiciona controle de zoom personalizado
    L.control.zoom({
        position: 'topright'
    }).addTo(mapa);

    // Marcadores de exemplo
    const zonas = [
        {
            nome: "Parque do Povo",
            coordenadas: [-22.1276, -51.3856],
            status: "adotada",
            empresa: "EcoEmpresa A",
            beneficios: "Área de lazer sustentável"
        },
        {
            nome: "Praça da Juventude",
            coordenadas: [-22.1230, -51.3900],
            status: "disponivel",
            beneficios: "Espaço para eventos ecológicos"
        },
        {
            nome: "Margem do Córrego do Veado",
            coordenadas: [-22.1320, -51.3800],
            status: "adotada",
            empresa: "EcoEmpresa B",
            beneficios: "Preservação de recursos hídricos"
        }
    ];

    // Ícones personalizados
    const iconeVerde = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const iconeAzul = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Adiciona marcadores ao mapa
    const marcadores = zonas.map(zona => {
        const marcador = L.marker(zona.coordenadas, {
            icon: zona.status === "adotada" ? iconeVerde : iconeAzul
        }).addTo(mapa);
        
        let conteudoPopup = `<div class="popup-mapa"><h4>${zona.nome}</h4>`;
        conteudoPopup += `<p><strong>Status:</strong> ${zona.status === "adotada" ? "Adotada" : "Disponível"}</p>`;
        
        if (zona.status === "adotada") {
            conteudoPopup += `<p><strong>Empresa:</strong> ${zona.empresa}</p>`;
        }
        
        conteudoPopup += `<p><strong>Benefícios:</strong> ${zona.beneficios}</p>`;
        conteudoPopup += `<a href="pages/cadastro.html" class="btn btn-verde btn-sm">Quero Adotar</a></div>`;
        
        marcador.bindPopup(conteudoPopup);
        return marcador;
    });

    // Ajusta o mapa para mostrar todos os marcadores
    const grupo = L.featureGroup(marcadores);
    mapa.fitBounds(grupo.getBounds().pad(0.2));

    // Configura os filtros
    configurarFiltros(mapa, marcadores);
}

function configurarFiltros(mapa, marcadores) {
    document.querySelectorAll('.btn-filtro').forEach(botao => {
        botao.addEventListener('click', function() {
            document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('ativo'));
            this.classList.add('ativo');
            
            const filtro = this.getAttribute('data-filtro');
            
            marcadores.forEach((marcador, index) => {
                const zona = zonas[index];
                if (filtro === 'todos' || zona.status === filtro) {
                    marcador.addTo(mapa);
                } else {
                    mapa.removeLayer(marcador);
                }
            });
            
            // Reajusta a visualização se necessário
            const marcadoresVisiveis = marcadores.filter((_, index) => {
                return filtro === 'todos' || zonas[index].status === filtro;
            });
            
            if (marcadoresVisiveis.length > 0) {
                const grupo = L.featureGroup(marcadoresVisiveis);
                mapa.fitBounds(grupo.getBounds().pad(0.2));
            }
        });
    });
}

function configurarChatbot() {
    const botaoChatbot = document.getElementById('botao-chatbot');
    const chatbotConteudo = document.querySelector('.chatbot-conteudo');
    const fecharChatbot = document.getElementById('fechar-chatbot');
    
    botaoChatbot.addEventListener('click', function() {
        chatbotConteudo.style.display = chatbotConteudo.style.display === 'block' ? 'none' : 'block';
    });
    
    fecharChatbot.addEventListener('click', function() {
        chatbotConteudo.style.display = 'none';
    });
    
    const mensagens = [
        { remetente: 'bot', texto: 'Olá! Sou o EcoBot, como posso te ajudar?' },
        { remetente: 'bot', texto: '1. Como adotar uma zona?' },
        { remetente: 'bot', texto: '2. Quais os benefícios para empresas?' },
        { remetente: 'bot', texto: '3. Como me tornar premium?' }
    ];
    
    const containerMensagens = document.querySelector('.chatbot-mensagens');
    
    mensagens.forEach(mensagem => {
        const divMensagem = document.createElement('div');
        divMensagem.className = `mensagem mensagem-${mensagem.remetente}`;
        divMensagem.textContent = mensagem.texto;
        containerMensagens.appendChild(divMensagem);
    });
    
    const entradaChatbot = document.querySelector('.chatbot-entrada input');
    const botaoEnviar = document.querySelector('.chatbot-entrada button');
    
    botaoEnviar.addEventListener('click', function() {
        const texto = entradaChatbot.value.trim();
        if (texto) {
            adicionarMensagem('usuario', texto);
            entradaChatbot.value = '';
            
            setTimeout(() => {
                const resposta = gerarRespostaChatbot(texto);
                adicionarMensagem('bot', resposta);
            }, 1000);
        }
    });
}

function adicionarMensagem(remetente, texto) {
    const containerMensagens = document.querySelector('.chatbot-mensagens');
    const divMensagem = document.createElement('div');
    divMensagem.className = `mensagem mensagem-${remetente}`;
    divMensagem.textContent = texto;
    containerMensagens.appendChild(divMensagem);
    containerMensagens.scrollTop = containerMensagens.scrollHeight;
}

function gerarRespostaChatbot(texto) {
    texto = texto.toLowerCase();
    
    if (texto.includes('adotar') || texto.includes('1')) {
        return 'Para adotar uma zona, visite nosso mapa, escolha uma área disponível e clique em "Quero Adotar". Ou acesse diretamente a página de cadastro.';
    } else if (texto.includes('benefício') || texto.includes('2')) {
        return 'As empresas ganham visibilidade no mapa, benefícios fiscais e podem usar o selo EcoCity em suas comunicações. Empresas premium têm ainda mais vantagens!';
    } else if (texto.includes('premium') || texto.includes('3')) {
        return 'O plano premium oferece destaque no mapa, relatórios de impacto e mais. Clique no pop-up de assinatura ou visite a página de cadastro para mais informações.';
    } else {
        return 'Desculpe, não entendi. Você pode escolher uma das opções: 1. Como adotar, 2. Benefícios ou 3. Plano premium.';
    }
}

function configurarFormularioContato() {
    const formulario = document.getElementById('form-contato');
    
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;
        
        console.log('Formulário enviado:', { nome, email, mensagem });
        
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        formulario.reset();
    });
}

// Substitua a função mostrarPopupPremium por esta versão corrigida
function mostrarPopupPremium() {
    // Verifica se já mostrou o popup nesta sessão
    if (sessionStorage.getItem('popupMostrado')) return;
    
    setTimeout(() => {
        const popup = criarPopupPremium();
        document.body.appendChild(popup);
        
        // Adiciona estilo ao popup
        const style = document.createElement('style');
        style.textContent = `
            .popup-premium {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 1000;
                max-width: 400px;
                width: 90%;
            }
            .popup-conteudo {
                position: relative;
                text-align: center;
            }
            .fechar-popup {
                position: absolute;
                top: -10px;
                right: -10px;
                background: var(--verde-principal);
                color: white;
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                font-size: 1.2rem;
                cursor: pointer;
            }
            .lembrete-premium {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: white;
                padding: 10px 15px;
                border-radius: 5px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                z-index: 999;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .fechar-lembrete {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1rem;
            }
        `;
        document.head.appendChild(style);
        
        const fecharPopup = popup.querySelector('.fechar-popup');
        fecharPopup.addEventListener('click', function() {
            popup.style.display = 'none';
            criarLembretePremium();
            sessionStorage.setItem('popupMostrado', 'true');
        });
    }, 5000);
}

// Atualize a função criarLembretePremium
function criarLembretePremium() {
    const lembrete = document.createElement('div');
    lembrete.className = 'lembrete-premium';
    lembrete.innerHTML = `
        <p>Quer ser premium? <a href="pages/cadastro.html">Clique aqui</a></p>
        <button class="fechar-lembrete">×</button>
    `;
    
    document.body.appendChild(lembrete);
    
    const fecharLembrete = lembrete.querySelector('.fechar-lembrete');
    fecharLembrete.addEventListener('click', function() {
        lembrete.remove();
    });
}

function criarPopupPremium() {
    const popup = document.createElement('div');
    popup.className = 'popup-premium';
    popup.innerHTML = `
        <div class="popup-conteudo">
            <button class="fechar-popup">×</button>
            <h3>Seja uma Empresa Premium!</h3>
            <p>Destaque-se no mapa, acesse relatórios exclusivos e ganhe mais visibilidade.</p>
            <a href="pages/cadastro.html" class="btn btn-verde">Saiba Mais</a>
        </div>
    `;
    
    return popup;
}

function criarLembretePremium() {
    const lembrete = document.createElement('div');
    lembrete.className = 'lembrete-premium';
    lembrete.innerHTML = `
        <p>Quer ser premium? <a href="pages/cadastro.html">Clique aqui</a></p>
        <button class="fechar-lembrete">×</button>
    `;
    
    document.body.appendChild(lembrete);
    
    const fecharLembrete = lembrete.querySelector('.fechar-lembrete');
    fecharLembrete.addEventListener('click', function() {
        lembrete.style.display = 'none';
    });
}

function configurarFiltros() {
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', function() {
            botoesFiltro.forEach(btn => btn.classList.remove('ativo'));
            this.classList.add('ativo');
            
            const filtro = this.getAttribute('data-filtro');
            console.log('Filtrar por:', filtro);
        });
    });
}

// Função para manipular o mapa fixo
function configurarMapaFixo() {
    // Interação entre lista e mapa
    document.querySelectorAll('.zona-item').forEach(item => {
        item.addEventListener('click', function() {
            const zonaId = this.getAttribute('data-zona');
            const zonaMapa = document.querySelector(`.zona[data-zona="${zonaId}"]`);
            
            // Simula um clique na zona do mapa
            const evento = new MouseEvent('mouseover', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            
            zonaMapa.dispatchEvent(evento);
            
            // Scroll para a zona no mapa (se necessário)
            zonaMapa.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    // Efeito de hover nas zonas do mapa
    document.querySelectorAll('.zona').forEach(zona => {
        zona.addEventListener('mouseover', function() {
            this.style.zIndex = '10';
            this.querySelector('.ponto-zona').style.transform = 'scale(1.3)';
        });
        
        zona.addEventListener('mouseout', function() {
            this.style.zIndex = '1';
            this.querySelector('.ponto-zona').style.transform = 'scale(1)';
        });
    });
}