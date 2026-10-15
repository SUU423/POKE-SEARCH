// 背景画像を裏側で静かに先読みしておく
const preloadImages = [
    'image/sunny.jpg',
    'image/cloudy.jpg',
    'image/rain.jpg',
    'image/snow.jpg',
    'image/thunder.jpg'
];
preloadImages.forEach((src) => {
    const img = new Image();
    img.src = src;
});

//定義
const btn = document.getElementById('search');
const input = document.getElementById('inputId');
const detailName = document.getElementById('detail-name');
const detailHeight = document.getElementById('detail-height');
const detailWeight = document.getElementById('detail-weight');
const detailImage = document.getElementById('detail-image');
const resultPage = document.getElementById('result-page');
const closeBtn = document.getElementById('close-btn');
const detailVoice = document.getElementById('detail-voice');
const typeShow = document.getElementById('type-show');


//検索による動作

//ボタンを押したときのアクション
btn.addEventListener('click', async () => {
    detailName.innerHTML = '';
    detailHeight.innerHTML = '';
    detailWeight.innerHTML = '';
    detailImage.innerHTML = '';
    detailVoice.innerHTML = '';
    typeShow.innerHTML = '';
    //テキストボックスのフォーカスを外してキーボードを閉じる
    input.blur();
    

    try {
        const INPUTNAME = input.value.normalize('NFKC');

        const hiddenCodes = ['0000', '1111', '2222', '3333', '4444']; // 設定した隠しコードのリスト
        if (hiddenCodes.includes(INPUTNAME)) {
            WEATHERTEST(INPUTNAME); // 背景を変更する関数を実行[cite: 8]
            input.value = '';
            resultPage.style.display = 'none'; // 検索窓の文字を空にしてリセット（お好みで）
            return; // ★重要：ここで処理を終了させ、下のポケモン検索に進ませない
        }
        const foundPokemon = pokeList.find(item => item.ja === INPUTNAME);
        const POKENAME = foundPokemon ? foundPokemon.en.toLowerCase() : INPUTNAME.toLowerCase();
        //APIでデータを取得
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${POKENAME}`);
        const data = await response.json();
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        //取得したデータを格納
        const name = data.name;
        const jpName = speciesData.names.find(nameObj => nameObj.language.name === "ja");//ポケモンの日本語名を取得
        const JPN_NAME = jpName ? jpName.name : data.name;
        /*↑を別の方法で書く
        let JPN_NAME;
        if (jpName) {
            JPN_NAME = jpName.name;日本語データが見つかった場合
        } else {
            JPN_NAME = data.name;日本語データが見つからなかった場合
        }*/
        const typeImagesHtml = data.types.map(item => {//タイプの日本語名を取得
            const enType = item.type.name;
            const jaType = typeTranslate[enType];
            return `
        <div class="type-badge">
            <img src="typeimg/${enType}.svg" alt="${enType}">
            <span>${jaType}</span>
        </div>
    `;
        }).join("");
        const height = data.height / 10;
        const weight = data.weight / 10;
        const imageUrl = data.sprites.other["official-artwork"].front_default;
        const voice = data.cries.latest;
        const id = data.id;
        //HTMLタグを挿入
        detailName.innerHTML = `<p>No.${id} ${JPN_NAME}</p>`;
        typeShow.innerHTML = typeImagesHtml;
        detailHeight.innerHTML = `<p>身長: ${height}M</p>`;
        detailWeight.innerHTML = `<p>体重: ${weight}kg</p>`;
        detailVoice.innerHTML = `<audio controls><source src="${voice}" type="audio/mpeg"></audio>`;
        detailImage.innerHTML = `<img src="${imageUrl}" alt="${name}">`;
        document.querySelector('.aaa').style.display = 'block';
        resultPage.style.display = 'block';

        console.log(data);
    }
    catch (error) {
        //エラー時の挙動
        detailName.innerHTML =
            '<p>以下を確認してください</p><ul><li>綴りは合っているか</li><li>カタカナや数字で記載しているか</li><li>空白が入っていないか</li></ul> ';
        document.querySelector('.aaa').style.display = 'none';
        resultPage.style.display = 'block';
    }
});


//ランダムに画像と名前を表示する動作
window.addEventListener('DOMContentLoaded', async () => {
    for (let i = 1; i <= 8; i++) {
        //図鑑番号をランダムで決定
        const randomId = Math.floor(Math.random() * 721) + 1;
        //APIでデータを取得
        const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data2 = await response2.json();
        const speciesResponse2 = await fetch(data2.species.url);
        const speciesData2 = await speciesResponse2.json();
        //取得したデータを格納
        const IMAGEURL = data2.sprites.other["official-artwork"].front_default;
        const NAME = data2.name;
        const jpName2 = speciesData2.names.find(nameObj => nameObj.language.name === "ja");
        const JPN_NAME2 = jpName2 ? jpName2.name : data2.name;
        const typeImagesHtml2 = data2.types.map(item => {
            const enType2 = item.type.name;
            const jaType2 = typeTranslate[enType2];
            return `
        <div class="type-badge">
            <img src="typeimg/${enType2}.svg" alt="${enType2}">
            <span>${jaType2}</span>
        </div>
    `;
        }).join("");
        const HEIGHT = data2.height / 10;
        const WEIGHT = data2.weight / 10;
        const VOICE = data2.cries.latest;
        const ID = data2.id;

        //データを表示する動作
        const showimg = document.querySelectorAll(`.img${i}`);//Allを付けることで.imgのすべてを指定
        const showname = document.querySelectorAll(`.name${i}`)
        //スライドショーに画像を挿入
        showimg.forEach(div => {
            div.innerHTML = `<img src="${IMAGEURL}" alt="エラーが発生しました">`;
            //画像を押したときの詳細表示
            div.addEventListener('click', () => {
                detailName.innerHTML = `<p>No.${ID} ${JPN_NAME2}</p>`;
                typeShow.innerHTML = typeImagesHtml2;
                detailHeight.innerHTML = `<p>身長: ${HEIGHT}M</p>`;
                detailWeight.innerHTML = `<p>体重: ${WEIGHT}kg</p>`;
                detailVoice.innerHTML = `<audio controls><source src="${VOICE}" type="audio/mpeg"></audio>`;
                detailImage.innerHTML = `<img src="${IMAGEURL}" alt="${NAME}">`;
                resultPage.style.display = 'block';
                document.querySelector('.aaa').style.display = 'block';
            });
        });
        //スライドショーに名前を挿入
        showname.forEach(nameDiv => {
            nameDiv.innerHTML = `<p>No.${ID} ${JPN_NAME2}</p>`;
        });
    }
});


// 検索結果ページを閉じる動作
closeBtn.addEventListener('click', () => {
    resultPage.style.display = 'none';
});

//背景の変更(テスト用)
const WEATHERTEST = (INPUTNAME) => {
    document.body.className = ''
    if (INPUTNAME === '0000') {
        document.body.classList.add('sunny')
    } else if (INPUTNAME === '1111') {
        document.body.classList.add('cloudy');
    } else if (INPUTNAME === '2222') {
        document.body.classList.add('rain');
    } else if (INPUTNAME === '3333') {
        document.body.classList.add('snow');
    } else if (INPUTNAME === '4444') {
        document.body.classList.add('thunder');
    }
}
