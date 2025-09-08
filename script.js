document.getElementById('url-shorten-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const longUrl = document.getElementById('url-input').value;
    const resultDiv = document.getElementById('result');
    const qrDiv = document.getElementById('qr-code');

    // URL 유효성 검사
    if (!/^(https?:\/\/)/i.test(longUrl)) {
        resultDiv.innerHTML = 'Error: Please enter a valid URL starting with http:// or https://';
        return;
    }

    // shrtco.de API 호출
    try {
        const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(longUrl)}`);
        if (!response.ok) {
            throw new Error(`shrtco.de API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.ok) {
            const shortUrl = data.result.full_short_link;
            resultDiv.innerHTML = `Shortened URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a> <button onclick="navigator.clipboard.writeText('${shortUrl}')">Copy</button>`;
            // QR 코드 생성
            qrDiv.innerHTML = '';
            const qr = new QRCodeStyling({
                width: 150,
                height: 150,
                data: shortUrl,
                backgroundOptions: { color: '#ffffff' }
            });
            qr.append(qrDiv);
        } else {
            throw new Error(data.error || 'Invalid URL or API issue');
        }
    } catch (error) {
        console.error('shrtco.de Error:', error);
        // TinyURL 대체 시도
        try {
            const tinyResponse = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
            if (!tinyResponse.ok) {
                throw new Error(`TinyURL Error: ${tinyResponse.status}`);
            }
            const shortUrl = await tinyResponse.text();
            resultDiv.innerHTML = `Shortened URL (via TinyURL): <a href="${shortUrl}" target="_blank">${shortUrl}</a> <button onclick="navigator.clipboard.writeText('${shortUrl}')">Copy</button>`;
            qrDiv.innerHTML = '';
            const qr = new QRCodeStyling({
                width: 150,
                height: 150,
                data: shortUrl,
                backgroundOptions: { color: '#ffffff' }
            });
            qr.append(qrDiv);
        } catch (tinyError) {
            resultDiv.innerHTML = 'Error: Both APIs failed. Please try again later.';
            console.error('TinyURL Error:', tinyError);
        }
    }
});

// 다국어 지원
document.getElementById('lang').addEventListener('change', (e) => {
    const lang = e.target.value;
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('h2');
    const input = document.getElementById('url-input');
    const button = document.querySelector('button');
    if (lang === 'en') {
        h1.textContent = 'QuickShort';
        h2.textContent = 'Shorten Your Links in Seconds';
        input.placeholder = 'Paste your long URL here...';
        button.textContent = 'Shorten Now!';
    } else {
        h1.textContent = 'QuickShort';
        h2.textContent = '몇 초 만에 링크를 단축하세요';
        input.placeholder = '긴 URL을 여기에 붙여넣기...';
        button.textContent = '지금 단축!';
    }
});