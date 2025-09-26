// AI Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const aiToggle = document.querySelector('.ai-toggle');
    const aiChat = document.querySelector('.ai-chat');
    const closeChat = document.querySelector('.close-chat');
    const sendMessageBtn = document.querySelector('.send-message');
    const chatInput = document.querySelector('.chat-input input');
    const chatMessages = document.querySelector('.chat-messages');

    if (!aiToggle) return;

    // AI Chatbot responses
    const botResponses = {
        'hello': 'Hello! I\'m VitaBot, your AI health supplement assistant. How can I help you today?',
        'hi': 'Hi there! What can I help you with?',
        'hey': 'Hey! I\'m here to help you with your supplement needs.',
        'product': 'We have a wide range of supplements including Sea Moss, Moringa, Multi-Vitamins, and more. Which category interests you?',
        'products': 'We offer immune support, bone health, superfoods, stress relief, detox, joint support, and daily health supplements.',
        'price': 'Our prices range from R159.99 to R379.99. Is there a specific product you\'d like pricing for?',
        'shipping': 'We ship throughout South Africa, Namibia, and Botswana. Shipping takes 3-5 business days. Express shipping is available.',
        'delivery': 'Standard delivery: 3-5 days. Express delivery: 1-2 days (additional fee applies).',
        'return': 'We offer a 30-day return policy on all unopened products. Please contact support for returns.',
        'refund': 'Refunds are processed within 5-7 business days after we receive the returned items.',
        'compliance': 'All products are SAHPRA (SA), MOHSS (Namibia), and BMRA (Botswana) compliant.',
        'sea moss': 'Organic Sea Moss is rich in 92 minerals, supports immune system, thyroid function, and digestive health. Price: R249.99',
        'calcium': 'Calcium Magnesium supports bone health, muscle function, and nerve transmission. Price: R189.99',
        'moringa': 'Moringa Powder is a nutrient-dense superfood with antioxidants. Great for energy and wellness. Price: R179.99',
        'rhodiola': 'Rhodiola Extract is an adaptogen that helps manage stress and improve mental performance. Price: R299.99',
        'charcoal': 'Activated Charcoal helps detoxify the body and support digestive health. Price: R159.99',
        'glucosamine': 'We have Glucosamine HCL (R349.99) and MSM (R379.99) for joint health and mobility.',
        'vitamin': 'Our Multi-Vitamin Complex provides essential vitamins and minerals for daily wellness. Price: R279.99',
        'recommend': 'I can recommend supplements based on your health goals. Are you looking for energy, immune support, joint health, or something else?',
        'energy': 'For energy, I recommend: Moringa Powder, Rhodiola Extract, and our Multi-Vitamin Complex.',
        'immune': 'For immune support: Organic Sea Moss, Multi-Vitamin Complex, and Vitamin C would be great.',
        'joint': 'For joint health: Glucosamine HCL or MSM, Calcium Magnesium, and Omega-3 supplements.',
        'stress': 'For stress relief: Rhodiola Extract, Ashwagandha, and Magnesium supplements work well.',
        'detox': 'For detox: Activated Charcoal, Milk Thistle, and our Liver Support formula are excellent.',
        'bone': 'For bone health: Calcium Magnesium, Vitamin D3, and our Bone Strength formula.',
        'contact': 'You can contact us at info@vitabot.ai or call +27 11 123 4567. We\'re here Mon-Fri, 9:00-17:00.',
        'help': 'I can help with product information, recommendations, shipping, returns, and general questions. What do you need?',
        'thanks': 'You\'re welcome! Is there anything else I can help you with?',
        'thank you': 'My pleasure! Let me know if you need anything else.',
        'bye': 'Goodbye! Feel free to chat again if you have more questions.',
        'default': 'I\'m here to help with supplement information, recommendations, shipping, and more. Could you please rephrase your question?'
    };

    // Toggle chat visibility
    aiToggle.addEventListener('click', function() {
        aiChat.classList.toggle('active');
        if (aiChat.classList.contains('active')) {
            chatInput.focus();
        }
    });

    closeChat.addEventListener('click', function() {
        aiChat.classList.remove('active');
    });

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Simulate AI thinking
        setTimeout(() => {
            const response = getAIResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }

    // Send message on button click
    sendMessageBtn.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Get AI response based on message
    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for exact matches first
        for (const keyword in botResponses) {
            if (lowerMessage === keyword) {
                return botResponses[keyword];
            }
        }
        
        // Check for keyword matches
        for (const keyword in botResponses) {
            if (lowerMessage.includes(keyword)) {
                return botResponses[keyword];
            }
        }
        
        // Check for related terms
        if (lowerMessage.includes('ship') || lowerMessage.includes('deliver')) {
            return botResponses['shipping'];
        }
        
        if (lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
            return botResponses['price'];
        }
        
        if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
            return botResponses['return'];
        }
        
        if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
            return botResponses['recommend'];
        }
        
        if (lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('call')) {
            return botResponses['contact'];
        }
        
        return botResponses['default'];
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = text;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Auto-open chat on product pages after delay
    if (window.location.pathname.includes('products.html')) {
        setTimeout(() => {
            if (!sessionStorage.getItem('chatOpened')) {
                aiChat.classList.add('active');
                sessionStorage.setItem('chatOpened', 'true');
                setTimeout(() => {
                    addMessage('I see you\'re browsing our products! Need help choosing the right supplements?', 'bot');
                }, 500);
            }
        }, 10000);
    }

    console.log('VitaBot AI Chatbot initialized');
});
