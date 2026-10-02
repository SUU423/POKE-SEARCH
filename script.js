//諸々省略
const btn = document.getElementById('search');
const input = document.getElementById('inputId');
const detailName = document.getElementById('detail-name');
const detailType = document.getElementById('detail-type');
const detailHeight = document.getElementById('detail-height');
const detailWeight = document.getElementById('detail-weight');
const detailImage = document.getElementById('detail-image');
const resultPage = document.getElementById('result-page');
const closeBtn = document.getElementById('close-btn');
const detailVoice = document.getElementById('detail-voice');

//ID検索による動作
btn.addEventListener('click', async () => {
    detailName.innerHTML = '';
    detailType.innerHTML = '';
    detailHeight.innerHTML = '';
    detailWeight.innerHTML = '';
    detailImage.innerHTML = '';
    detailVoice.innerHTML = '';

    try {
        const POKEID = input.value.normalize('NFKC').toLowerCase();// 入力値を正規化して小文字に変換
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${POKEID}`);
        const data = await response.json();

        const name = data.name;
        const type = data.types.map(item => item.type.name).join(" / ");
        const height = data.height / 10;
        const weight = data.weight / 10;
        const imageUrl = data.sprites.other["official-artwork"].front_default;
        const voice = data.cries.latest;
        const id = data.id;

        detailName.innerHTML = `<p>No.${id} ${name}</p>`;
        detailType.innerHTML = `<p>タイプ: ${type}</p>`;
        detailHeight.innerHTML = `<p>身長: ${height}M</p>`;
        detailWeight.innerHTML = `<p>体重: ${weight}kg</p>`;
        detailVoice.innerHTML = `<audio controls><source src="${voice}" type="audio/mpeg"></audio>`;
        detailImage.innerHTML = `<img src="${imageUrl}" alt="${name}">`;
        console.log(data);
    }
    catch (error) {
        detailName.innerHTML = '<p>正しい番号を入力してください。</p>';
        console.error('Error fetching Pokémon data:', error);
    }
});


//ランダムに画像を表示する動作
window.addEventListener('DOMContentLoaded', async () => {
    for (let i = 1; i <= 8; i++) {
        const randomId = Math.floor(Math.random() * 1025) + 1;
        const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data2 = await response2.json();

        const IMAGEURL = data2.sprites.other["official-artwork"].front_default;
        const NAME = data2.name;
        const TYPE = data2.types.map(item => item.type.name).join(" / ");
        const HEIGHT = data2.height / 10;
        const WEIGHT = data2.weight / 10;
        const VOICE = data2.cries.latest;
        const ID = data2.id;

        const showimg = document.querySelectorAll(`.img${i}`);
        showimg.forEach(div => {
            div.innerHTML = `<img src="${IMAGEURL}" alt="エラーが発生しました">`;
            div.addEventListener('click', () => {
                detailName.innerHTML = `<p>No.${ID} ${NAME}</p>`;
                detailType.innerHTML = `<p>タイプ: ${TYPE}</p>`;
                detailHeight.innerHTML = `<p>身長: ${HEIGHT}M</p>`;
                detailWeight.innerHTML = `<p>体重: ${WEIGHT}kg</p>`;
                detailVoice.innerHTML = `<audio controls><source src="${VOICE}" type="audio/mpeg"></audio>`;
                detailImage.innerHTML = `<img src="${IMAGEURL}" alt="${NAME}">`;
                resultPage.style.display = 'block';
            });
        });
    }
});


//検索結果のページを表示する動作
btn.addEventListener('click', () => {
    resultPage.style.display = 'block';
});

// 検索結果ページを閉じる動作
closeBtn.addEventListener('click', () => {
    resultPage.style.display = 'none';
});