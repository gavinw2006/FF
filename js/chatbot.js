/**
 * FurtherFinance AI Chatbot
 * Backend: DeepSeek API (deepseek-chat model)
 * Get a free API key at: https://platform.deepseek.com
 *
 * Replace the placeholder below with your actual DeepSeek API key.
 * The free tier provides sufficient capacity for this use case.
 */

(function () {
  var DEEPSEEK_API_KEY = 'YOUR_DEEPSEEK_API_KEY';

  var SYSTEM_PROMPT = `You are an AI mortgage assistant for Further Finance Group, a trusted Australian mortgage broker based in Camberwell, Melbourne (Est. 2005).

Your role is to help website visitors with questions about Australian home loans and mortgages. You are knowledgeable, professional, and friendly.

Key facts about Further Finance Group:
- Located at 386 Burke Road, Camberwell VIC 3124
- Phone: 03 9008 5660 | Email: info@furtherfinance.com.au
- Access to 20+ banks and lenders across Australia
- Services: Home Loans, Investment Loans, Commercial Loans, Car Loans, Overseas Income Loans, Construction Loans, SMSF Loans
- Maximum LVR up to 97% for eligible borrowers
- Free initial consultation — no cost, no obligation

You can help with:
- Explaining home loan types (variable, fixed, split, interest-only, P&I)
- Comparing the Big Four banks: ANZ, Commonwealth Bank (CBA), Westpac, NAB
- Explaining concepts like LVR, LMI, offset accounts, redraw facilities, comparison rates
- Discussing the borrowing process (pre-approval, unconditional approval, settlement)
- Investment property loans and negative gearing basics
- SMSF lending (Limited Recourse Borrowing Arrangements)
- Construction loans and progressive drawdown
- Overseas income loans for expats and foreign income earners
- General Australian property market questions

Important rules:
- Always recommend speaking to a Further Finance Group broker for personalised advice
- Never provide specific rate quotes — direct users to the Interest Rates page or to call us
- Do not provide formal financial advice — you are an information assistant
- Keep responses concise and helpful (2-4 short paragraphs maximum)
- If asked something outside your scope, politely redirect to contacting the team
- Use Australian English spelling`;

  var conversationHistory = [];
  var isOpen = false;
  var isLoading = false;

  function createWidget() {
    // --- Inject CSS ---
    var style = document.createElement('style');
    style.textContent = `
      #ff-chat-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

      #ff-chat-bubble {
        position: fixed;
        bottom: 28px;
        right: 28px;
        width: 58px;
        height: 58px;
        background: #0b2d59;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(11,45,89,.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9998;
        transition: transform .2s ease, box-shadow .2s ease;
        border: none;
        outline: none;
      }
      #ff-chat-bubble:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 28px rgba(11,45,89,.5);
      }
      #ff-chat-bubble svg {
        width: 26px;
        height: 26px;
        fill: #ffffff;
        transition: opacity .2s ease;
      }
      #ff-chat-bubble .icon-close { display: none; }

      #ff-chat-panel {
        position: fixed;
        bottom: 100px;
        right: 28px;
        width: 360px;
        max-width: calc(100vw - 32px);
        height: 520px;
        max-height: calc(100vh - 120px);
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 8px 40px rgba(11,45,89,.18);
        display: flex;
        flex-direction: column;
        z-index: 9997;
        overflow: hidden;
        opacity: 0;
        transform: translateY(16px) scale(.97);
        pointer-events: none;
        transition: opacity .22s ease, transform .22s ease;
      }
      #ff-chat-panel.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }

      #ff-chat-header {
        background: #0b2d59;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }
      #ff-chat-header-avatar {
        width: 36px;
        height: 36px;
        background: rgba(200,152,26,.25);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      #ff-chat-header-avatar svg {
        width: 18px;
        height: 18px;
        fill: #f5c540;
      }
      #ff-chat-header-text { flex: 1; }
      #ff-chat-header-text strong {
        display: block;
        color: #ffffff;
        font-size: .875rem;
        font-weight: 600;
        line-height: 1.3;
      }
      #ff-chat-header-text span {
        color: rgba(255,255,255,.6);
        font-size: .75rem;
      }
      #ff-chat-header-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: rgba(255,255,255,.7);
        display: flex;
        align-items: center;
        transition: color .15s;
      }
      #ff-chat-header-close:hover { color: #ffffff; }
      #ff-chat-header-close svg { width: 18px; height: 18px; fill: currentColor; }

      #ff-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scroll-behavior: smooth;
      }
      #ff-chat-messages::-webkit-scrollbar { width: 4px; }
      #ff-chat-messages::-webkit-scrollbar-thumb { background: #d5dce8; border-radius: 4px; }

      .ff-msg {
        max-width: 82%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: .84rem;
        line-height: 1.55;
        word-wrap: break-word;
      }
      .ff-msg-bot {
        background: #f5f7fa;
        color: #1c1c2e;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
        border: 1px solid #e8ecf2;
      }
      .ff-msg-user {
        background: #0b2d59;
        color: #ffffff;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      .ff-msg-typing {
        background: #f5f7fa;
        border: 1px solid #e8ecf2;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
        padding: 12px 16px;
      }
      .ff-typing-dots {
        display: flex;
        gap: 5px;
        align-items: center;
      }
      .ff-typing-dots span {
        width: 7px;
        height: 7px;
        background: #5a6375;
        border-radius: 50%;
        animation: ff-bounce .9s infinite ease-in-out;
      }
      .ff-typing-dots span:nth-child(2) { animation-delay: .15s; }
      .ff-typing-dots span:nth-child(3) { animation-delay: .3s; }
      @keyframes ff-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-5px); }
      }

      #ff-chat-footer {
        padding: 12px 14px;
        border-top: 1px solid #e8ecf2;
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        background: #ffffff;
      }
      #ff-chat-input {
        flex: 1;
        border: 1px solid #d5dce8;
        border-radius: 8px;
        padding: 9px 12px;
        font-size: .84rem;
        color: #1c1c2e;
        background: #f5f7fa;
        resize: none;
        outline: none;
        height: 40px;
        line-height: 1.4;
        transition: border-color .15s;
        font-family: inherit;
      }
      #ff-chat-input:focus { border-color: #0b2d59; background: #ffffff; }
      #ff-chat-input::placeholder { color: #9aa3b0; }
      #ff-chat-send {
        width: 40px;
        height: 40px;
        background: #0b2d59;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background .15s;
      }
      #ff-chat-send:hover { background: #071e3d; }
      #ff-chat-send:disabled { background: #d5dce8; cursor: not-allowed; }
      #ff-chat-send svg { width: 17px; height: 17px; fill: #ffffff; }

      #ff-chat-disclaimer {
        text-align: center;
        font-size: .68rem;
        color: #9aa3b0;
        padding: 0 14px 10px;
        line-height: 1.4;
        flex-shrink: 0;
      }

      @media (max-width: 420px) {
        #ff-chat-panel {
          bottom: 0;
          right: 0;
          width: 100vw;
          max-width: 100vw;
          height: 100dvh;
          max-height: 100dvh;
          border-radius: 0;
        }
        #ff-chat-bubble {
          bottom: 20px;
          right: 20px;
        }
      }
    `;
    document.head.appendChild(style);

    // --- Build HTML ---
    var widget = document.createElement('div');
    widget.id = 'ff-chat-widget';
    widget.innerHTML = `
      <button id="ff-chat-bubble" aria-label="Open mortgage assistant chat">
        <svg class="icon-chat" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
        <svg class="icon-close" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>

      <div id="ff-chat-panel" role="dialog" aria-label="FurtherFinance mortgage assistant">
        <div id="ff-chat-header">
          <div id="ff-chat-header-avatar">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          </div>
          <div id="ff-chat-header-text">
            <strong>FF Mortgage Assistant</strong>
            <span>Ask me about Australian home loans</span>
          </div>
          <button id="ff-chat-header-close" aria-label="Close chat">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <div id="ff-chat-messages"></div>

        <div id="ff-chat-footer">
          <textarea id="ff-chat-input" placeholder="Ask about home loans, rates, LVR…" rows="1" aria-label="Your message"></textarea>
          <button id="ff-chat-send" aria-label="Send message">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
        <div id="ff-chat-disclaimer">General information only — not financial advice. Speak to a broker for personalised guidance.</div>
      </div>
    `;
    document.body.appendChild(widget);

    // --- Wire events ---
    var bubble = document.getElementById('ff-chat-bubble');
    var panel  = document.getElementById('ff-chat-panel');
    var input  = document.getElementById('ff-chat-input');
    var sendBtn = document.getElementById('ff-chat-send');
    var closeBtn = document.getElementById('ff-chat-header-close');
    var messages = document.getElementById('ff-chat-messages');

    bubble.addEventListener('click', function () {
      isOpen = !isOpen;
      panel.classList.toggle('open', isOpen);
      bubble.querySelector('.icon-chat').style.display = isOpen ? 'none' : '';
      bubble.querySelector('.icon-close').style.display = isOpen ? '' : 'none';
      if (isOpen) {
        if (messages.children.length === 0) showWelcome();
        setTimeout(function () { input.focus(); }, 250);
      }
    });

    closeBtn.addEventListener('click', function () {
      isOpen = false;
      panel.classList.remove('open');
      bubble.querySelector('.icon-chat').style.display = '';
      bubble.querySelector('.icon-close').style.display = 'none';
    });

    sendBtn.addEventListener('click', handleSend);

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  function showWelcome() {
    appendMessage('bot', "Hi there! I'm the Further Finance Group mortgage assistant. I can help with questions about Australian home loans, interest rates, borrowing capacity, and more.\n\nWhat would you like to know?");
  }

  function appendMessage(role, text) {
    var messages = document.getElementById('ff-chat-messages');
    var div = document.createElement('div');
    div.className = 'ff-msg ff-msg-' + (role === 'bot' ? 'bot' : 'user');
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function showTyping() {
    var messages = document.getElementById('ff-chat-messages');
    var div = document.createElement('div');
    div.className = 'ff-msg ff-msg-typing';
    div.id = 'ff-typing-indicator';
    div.innerHTML = '<div class="ff-typing-dots"><span></span><span></span><span></span></div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    var el = document.getElementById('ff-typing-indicator');
    if (el) el.remove();
  }

  function handleSend() {
    var input = document.getElementById('ff-chat-input');
    var sendBtn = document.getElementById('ff-chat-send');
    var text = input.value.trim();
    if (!text || isLoading) return;

    appendMessage('user', text);
    input.value = '';
    input.style.height = '';

    conversationHistory.push({ role: 'user', content: text });

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    var messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ].concat(conversationHistory);

    fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + DEEPSEEK_API_KEY
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        stream: false,
        max_tokens: 600
      })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('API error ' + res.status);
      return res.json();
    })
    .then(function (data) {
      removeTyping();
      var reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content.trim()
        : 'Sorry, I couldn\'t get a response. Please try again or call us on 03 9008 5660.';
      appendMessage('bot', reply);
      conversationHistory.push({ role: 'assistant', content: reply });
    })
    .catch(function () {
      removeTyping();
      appendMessage('bot', 'Sorry, I\'m having trouble connecting right now. Please call us on 03 9008 5660 or email info@furtherfinance.com.au — our team is happy to help.');
    })
    .finally(function () {
      isLoading = false;
      sendBtn.disabled = false;
      document.getElementById('ff-chat-input').focus();
    });
  }

  // Initialise when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
}());
