const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

async function fetchGPTResponse(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 인성면접을 진행하는 AI 면접관입니다. 정중하고 진지한 말투로 질문하며, 지원자의 답변에 따라 후속 질문을 자연스럽게 이어가세요. 친절하면서도 평가의 목적을 유지하세요."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function sendMessage() {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  chatbox.innerHTML += `<div class="text-right">지원자: ${prompt}</div>`;
  userInput.value = '';
  chatbox.scrollTop = chatbox.scrollHeight;

  const reply = await fetchGPTResponse(prompt);
  chatbox.innerHTML += `<div class="text-left">AI 면접관: ${reply}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
