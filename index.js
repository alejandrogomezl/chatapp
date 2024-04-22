document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://0s8aq29j6d.execute-api.eu-west-3.amazonaws.com/testetp/postmess';
    const messagesContainer = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    const senderId = localStorage.getItem('senderId'); // Obtener senderId del Local Storage
    const receiverId = "user_2"; // Este valor puede ser estático o también manejarse dinámicamente

    if (!senderId) {
        window.location.href = 'auth/auth.html'; // Redirige a la página de autenticación si no hay senderId
    }

    // Función para cargar mensajes
    async function loadMessages() {
        const queryURL = `https://f87fseo1ee.execute-api.eu-west-3.amazonaws.com/get?senderId=${encodeURIComponent(senderId)}&receiverId=${encodeURIComponent(receiverId)}`;
    
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

            messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.textContent = msg.Message; // Asegúrate de que 'Message' sea el campo correcto
                messagesContainer.appendChild(messageDiv);
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

    // Cargar mensajes al iniciar
    loadMessages();

    // Configurar intervalo para recargar mensajes cada cierto tiempo
    setInterval(loadMessages, 5000); // Carga mensajes cada 5 segundos
});