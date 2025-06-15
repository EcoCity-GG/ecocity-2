        // Inicializa o VLibras
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        
        // Configuração do Chatbot
        document.addEventListener('DOMContentLoaded', function() {
            const botaoChatbot = document.getElementById('botao-chatbot');
            const chatbotConteudo = document.querySelector('.chatbot-conteudo');
            const fecharChatbot = document.getElementById('fechar-chatbot');
            
            botaoChatbot.addEventListener('click', function() {
                chatbotConteudo.classList.toggle('ativo');
                this.style.visibility = chatbotConteudo.classList.contains('ativo') ? 'hidden' : 'visible';
            });
            
            fecharChatbot.addEventListener('click', function() {
                chatbotConteudo.classList.remove('ativo');
                botaoChatbot.style.visibility = 'visible';
            });
            
            // Simulação de interação do chatbot
            const entradaChatbot = document.querySelector('.chatbot-entrada input');
            const botaoEnviar = document.querySelector('.chatbot-entrada button');
            const mensagensContainer = document.querySelector('.chatbot-mensagens');
            
            function adicionarMensagem(remetente, texto) {
                const divMensagem = document.createElement('div');
                divMensagem.className = `mensagem mensagem-${remetente}`;
                divMensagem.innerHTML = texto;
                mensagensContainer.appendChild(divMensagem);
                mensagensContainer.scrollTop = mensagensContainer.scrollHeight;
            }
            
            botaoEnviar.addEventListener('click', enviarMensagem);
            entradaChatbot.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') enviarMensagem();
            });
            
            function enviarMensagem() {
                const texto = entradaChatbot.value.trim();
                if (texto) {
                    adicionarMensagem('usuario', texto);
                    entradaChatbot.value = '';
                    
                    setTimeout(() => {
                        const resposta = gerarRespostaChatbot(texto);
                        adicionarMensagem('bot', resposta);
                    }, 1000);
                }
            }
            
            function gerarRespostaChatbot(texto) {
                texto = texto.toLowerCase();
                
                if (texto.includes('1') || texto.includes('adotar')) {
                    return 'Para adotar uma zona, visite nosso mapa, escolha uma área disponível e clique em "Quero Adotar". Você será direcionado para o formulário de cadastro.';
                } else if (texto.includes('2') || texto.includes('benefício')) {
                    return 'As empresas participantes ganham:<br>- Visibilidade na plataforma<br>- Benefícios fiscais<br>- Selo de empresa sustentável<br>- Melhoria da imagem institucional';
                } else if (texto.includes('3') || texto.includes('premium')) {
                    return 'O plano premium oferece:<br>- Destaque especial no mapa<br>- Página exclusiva para sua empresa<br>- Relatórios detalhados de impacto<br>- Participação em eventos exclusivos';
                } else {
                    return 'Desculpe, não entendi. Você pode escolher uma das opções:<br>1. Como adotar uma zona<br>2. Benefícios para empresas<br>3. Tornar-se premium';
                }
            }
        });

        