/*
	流程：
		0. 獲取元素
			->imgBox  裝圖片的盒子
			->pointBox 裝小按鈕的盒子

		1. 根據圖片創作小按鈕(選做)
			可通過js，也可以寫死
			1-1.確定生成多少小按鈕
				->依據 imgBox內多少li
			1-2.如何生成小按鈕
				->根據pointNum循環
				->每循環一次，創建一個li到pointBox內
			1-3.調整pointBox寬度(選作)
		
		2. 複製圖片實現無限輪播(選做)
			2-1.拿到要複製的元素 -> imgBox內第一及最後
			2-2.插入指定父元素
				first 插入到 imgBox最後 -> appendChild()
				last 插入到 imgBox最後 -> insertBefore()
			2-3.調整imgBox寬度
				更具調整完的元素數量來調整寬度
				2-3-1.調整imgBox的left，讓真實第一張顯示出來
				移動距離：可視窗口寬
		
		3. 自動輪播
			每間隔一段時間，讓imgBox移動一段距離
			3-1.使用 運動函數 讓imgBox移動
			3-2.間隔時間 setInterval
			3-3.運動的目標位置?
				當前顯示為索引[1]，imgBox的left是-600px
		
		4. 運動拉回
			-> 到假的第一張位置時，imgBox瞬間定位回去真實第一張
				-> 讓小按鈕跟著切換
					->讓pointBox裡面的小按鈕跟圖片搭配
					->圖片：0 1 2 3 4 5 6 7
					->按鈕：  0 1 2 3 4 5

		5.滑鼠移入移出事件
			->滑鼠移入時停止自動輪播
			->移出時再次開啟
			->移入移出範圍：banner

		6.點擊事件
			->左右按鈕
			->下排小按鈕
				->委託給共同父級banner

		7.切換頁面混亂問題
			7-1.原因
				當離開頁面時，DOM 不允許移動，任何 DOM 操作只會保留下來，但定時器不會停，造成多個定時器會在切回頁面時同時啟動，使同樣起點的位置有三種走法一起行動，讓運動錯亂
				=>解：
					離開頁面關閉定時器，回到頁面再次開啟
					=> visibilitychange 事件
						=>只能綁定document，當文檔流可視程度改變時觸發
			7-2切換頁面如何得知為離開還是回來?
				document 身上有一個屬性為 visibilitystate
				離開頁面時，值為 hidden
				回來頁面時，值為 visible
		8.點擊過快出現的抖動問題
			8-1.原因:當從A自動撥放到B時，假設5秒，我們在4秒的時候點擊下一張，3秒的時候也點擊下一張，會導致觸發兩個運動，但這兩個運動不是同時啟動，導致同個時間點速度不一樣，才造成頁面抖動
			=>解：設定開關，關閉點擊觸發，
				->開關打開：點擊事件作用，點下去關閉開關
				->開關關閉：點擊作用無效，等到一次運動結束打開 return


*/

// 0.獲取元素
const preview = document.querySelector(".preview");
const imgBox = document.querySelector(".imgBox");
const pointBox = document.querySelector(".pointBox");
// 可視區域寬
// 元素.clientWidth,是元素內容+padding區域的尺寸
const preview_width = preview.clientWidth;
// 接收定時器返回值
let timer = 0;
// 準備變量表示當前imgBox是第幾張，默認1
let index = 1;
// 準備開關默認開啟
let flag = true;
// 1.創建小按鈕
setPoint();
function setPoint() {
  // 1-1 獲取imgBox內的li
  // 元素.children
  const pointNum = imgBox.children.length;
  // 1-2 根據pointNum循環
  for (let i = 0; i < pointNum; i++) {
    // 創建li標籤
    const li = document.createElement("li");
    // 給小按鈕添加類名 <- 6.點擊事件
    li.classList.add("point_item");
    // 給小按鈕添加自定義屬性 <- 6.點擊事件
    li.dataset.point = i;
    // 默認第一個 class="active"
    if (i === 0) li.classList.add("active");
    // 放到pointBox中
    // 父元素.appendChild(子元素)
    pointBox.appendChild(li);
  }
  // 1-3 依照小按鈕數量調整pointBox寬度
  pointBox.style.width = (12 + 10) * pointNum + "px";
}

// 2.複製元素
copyEle();
function copyEle() {
  // 2-1 複製元素
  // 元素.cloneNode(true) 連帶子孫一起複製
  const first = imgBox.firstElementChild.cloneNode(true);
  const last = imgBox.lastElementChild.cloneNode(true);
  // 2-2  插入指定位置
  imgBox.appendChild(first);
  imgBox.insertBefore(last, imgBox.firstElementChild);
  // 2-3 調整imgBox寬度
  imgBox.style.width = imgBox.children.length * 100 + "%";
  // 2-3-1 調整imgBox left
  imgBox.style.left = -preview_width + "px";
}

// 3.自動輪播
autoPlay();
function autoPlay() {
  timer = setInterval(() => {
    if (!flag) return;
    // 改變當前顯示為第幾張
    index++;
    // 用運動函數切換一張
    move(imgBox, { left: -preview_width * index }, moveEnd);
    flag = false;
  }, 1000);
}

// 4.運動拉回
function moveEnd() {
  // 4-1 判斷來到假的第一張
  if (index === imgBox.children.length - 1) {
    index = 1;
    imgBox.style.left = -preview_width * index + "px";
  }
  // 4-2 判斷來到假的最後一張
  if (index === 0) {
    index = imgBox.children.length - 2;
    imgBox.style.left = -preview_width * index + "px";
  }
  // 4-3 小按鈕與圖片連動
  for (let i = 0; i < pointBox.children.length; i++) {
    pointBox.children[i].classList.remove("active");
  }
  pointBox.children[index - 1].classList.add("active");

  // 4-4 來到這邊恭喜運動作用結束 -> 開關打開
  flag = true;
}

// 5.移入移出
overOut();
function overOut() {
  // 5-1 移入事件->關閉計時器
  preview.addEventListener("mouseover", () => clearInterval(timer));
  //   5-2 移出
  preview.addEventListener("mouseout", () => autoPlay());
}

// 6.點擊切換
change();
function change() {
  // 6-1 給banner綁定點擊事件
  preview.addEventListener("click", (e) => {
    // 處理事件/事件目標兼容
    e = e || window.event;
    const target = e.target || e.srcElement;
    // 判斷點擊誰
    if (target.className === "left") {
      if (!flag) return;
      index--;
      move(imgBox, { left: -preview_width * index }, moveEnd);
      flag = false;
    }
    if (target.className === "right") {
      // 判斷開關是否開啟
      if (flag === false) return;
      index++;
      move(imgBox, { left: -preview_width * index }, moveEnd);
      // 運動開始作用關閉開關
      flag = false;
    }
    if (target.className === "point_item") {
      if (!flag) return;
      // 取得小按鈕索引
      index = target.dataset.point - 0 + 1;
      move(imgBox, { left: -preview_width * index }, moveEnd);
      flag = false;
    }
  });
}

// 7.切換標籤頁
changeTab();
function changeTab() {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      clearInterval(timer);
    } else if (document.visibilityState === "visible") {
      autoPlay();
    }
  });
}
