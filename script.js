const probabilities = {
  "伝説レア": 0.3,
  "超激レア": 5.0,
  "激レア": 25.0,
  "レア": 69.7
};

const gachaPool = {
  "伝説レア": ["月影の少年カヲル"],
  "超激レア": [
    "エヴァンゲリオン零号機", "エヴァンゲリオン初号機", "ネコシンジ", "白夜姫のレイ", "第6の使徒", "第10の使徒",
    "エヴァンゲリオン量産機", "エヴァンゲリオン2号機", "ゼロムーンオペレーターズ", "エヴァンゲリオン8号機",
    "空中艦艇ゼロヴンダー", "第4の使徒", "第9の使徒", "隻眼の少女アスカ", "エヴァンゲリオン第13号機"
  ],
  "激レア": [
    "ちびレイ", "ちびアスカ", "ちびミサト", "ちびマリ", "ちびリツコ", "ちびアヤナミレイ(仮称)", "ネコぼさつ",
    "ネコ番長", "ネコザイル", "ねこタツ", "オタネコ", "ネコスイマー", "ネコリンゴ", "ネコバスタブ", "ネコ寿司",
    "窓辺の乙女ネコ", "ネコバーベル", "ネコスケート", "ネコトースター", "ネコジャンパー", "ネコフェンシング",
    "泉のネコ女神"
  ],
  "レア": [
    "ネコレイ", "ネコアスカ", "ネコマリ", "ネコカヲル", "ネコホッピング", "ネコ車輪", "ネコエステ", "ねこジュラ",
    "ねこファイター", "ねこ海賊", "ねこ泥棒", "ねこ僧侶", "ねこ占い師", "ネコシャーマン", "ネコ魔女", "ネコアーチャー",
    "ネコ魔剣士", "ねこガンマン", "たけうまねこ", "ブリキネコ", "ネコロッカー", "ねこ人魚", "サイキックネコ",
    "ネコ陰陽師", "ネコバサミ", "ネコボクサー", "ネコ探査機", "ネコマタドール", "ネコ武闘家"
  ]
};

// 履歴とカウント
const history = [];
const counts = {
  "伝説レア": {},
  "超激レア": {},
  "激レア": {},
  "レア": {}
};

function rollGacha() {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const rarity in probabilities) {
    cumulative += probabilities[rarity];
    if (roll <= cumulative) {
      const items = gachaPool[rarity];
      const choice = items[Math.floor(Math.random() * items.length)];
      return { text: choice, rarity };
    }
  }
  // 通らない想定
  return { text: "エラー", rarity: "レア" };
}

function updateDisplay() {
  const historyDiv = document.getElementById("history");
  // レア度順でグループ表示（箇条書き）
  const raritiesOrder = ["伝説レア", "超激レア", "激レア", "レア"];
  let html = "";
  raritiesOrder.forEach(rarity => {
    const itemsCount = counts[rarity];
    if(Object.keys(itemsCount).length === 0) return; // なければ表示しない

    html += `<h3>${rarity}</h3><ul>`;
    for(const [name, num] of Object.entries(itemsCount)){
      html += `<li>${name} (${num})</li>`;
    }
    html += "</ul>";
  });
  historyDiv.innerHTML = html;

  // 獲得数表示（レア度ごとに合計数）
  const countsDiv = document.getElementById("counts");
  const sums = raritiesOrder.map(rarity => {
    const total = Object.values(counts[rarity]).reduce((a,b)=>a+b,0);
    return `<b>${rarity}:</b> ${total}`;
  });
  countsDiv.innerHTML = sums.join(" | ");
}

// ガチャボタンイベント
document.getElementById("singleBtn").onclick = () => {
  const result = rollGacha();
  history.push(result);

  if(!counts[result.rarity][result.text]){
    counts[result.rarity][result.text] = 0;
  }
  counts[result.rarity][result.text]++;

  document.getElementById("result").textContent = `🎉 ガチャ結果: ${result.text} (${result.rarity})`;
  updateDisplay();
};

document.getElementById("tenBtn").onclick = () => {
  const results = [];
  for(let i=0; i<10; i++){
    const res = rollGacha();
    history.push(res);

    if(!counts[res.rarity][res.text]){
      counts[res.rarity][res.text] = 0;
    }
    counts[res.rarity][res.text]++;

    results.push(`${i+1}. ${res.text} (${res.rarity})`);
  }
  document.getElementById("result").textContent = `🎉 10連ガチャ結果:\n` + results.join("\n");
  updateDisplay();
};

// 管理者パネル
const adminPanel = document.getElementById("adminInputs");
const passwordInput = document.getElementById("passwordInput");
const passwordCheckBtn = document.getElementById("passwordCheckBtn");
const probLegendInput = document.getElementById("probLegend");
const probSuperInput = document.getElementById("probSuper");
const probRareInput = document.getElementById("probRare");
const probNormalInput = document.getElementById("probNormal");
const updateProbsBtn = document.getElementById("updateProbsBtn");
const probWarning = document.getElementById("probWarning");

passwordCheckBtn.onclick = () => {
  if(passwordInput.value === "Val2489"){
    adminPanel.classList.remove("hidden");
    passwordInput.disabled = true;
    passwordCheckBtn.disabled = true;
    // 確率入力欄に現在値セット
    probLegendInput.value = probabilities["伝説レア"];
    probSuperInput.value = probabilities["超激レア"];
    probRareInput.value = probabilities["激レア"];
    probNormalInput.value = probabilities["レア"];
  } else {
    alert("パスワードが違います！");
  }
};

updateProbsBtn.onclick = () => {
  const vals = [
    parseFloat(probLegendInput.value),
    parseFloat(probSuperInput.value),
    parseFloat(probRareInput.value),
    parseFloat(probNormalInput.value)
  ];
  if(vals.some(isNaN) || vals.some(v => v < 0)){
    probWarning.textContent = "すべて0以上の数値を入力してください。";
    return;
  }
  const sum = vals.reduce((a,b)=>a+b,0);
  if(sum <= 0){
    probWarning.textContent = "確率の合計は0より大きくしてください。";
    return;
  }
  probWarning.textContent = sum.toFixed(1) === "100.0" ? "" : `確率の合計が100%ではありません（現在: ${sum.toFixed(1)}%）`;

  probabilities["伝説レア"] = vals[0];
  probabilities["超激レア"] = vals[1];
  probabilities["激レア"] = vals[2];
  probabilities["レア"] = vals[3];

  alert("確率を更新しました！");
};
