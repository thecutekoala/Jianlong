const menu = document.querySelector(".menu");
const navbar = document.querySelector(".navbar");

navbar.addEventListener("click", (e) => {
  e.preventDefault();
  let sideMenu = document.createElement("div");
  let ol = document.createElement("ol");
  let li = document.createElement("li");
  sideMenu.classList.add("sideMenu");

  menu.appendChild(sideMenu);

  menu.style.animation = "scaleUp .6s forwards";
});

// window.onscroll = function () {
//   // 1-1取得瀏覽器捲去的高度
//   let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//   // 2.判斷捲去高度
//   if (scrollTop >= 300) {
//     // 設置能看到
//     header.style.top = 0;
//     // 實際上要給display設置一個block文本內容
//     go.style.display = "block";
//   } else {
//     header.style.top = "-60px";
//     go.style.display = "none";
//   }
// };
