document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('incont');
    const senderId = localStorage.getItem('senderId');
    if (!senderId) {
        window.location.href = '/auth/auth.html'; // Redirige a la página de autenticación si no hay senderId
    }
    async function loadContacts() {
        queryURL= `https://f8ywpdj9wl.execute-api.eu-west-3.amazonaws.com/dev/contactos?receiverId=${encodeURIComponent(senderId)}`;

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
            console.log(data);

            const contacts = data;

            conversations.innerHTML = '';

            contacts.forEach(contact => {
                const contactDiv = document.createElement('div');
                contactDiv.classList.add('contact');
                contactDiv.textContent = contact;
                contactDiv.addEventListener('click', () => {
                    localStorage.setItem('receiverId', contact);
                    window.location.href = 'msg/msg.html';
                });
                conversations.appendChild(contactDiv);
            });
        } catch (error) {
            console.error('Error al cargar los contactos:', error);
        }
    }

    create.addEventListener('click', (event) => {
        event.preventDefault();
        const newContact = input.value;
        localStorage.setItem('receiverId', newContact);
        window.location.href = 'msg/msg.html';
    });


    loadContacts();


});


