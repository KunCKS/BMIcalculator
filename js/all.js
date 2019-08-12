let BMIArray = [];
//存取變數
let btnResult = document.querySelector("#btnResult");
let btnResultSpan = document.querySelector("#btnResult span");
let BMIList = document.querySelector("#BMIList");
let inputHeight = document.querySelector("#height");
let inputWeight = document.querySelector("#weight");
let recordStatus = document.querySelector("#record-Status");
let recordBMI = document.querySelector("#record-BMI");
let recordWeight = document.querySelector("#record-Weight");
let recordHeight = document.querySelector("#record-Height");
let recordTime = document.querySelector("#record-Time");
//
//監聽
btnResult.addEventListener("click", function() {
  bodyData();
});
BMIList.addEventListener("click", function(e) {
  if (e.target.nodeName !== "A") {
    return;
  }
  deleteItem(e);
});
//監聽END
//初始化
init();
function init() {
  let localData = JSON.parse(localStorage.getItem("BMIData")) || [
    {
      height: "183",
      weight: "80",
      status: "理想",
      bmiData: "此為範例",
      date: "08-12-2019"
    }
  ];
  pageUpdate(localData);
}
//初始化 END
//BMI計算
function BMIcalc(weight, height) {
  let bmiData = weight / Math.pow(height / 100, 2);
  return bmiData;
}
//抓取日期
function date() {
  let today = new Date();
  let yyyy = today.getFullYear();
  let mm = (today.getMonth() + 1 < 10 ? "0" : "") + (today.getMonth() + 1);
  let dd = (today.getDate() < 10 ? "0" : "") + today.getDate();
  return mm + "-" + dd + "-" + yyyy;
}
//BTN抓input資料推到陣列中
function bodyData() {
  //這邊因用偽元素寫結果的返回，無法監聽，所以改用條件判斷來開關btn的樣式
  //初始狀態及呈現結果時的點擊觸發也利用CSS的 pointer-events來寫
  if (btnResult.dataset.switch == "true") {
    btnResultInit();
    console.log("有觸發喔！！");
    return;
  }
  if (inputHeight.value == "" || inputWeight.value == "") {
    alert("請輸入資料");
    return;
  }
  //建立物件來儲存各項資料
  let BMIObj = {};
  BMIObj.height = inputHeight.value;
  BMIObj.weight = inputWeight.value;
  let bmiData = BMIcalc(inputWeight.value, inputHeight.value).toFixed(2);
  console.log("您的BMI是" + bmiData);
  if (bmiData < 18.5) {
    BMIObj.status = "過輕";
  } else if ((18.5 <= bmiData) & (bmiData < 24)) {
    BMIObj.status = "理想";
    console.log(2);
  } else if ((24 <= bmiData) & (bmiData < 27)) {
    BMIObj.status = "過重";
  } else if ((27 <= bmiData) & (bmiData < 30)) {
    BMIObj.status = "輕度肥胖";
  } else if ((30 <= bmiData) & (bmiData < 35)) {
    BMIObj.status = "中度肥胖";
  } else {
    BMIObj.status = "重度肥胖";
  }
  BMIObj.bmiData = bmiData;
  BMIObj.date = date();
  // console.log("此次測量產生的物件資料是" + JSON.stringify(BMIObj));
  let localData = JSON.parse(localStorage.getItem("BMIData")) || [];
  // console.log(localData);
  localData.push(BMIObj);
  // console.log(BMIArray);
  let BMIArryStr = JSON.stringify(localData);
  localStorage.setItem("BMIData", BMIArryStr);
  pageUpdate(localData);
  btnResultUpdate(BMIObj);
}
//將結果渲染到頁面
function pageUpdate(data) {
  let content = "";
  //跑迴圈將符合不同條件的模板一一塞入content內，跑完迴圈再行頁面渲染
  for (i = 0; i < data.length; i++) {
    if (data[i].status == "過輕") {
      let items = itemsUpdate("UnderWeight", data);
      content += items;
    } else if (data[i].status == "理想") {
      let items = itemsUpdate("normal", data);
      content += items;
    } else if (data[i].status == "過重") {
      let items = itemsUpdate("OverWeight-l", data);
      content += items;
    } else if (data[i].status == "輕度肥胖" || data[i].status == "中度肥胖") {
      let items = itemsUpdate("OverWeight-m", data);
      content += items;
    } else {
      let items = itemsUpdate("OverWeight-s", data);
      content += items;
    }
  }
  BMIList.innerHTML = content;
}
//組成計算結果的模板
//依據載入的變數來修改要渲染的模板，status填入已寫好個狀態的class名稱，data則引入localStorage的資料
function itemsUpdate(status, data) {
  let item =
    '<li class="list-group-item mb-2 position-relative delete"><div class="tag tag-' +
    status +
    '"></div><a href="#" class="btnDelete material-icons" data-num="' +
    i +
    '">clear</a><div class="row no-gutters"><div class="col-md-2 col-6 h4 mb-0 d-flex justify-content-center align-items-center"><span id="record-Status">' +
    data[i].status +
    '</span></div><div class="col-md-3 col-6 h4 mb-0 ml-md-auto d-flex justify-content-center align-items-center"><span class="h6 mb-0 mr-2">BMI</span><span id="record-BMI">' +
    data[i].bmiData +
    '</span></div><div class="col-md-3 col-6 h4 mb-0 mt-md-0 mt-2 d-flex justify-content-center align-items-center"><span class="h6 mb-0 mr-2">weight</span><span id="record-Weight">' +
    data[i].weight +
    'kg</span></div><div class="col-md-3 col-6 h4 mb-0 mt-md-0 mt-2 d-flex justify-content-center align-items-center"><span class="h6 mb-0 mr-2">height</span><span id="record-Height">' +
    data[i].height +
    'cm</span></div><div class="col mt-md-0 mt-2 d-flex justify-content-center align-items-center"><span style="font-size: 10px" id="record-Time">' +
    data[i].date +
    "</span></div></div></li>";
  return item;
}
//BtnResult結果渲染
function btnResultUpdate(data) {
  // console.log(btnResult.attributes["class"].value);
  if (data.status == "過輕") {
    btnResult.attributes["class"].value =
      "btn btn-warning btn-result rounded-circle text-center text-dark result result-UnderWeight";
    btnResult.dataset.switch = "true";
    btnResultSpan.innerHTML = data.bmiData;
  } else if (data.status == "理想") {
    btnResult.attributes["class"].value =
      "btn btn-warning btn-result rounded-circle text-center text-dark result result-normal";
    btnResult.dataset.switch = "true";
    btnResultSpan.innerHTML = data.bmiData;
  } else if (data.status == "過重") {
    btnResult.attributes["class"].value =
      "btn btn-warning btn-result rounded-circle text-center text-dark result result-OverWeight-l";
    btnResult.dataset.switch = "true";
    btnResultSpan.innerHTML = data.bmiData;
  } else if (data.status == "輕度肥胖") {
    btnResult.attributes["class"].value =
      "btn btn-warning btn-result rounded-circle text-center text-dark result result-OverWeight-m";
    btnResult.dataset.switch = "true";
    btnResultSpan.innerHTML = data.bmiData;
  } else if (data.status == "中度肥胖") {
    btnResult.attributes["class"].value =
      "btn btn-warning btn-result rounded-circle text-center text-dark result result-OverWeight-d";
    btnResult.dataset.switch = "true";
    btnResultSpan.innerHTML = data.bmiData;
  } else {
    btnResult.attributes["class"].value =
      "btn btn-warning btn-result rounded-circle text-center text-dark result result-OverWeight-s";
    btnResult.dataset.switch = "true";
    btnResultSpan.innerHTML = data.bmiData;
  }
}
//BtnResult初始化
function btnResultInit() {
  btnResult.attributes["class"].value =
    "btn btn-warning btn-result rounded-circle text-center text-dark";
  btnResult.removeAttribute("data-switch");
  btnResultSpan.innerHTML = "看結果";
}
//刪除資料
function deleteItem(e) {
  e.preventDefault();
  let localData = JSON.parse(localStorage.getItem("BMIData")) || [];
  localData.splice(e.target.dataset.num, 1);
  let BMIArryStr = JSON.stringify(localData);
  localStorage.setItem("BMIData", BMIArryStr);
  pageUpdate(localData);
}
