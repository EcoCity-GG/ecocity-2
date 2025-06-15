document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const lembrar = document.getElementById('lembrar').checked;
        
        // Validação simples
        if (!email || !senha) {
            mostrarAlerta('Por favor, preencha todos os campos.', 'erro');
            return;
        }
        
        // Simulação de login (substituir por chamada real à API)
        simularLogin(email, senha, lembrar);
    });
    
    // Função para simular o processo de login
    function simularLogin(email, senha, lembrar) {
        mostrarAlerta('Autenticando...', 'info');
        
        // Simula uma requisição assíncrona
        setTimeout(() => {
            // Aqui você substituiria por uma chamada real à API
            if (email === 'admin@ecocity.com' && senha === '123456') {
                mostrarAlerta('Login realizado com sucesso!', 'sucesso');
                
                // Redireciona após 1 segundo
                setTimeout(() => {
                    window.location.href = 'painel-empresa.html';
                }, 1000);
            } else {
                mostrarAlerta('E-mail ou senha incorretos.', 'erro');
            }
        }, 1500);
    }
    
    // Função para mostrar alertas
    function mostrarAlerta(mensagem, tipo) {
        // Remove alertas existentes
        const alertaExistente = document.querySelector('.alerta-login');
        if (alertaExistente) {
            alertaExistente.remove();
        }
        
        const alerta = document.createElement('div');
        alerta.className = `alerta-login alerta-${tipo}`;
        alerta.textContent = mensagem;
        
        // Estilos dinâmicos para o alerta
        const estilo = document.createElement('style');
        estilo.textContent = `
            .alerta-login {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: fadeIn 0.3s ease-out;
            }
            
            .alerta-sucesso {
                background-color: var(--verde-principal);
            }
            
            .alerta-erro {
                background-color: #dc3545;
            }
            
            .alerta-info {
                background-color: #17a2b8;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; top: 0; }
                to { opacity: 1; top: 20px; }
            }
        `;
        document.head.appendChild(estilo);
        
        document.body.appendChild(alerta);
        
        // Remove o alerta após 5 segundos
        setTimeout(() => {
            alerta.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => alerta.remove(), 300);
        }, 5000);
    }
    
    // Adiciona efeitos aos botões sociais
    document.querySelectorAll('.btn-social').forEach(botao => {
        botao.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        botao.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});