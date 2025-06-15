document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.getElementById('formCadastro');
    const passos = document.querySelectorAll('.passo-cadastro');
    const progressoBarra = document.getElementById('progressoBarra');
    const btnProximo = document.querySelectorAll('.btn-proximo');
    const btnAnterior = document.querySelectorAll('.btn-anterior');
    let passoAtual = 1;
    let tipoCadastro = 'empresa';

    // Inicializa a barra de progresso
    atualizarProgresso();

    // Seleção do tipo de cadastro
    document.querySelectorAll('.tipo-cadastro').forEach(tipo => {
        tipo.addEventListener('click', function() {
            document.querySelectorAll('.tipo-cadastro').forEach(t => t.classList.remove('ativo'));
            this.classList.add('ativo');
            tipoCadastro = this.getAttribute('data-tipo');
            
            // Mostra/oculta campos específicos
            if (tipoCadastro === 'empresa') {
                document.getElementById('campo-cnpj').style.display = 'block';
            } else {
                document.getElementById('campo-cnpj').style.display = 'none';
            }
        });
    });

    // Navegação entre passos
    btnProximo.forEach(btn => {
        btn.addEventListener('click', function() {
            if (validarPasso(passoAtual)) {
                passoAtual++;
                mostrarPasso(passoAtual);
                atualizarProgresso();
            }
        });
    });

    btnAnterior.forEach(btn => {
        btn.addEventListener('click', function() {
            passoAtual--;
            mostrarPasso(passoAtual);
            atualizarProgresso();
        });
    });

    // Validação do formulário
    formCadastro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarPasso(passoAtual)) {
            // Simula o cadastro (substituir por chamada à API)
            mostrarAlerta('Cadastro realizado com sucesso!', 'sucesso');
            
            setTimeout(() => {
                if (tipoCadastro === 'empresa') {
                    window.location.href = 'painel-empresa.html';
                } else {
                    window.location.href = '../index.html';
                }
            }, 1500);
        }
    });

    // Funções auxiliares
    function mostrarPasso(passo) {
        passos.forEach(p => p.classList.remove('ativo'));
        document.getElementById(`passo${passo}`).classList.add('ativo');
    }

    function atualizarProgresso() {
        const progresso = (passoAtual / passos.length) * 100;
        progressoBarra.style.width = `${progresso}%`;
    }

    function validarPasso(passo) {
        if (passo === 1) return true;
        
        if (passo === 2) {
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            
            if (!nome || !email || !senha || !confirmarSenha) {
                mostrarAlerta('Preencha todos os campos obrigatórios', 'erro');
                return false;
            }
            
            if (senha.length < 8) {
                mostrarAlerta('A senha deve ter no mínimo 8 caracteres', 'erro');
                return false;
            }
            
            if (senha !== confirmarSenha) {
                mostrarAlerta('As senhas não coincidem', 'erro');
                return false;
            }
            
            return true;
        }
        
        if (passo === 3) {
            const termos = document.getElementById('termos').checked;
            
            if (!termos) {
                mostrarAlerta('Você deve aceitar os termos para continuar', 'erro');
                return false;
            }
            
            if (tipoCadastro === 'empresa') {
                const cnpj = document.getElementById('cnpj').value;
                if (!validarCNPJ(cnpj)) {
                    mostrarAlerta('CNPJ inválido', 'erro');
                    return false;
                }
            }
            
            return true;
        }
    }

    function validarCNPJ(cnpj) {
        // Simulação de validação (implementar lógica real)
        return cnpj.length > 0;
    }

    function mostrarAlerta(mensagem, tipo) {
        // Remove alertas existentes
        const alertaExistente = document.querySelector('.alerta-cadastro');
        if (alertaExistente) {
            alertaExistente.remove();
        }
        
        const alerta = document.createElement('div');
        alerta.className = `alerta-cadastro alerta-${tipo}`;
        alerta.textContent = mensagem;
        
        // Adiciona estilos dinâmicos
        const estilo = document.createElement('style');
        estilo.textContent = `
            .alerta-cadastro {
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
});