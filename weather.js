window.addEventListener('DOMContentLoaded', async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(` 緯度: ${lat}, 経度: ${lon}`);

                try {
                    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Asia%2FTokyo`;
                    const response = await fetch(weatherUrl);
                    const data = await response.json();
                    const code = data.current_weather.weathercode;
                    console.log(`天気コード${code}`);
                    WEATHER(code);
                } catch (error) {
                    console.error("エラーが発生", error);
                }
            });
    } else {
        console.log("位置情報が取得できなかった為、静岡市の位置情報を代替的に使用")
        try { // ▼ これを追加
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${34.9756}&longitude=${138.3833}&current_weather=true&timezone=Asia%2FTokyo`;
            const response = await fetch(weatherUrl);
            const data = await response.json();
            const code = data.current_weather.weathercode;
            console.log(`天気コード${code}`);
            WEATHER(code);
        } catch (error) {
            console.error("エラーが発生", error);
        }
    }
})


const WEATHER = (code) => {
    document.body.className = ''
    if (code <= 1) {
        document.body.classList.add('sunny')
    } else if (code <= 3 || (code >= 45 && code <= 48)) {
        document.body.classList.add('cloudy');
    } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
        document.body.classList.add('rain');
    } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
        document.body.classList.add('snow');
    } else if (code >= 95 && code <= 99) {
        document.body.classList.add('thunder');
    } else {
        document.body.classList.add('sunny');
    }
}

