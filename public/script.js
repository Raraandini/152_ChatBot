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

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';
    sendBtn.disabled = true;

    conversationHistory.push({ role: "user", content: text });

    const botBubble = appendMessage('bot', '...'); 
    let botResponse = "";

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: conversationHistory })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        botBubble.innerHTML = ""; 

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split('\n\n');
            buffer = events.pop(); 

            for (const event of events) {
                if (event.startsWith("data: ")) {
                    const data = event.substring(6).trim();
                    
                    if (data === "[DONE]") {
                        continue; 
                    }

                    try {
                        const parsedData = JSON.parse(data);
                        botResponse += parsedData;
                        botBubble.innerHTML = botResponse.replace(/\n/g, '<br>');
                        chatBox.scrollTop = chatBox.scrollHeight;
                    } catch (e) {
                        console.error("Gagal parse data SSE:", e);
                    }
                }
            }
        }

        conversationHistory.push({ role: "assistant", content: botResponse });

    } catch (error) {
        console.error("Fetch Error:", error);
        botBubble.innerHTML = "<em>Maaf, terjadi kesalahan saat menghubungi server.</em>";
    } finally {
        sendBtn.disabled = false;
        userInput.focus();
    }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});