/**
 * Eco-City Chatbot - Assistente Virtual
 * Versão 1.0
 * 
 * Funcionalidades:
 * - Interface interativa de chat
 * - Respostas pré-programadas para perguntas frequentes
 * - Opções rápidas de interação
 * - Integração com as páginas do site
 * - Design responsivo
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    
    // Configuração inicial
    let isChatbotOpen = false;
    let userName = '';
    let userEmail = '';
    let conversationStep = 'initial';
    
    // Inicialização do chatbot
    function initChatbot() {
        setupEventListeners();
        showWelcomeMessage();
    }
    
    // Configura os event listeners
    function setupEventListeners() {
        // Abrir/fechar chatbot
        chatbotButton.addEventListener('click', toggleChatbot);
        chatbotClose.addEventListener('click', toggleChatbot);
        
        // Enviar mensagem
        chatbotSend.addEventListener('click', sendUserMessage);
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendUserMessage();
        });
    }
    
    // Alternar visibilidade do chatbot
    function toggleChatbot() {
        isChatbotOpen = !isChatbotOpen;
        
        if (isChatbotOpen) {
            chatbotWindow.classList.add('active');
            chatbotInput.focus();
        } else {
            chatbotWindow.classList.remove('active');
        }
    }
    
    // Mostrar mensagem de boas-vindas
    function showWelcomeMessage() {
        addBotMessage('Olá! 👋 Sou o EcoBot, assistente virtual do Eco-City.');
        
        setTimeout(() => {
            addBotMessage('Posso te ajudar com informações sobre:'
                + '\n\n✅ Adoção de zonas verdes'
                + '\n✅ Benefícios para empresas'
                + '\n✅ Como se tornar um parceiro'
                + '\n✅ Eventos e projetos sustentáveis');
            
            setTimeout(() => {
                showQuickOptions();
            }, 800);
        }, 800);
    }
    
    // Mostrar opções rápidas
    function showQuickOptions() {
        addBotMessage('Por onde gostaria de começar?', [
            'Como adotar uma zona verde',
            'Quero saber sobre benefícios',
            'Falar com um atendente'
        ]);
    }
    
    // Enviar mensagem do usuário
    function sendUserMessage() {
        const message = chatbotInput.value.trim();
        
        if (message) {
            addUserMessage(message);
            chatbotInput.value = '';
            processUserMessage(message);
        }
    }
    
    // Adicionar mensagem do usuário ao chat
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message message-user';
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Adicionar mensagem do bot ao chat
    function addBotMessage(text, options = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message message-bot';
        messageDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        
        if (options.length > 0) {
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'message-options';
            
            options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = option;
                button.addEventListener('click', () => {
                    addUserMessage(option);
                    processUserMessage(option);
                });
                optionsDiv.appendChild(button);
            });
            
            messageDiv.appendChild(optionsDiv);
        }
        
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Processar a mensagem do usuário e responder
    function processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Reseta o passo da conversa se for uma nova pergunta
        if (!lowerMessage.match(/sim|não|nome|email/gi)) {
            conversationStep = 'initial';
        }
        
        // Fluxo da conversa baseado no passo atual
        switch (conversationStep) {
            case 'asking_name':
                userName = message;
                conversationStep = 'asking_email';
                addBotMessage(`Obrigado, ${userName}. Qual é o seu e-mail para entrarmos em contato?`);
                return;
                
            case 'asking_email':
                if (validateEmail(message)) {
                    userEmail = message;
                    conversationStep = 'initial';
                    addBotMessage(`Ótimo! Um de nossos atendentes entrará em contato em breve no e-mail ${userEmail}.`);
                    addBotMessage('Enquanto isso, posso te ajudar com mais alguma coisa?', [
                        'Como adotar uma zona',
                        'Ver benefícios para empresas',
                        'Não, obrigado'
                    ]);
                } else {
                    addBotMessage('Por favor, insira um e-mail válido no formato: seu@email.com');
                }
                return;
                
            case 'asking_issue':
                // Aqui você pode enviar os dados para um backend
                addBotMessage('Anotamos sua solicitação. Entraremos em contato em breve!');
                conversationStep = 'initial';
                showQuickOptions();
                return;
        }
        
        // Respostas para perguntas específicas
        if (lowerMessage.includes('adotar') || lowerMessage.includes('zona')) {
            showAdoptionInfo();
        } 
        else if (lowerMessage.includes('benefício') || lowerMessage.includes('vantagem')) {
            showBenefitsInfo();
        }
        else if (lowerMessage.includes('premium') || lowerMessage.includes('parceiro')) {
            showPremiumInfo();
        }
        else if (lowerMessage.includes('atendente') || lowerMessage.includes('humano')) {
            startHumanAssistance();
        }
        else if (lowerMessage.includes('obrigado') || lowerMessage.includes('agradeço')) {
            addBotMessage('De nada! Estou aqui para ajudar. 😊');
            showQuickOptions();
        }
        else if (lowerMessage.includes('mapa') || lowerMessage.includes('zonas disponíveis')) {
            addBotMessage('Você pode ver todas as zonas disponíveis no nosso <a href="mapa.html" style="color: var(--verde-principal); font-weight: 600;">mapa interativo</a>.');
        }
        else {
            showDefaultResponse();
        }
    }
    
    // Mostrar informações sobre adoção
    function showAdoptionInfo() {
        addBotMessage('📌 <strong>Como adotar uma zona verde:</strong>'
            + '<br><br>1. Acesse nosso <a href="mapa.html" style="color: var(--verde-principal);">mapa das zonas</a>'
            + '<br>2. Selecione uma área disponível (marcada em azul)'
            + '<br>3. Clique em "Quero Adotar"'
            + '<br>4. Preencha o formulário de cadastro'
            + '<br>5. Nossa equipe entrará em contato para finalizar o processo');
        
        addBotMessage('Requisitos para adoção:'
            + '<br><br>• CNPJ válido'
            + '<br>• Plano de manutenção da área'
            + '<br>• Compromisso com práticas sustentáveis');
        
        addBotMessage('Gostaria de:', [
            'Ver o mapa agora',
            'Saber sobre benefícios fiscais',
            'Falar com um atendente'
        ]);
    }
    
    // Mostrar informações sobre benefícios
    function showBenefitsInfo() {
        addBotMessage('💼 <strong>Benefícios para empresas parceiras:</strong>'
            + '<br><br>✅ <strong>Visibilidade:</strong> Destaque no mapa e materiais de divulgação'
            + '<br>✅ <strong>Incentivos fiscais:</strong> Descontos em impostos municipais'
            + '<br>✅ <strong>Selo verde:</strong> Certificado de empresa sustentável'
            + '<br>✅ <strong>Marketing:</strong> Conteúdo sobre sua empresa em nossas redes'
            + '<br>✅ <strong>Relatórios:</strong> Métricas de impacto ambiental');
        
        addBotMessage('Os benefícios variam conforme o plano escolhido (Básico ou Premium).');
        
        addBotMessage('Quer saber mais sobre:', [
            'Planos e valores',
            'Como se tornar premium',
            'Ver casos de sucesso'
        ]);
    }
    
    // Mostrar informações sobre plano premium
    function showPremiumInfo() {
        addBotMessage('⭐ <strong>Plano Premium Eco-City</strong>'
            + '<br><br>Para empresas que desejam maximizar seus resultados e impacto, oferecemos:'
            + '<br><br>• Destaque especial no mapa e site'
            + '<br>• Página exclusiva para sua empresa'
            + '<br>• Relatórios detalhados de impacto mensal'
            + '<br>• Participação em eventos exclusivos'
            + '<br>• Consultoria em sustentabilidade'
            + '<br>• Descontos adicionais em impostos');
        
        addBotMessage('<a href="cadastro.html?plano=premium" style="color: var(--verde-principal); font-weight: 600;">Clique aqui para solicitar uma proposta</a> ou fale com nosso time:');
        
        addBotMessage('📞 (18) 3900-0000'
            + '<br>📧 premium@ecocity.com.br');
    }
    
    // Iniciar conversa com atendente humano
    function startHumanAssistance() {
        conversationStep = 'asking_name';
        addBotMessage('Claro! Vou conectar você com nosso time. Primeiro, qual é o seu nome?');
    }
    
    // Mostrar resposta padrão para mensagens não reconhecidas
    function showDefaultResponse() {
        addBotMessage('Desculpe, não entendi completamente. Você pode reformular ou escolher uma opção abaixo:', [
            'Como adotar uma zona verde',
            'Quero saber sobre benefícios',
            'Falar com um atendente'
        ]);
    }
    
    // Validar e-mail
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Rolagem automática para a última mensagem
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Inicializar o chatbot
    initChatbot();
});