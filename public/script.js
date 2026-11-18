const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let conversationHistory = [];

function appendMessage(sender, text, isStream = false) {
    let messageDiv;
    let bubbleDiv;

    if (!isStream) {
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        // Tambahkan elemen <img> menggunakan link online
        if (sender === 'bot') {
            const avatarImg = document.createElement('img');
            avatarImg.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=Bella&backgroundColor=f472b6'; 
            avatarImg.alt = 'Bot Avatar';
            avatarImg.classList.add('avatar');
            messageDiv.appendChild(avatarImg);
        }

        bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('bubble');
        bubbleDiv.innerHTML = text.replace(/\n/g, '<br>'); 

        messageDiv.appendChild(bubbleDiv);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        return bubbleDiv; 
    }
}


sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});