const title = document.getElementsByTagName('h1')[0];
const startBtn = document.getElementsByClassName('handler_btn')[0];
const resetBtn = document.getElementsByClassName('handler_btn')[1];
const screenBtn = document.querySelector('.screen-btn');
const otherItemsPercent = document.querySelectorAll('.other-items.percent');
const otherItemsNumber = document.querySelectorAll('.other-items.number');
const range = document.querySelector('.rollback input[type=range]');
const span = document.querySelector('.rollback span.range-value');
const totalInput1 = document.getElementsByClassName('total-input')[0];
const totalInput2 = document.getElementsByClassName('total-input')[1];
const totalInput3 = document.getElementsByClassName('total-input')[2];
const totalInput4 = document.getElementsByClassName('total-input')[3];
const totalInput5 = document.getElementsByClassName('total-input')[4];
let screens = document.querySelectorAll('.screen');


const isNumber = function (num) {
  return !isNaN(parseFloat(num)) && isFinite(num);
};

const isTrim = function (num) {
  return (num.length === 0 || !num.trim());
};


const appData = {
  rollback: 0,
  rollbackPrice: 0,
  title: '',
  screens: [],
  screenPrice: 0,
  adaptive: true,
  servicesPercent: {},
  servicesNumber: {},
  fullPrice: 0,
  servicePrice: 0,
  servicePercentPrice: 0,
  serviceNumberPrice: 0,
  sumCount: 0,

  init: function () {
    appData.addTitle();
    startBtn.addEventListener("click", appData.start);
    screenBtn.addEventListener("click", appData.addScreenBlock);
    range.addEventListener("input", appData.getRollback);
  },

  addTitle: function () {
    document.title = title.textContent;
  },

  start: function () {
    appData.addScreens();
    appData.addservices();
    appData.addPrices();
    range.addEventListener("input", appData.getRollback2);
    appData.logger();
    appData.showResult();
  },

  showResult: function () {
    appData.screens.find(function (item) {
      if (item.price == 0 || item.count == 0) {
        return;
      } else {
        totalInput1.value = appData.screenPrice;
        totalInput2.value = appData.sumCount;
        totalInput3.value = appData.serviceNumberPrice + appData.servicePercentPrice;
        totalInput4.value = appData.fullPrice;
        totalInput5.value = appData.rollbackPrice;
      }
    });
  },

  addScreens: function () {
    let screens = document.querySelectorAll('.screen');
    screens.forEach(function (screen, index) {

      const select = screen.querySelector('select');
      const input = screen.querySelector('input');
      const selectName = select.options[select.selectedIndex].textContent;

      appData.screens.push({
        id: index,
        name: selectName,
        price: +input.value * +select.value,
        count: +input.value
      });
    });
  },
  addservices: function () {
    otherItemsPercent.forEach(function (item) {

      const check = item.querySelector('input[type="checkbox"]');
      const label = item.querySelector('label').textContent;
      const input = item.querySelector('input[type="text"]');

      if (check.checked) {
        appData.servicesPercent[label] = +input.value;
      }
    });

    otherItemsNumber.forEach(function (item) {

      const check = item.querySelector('input[type="checkbox"]');
      const label = item.querySelector('label').textContent;
      const input = item.querySelector('input[type="text"]');

      if (check.checked) {
        appData.servicesNumber[label] = +input.value;
      }
    });
  },

  addScreenBlock: function () {
    const cloneScreen = screens[0].cloneNode(true);

    screens[screens.length - 1].after(cloneScreen);
  },

  addPrices: function () {
    for (let screen of appData.screens) {
      appData.screenPrice += +screen.price;
    }

    for (let keys in appData.servicesNumber) {
      appData.serviceNumberPrice += +appData.servicesNumber[keys];
    }

    for (let keys in appData.servicesPercent) {
      appData.servicePercentPrice += +appData.screenPrice * (appData.servicesPercent[keys] / 100);
    }

    appData.fullPrice = appData.screenPrice + appData.serviceNumberPrice + appData.servicePercentPrice;
    appData.rollbackPrice = appData.fullPrice - appData.fullPrice * (appData.rollback / 100);

    for (let screen of appData.screens) {
      if (screen.count !== 0 && screen.price !== 0) {
        appData.sumCount += screen.count;
      }
    }
  },


  getRollback: function () {
    span.textContent = +range.value;
    appData.rollback = +range.value;
    console.log("роллбек", appData.rollback);
  },

  getRollback2: function () {
    totalInput5.value = appData.fullPrice - appData.fullPrice * (appData.rollback / 100);
  },

  logger: function () {
    console.log("Стоимость доп услуг", appData.allServicePrices);
    console.log(appData.getRollbackMassage());
    console.log("Стоимость с учетом скидки", appData.servicePercentPrice);
    console.log(appData.screens);

    for (let key in appData) {
      console.log(key + ":" + appData[key]);
    }
  }
};

appData.init();

// appData.start();

// console.log(title);

// console.log(startBtn);
// console.log(resetBtn);

// console.log(screenBtn);

// console.log(otherItemsPercent);
// console.log(otherItemsNumber);

// console.log(range);
// console.log(span);
// console.log(screens);

// console.log(totalInput1);
// console.log(totalInput2);
// console.log(totalInput3);
// console.log(totalInput4);
// console.log(totalInput5);