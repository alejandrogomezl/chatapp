document.addEventListener('DOMContentLoaded', () => {
    const senderId = localStorage.getItem('senderId');
    const receiverId = localStorage.getItem('receiverId'); 

    const apiUrl = 'https://f8ywpdj9wl.execute-api.eu-west-3.amazonaws.com/dev/send';
    const messagesContainer = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const logout = document.getElementById('logout');
    

    // Función para cargar mensajes
    async function loadMessages() {
        const queryURL = `https://f8ywpdj9wl.execute-api.eu-west-3.amazonaws.com/dev/mensajes?senderId=${encodeURIComponent(senderId)}&receiverId=${encodeURIComponent(receiverId)}`;
        
        try {
            const response = await fetch(queryURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data); // Asegúrate de que esto coincide con lo que esperas
            const messages = data; // Si 'data' ya es el array esperado de mensajes
            
            messagesContainer.innerHTML = ''; // Limpiar mensajes anteriores

            const header = document.querySelector('.chat-header');
            header.textContent = 'Chat con ' + receiverId;

            messages.forEach(msg => {
                const messageDivS = document.createElement('div');
                const messageDivR = document.createElement('div');
                if (msg.SenderID === senderId) {
                    messageDivS.classList.add('messageR');
                    messageDivS.textContent = msg.Message;
                    messagesContainer.appendChild(messageDivS);
                } else {
                    messageDivR.classList.add('messageS');
                    messageDivR.textContent = msg.Message;
                    messagesContainer.appendChild(messageDivR);
                }
                // messageDiv.classList.add('message');
                // messageDiv.textContent = msg.Message; // Asegúrate de que 'Message' sea el campo correcto
                // messagesContainer.appendChild(messageDiv);
            });
        } catch (error) {
            console.error('Error al cargar los mensajes:', error);
        }
    }
    
    // Función para enviar un mensaje
    async function sendMessage(message) {
        const payload = {
            senderId: senderId,
            receiverId: receiverId,
            message: message
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ body: JSON.stringify(payload) }) // Anidando JSON.stringify() puede ser necesario si así es como espera la API el cuerpo.
            });
            const data = await response.json();
            console.log(data);
            loadMessages(); // Recargar mensajes después de enviar
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    }

    // Evento para enviar un mensaje
    sendButton.addEventListener('click', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional.
        const message = input.value.trim();
        if (message) {
            sendMessage(message);
            input.value = ''; // Limpia el campo de entrada.
        }
    });

    logout.addEventListener('click', () => {
        localStorage.removeItem('senderId');
        window.location.href = '/auth/auth.html';
    });

    // Cargar mensajes al iniciar
    loadMessages();

    // Configurar intervalo para recargar mensajes cada cierto tiempo
    setInterval(loadMessages, 1000); // Carga mensajes cada 5 segundos
});