document.getElementById('url-shorten-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const longUrl = document.getElementById('url-input').value;
    const resultDiv = document.getElementById('result');
    
    try {
        const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(longUrl)}`);
        const data = await response.json();
        if (data.ok) {
            const shortUrl = data.result.full_short_link;
            resultDiv.innerHTML = `단축 URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a> <button onclick="navigator.clipboard.writeText('${shortUrl}')">복사</button>`;
        } else {
            resultDiv.innerHTML = '오류: 유효한 URL을 입력하세요.';
        }
    } catch (error) {
        resultDiv.innerHTML = 'API 오류: 나중에 다시 시도하세요.';
    }
});