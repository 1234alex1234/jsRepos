'use strick';

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
let screensDoc = document.querySelectorAll('.screen');
let mainControl = document.querySelector('.main-controls__checkbox');
let cmsOpen = document.getElementById('cms-open');
const cmsVariants = document.querySelector('.hidden-cms-variants');
let cmsSelect = document.querySelector('#cms-select');
const mainControlsInput = cmsVariants.querySelector('.main-controls__input');






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
    this.addTitle();
    startBtn.addEventListener("click", this.start.bind(this));
    screenBtn.addEventListener("click", this.addScreenBlock.bind(this));
    range.addEventListener("input", this.getRollback.bind(this));
    resetBtn.addEventListener("click", this.reset.bind(this));
    cmsOpen.addEventListener("click", this.visabilityTypeOfCms.bind(this));
  },

  addTitle: function () {
    document.title = title.textContent;
  },

  start: function () {
    this.getNull();
    this.addScreens();
    this.addservices();
    this.addPrices();
    range.addEventListener("input", this.getRollback2.bind(this));
    this.addNull();

    // appData.logger();
  },

  reset: function () {
    this.getNull();
    this.AddNoneScreens();
    this.notDisableSxreens();
    this.startVisible();
    this.showResetResult();
    this.hiddenTypeOfCms();
    this.chekedFalse();
  },

  showResult: function () {
    totalInput1.value = this.screenPrice;
    totalInput2.value = this.sumCount;
    totalInput3.value = this.serviceNumberPrice + this.servicePercentPrice;
    totalInput4.value = this.fullPrice;
    totalInput5.value = this.rollbackPrice;
  },

  addScreens: function () {
    this.screens.length = 0;
    screensDoc = document.querySelectorAll('.screen');

    screensDoc.forEach((screen, index) => {

      const select = screen.querySelector('select');
      const input = screen.querySelector('input');
      const selectName = select.options[select.selectedIndex].textContent;

      if (input.value > 0 && select.selectedIndex !== 0) {
        appData.screens.push({
          id: index,
          name: selectName,
          price: +input.value * +select.value,
          count: +input.value
        });
      }
    });
  },

  addservices: function () {
    otherItemsPercent.forEach((item) => {

      const check = item.querySelector('input[type="checkbox"]');
      const label = item.querySelector('label').textContent;
      const input = item.querySelector('input[type="text"]');

      if (check.checked) {
        appData.servicesPercent[label] = +input.value;
      }
    });

    otherItemsNumber.forEach((item) => {

      const check = item.querySelector('input[type="checkbox"]');
      const label = item.querySelector('label').textContent;
      const input = item.querySelector('input[type="text"]');

      if (check.checked) {
        appData.servicesNumber[label] = +input.value;
      }
    });
  },

  addScreenBlock: function () {
    screensDoc = document.querySelectorAll('.screen');
    const cloneScreen = screensDoc[0].cloneNode(true);
    const cloneInput = cloneScreen.querySelector('input');
    cloneInput.value = '';
    screensDoc[screensDoc.length - 1].after(cloneScreen);
  },

  //Усложненка==================================
  visabilityTypeOfCms: function () {
    const viewsSelect = document.querySelector('#cms-select');

    if (cmsVariants.style.display == 'none') {
      cmsVariants.style.display = 'flex';

      cmsSelect = document.querySelector('#cms-select');
      const viewsOptions = viewsSelect.querySelectorAll('option')[2];

      cmsSelect.addEventListener("click", function () {

        if (cmsSelect.value == 'other') {
          mainControlsInput.style.display = 'block';
        } else {
          mainControlsInput.style.display = 'none';
        }

      });
    } else {
      cmsVariants.style.display = 'none';
    }
  },
  //================================================

  addPrices: function () {
    const cmsSelect = document.querySelector('#cms-select');
    const viewsSelect = document.querySelector('#cms-select');
    const viewsOptions = viewsSelect.querySelectorAll('option');

    for (let screen of this.screens) {
      this.screenPrice += +screen.price;
    }

    for (let keys in this.servicesNumber) {
      this.serviceNumberPrice += +this.servicesNumber[keys];
    }

    for (let keys in this.servicesPercent) {
      this.servicePercentPrice += +this.screenPrice * (this.servicesPercent[keys] / 100);
    }

    if (cmsSelect.value == '50') {
      this.fullPrice = this.screenPrice + this.serviceNumberPrice + this.servicePercentPrice;
      this.fullPrice = this.fullPrice + (this.fullPrice / 100 * 50);
    } else {
      this.fullPrice = this.screenPrice + this.serviceNumberPrice + this.servicePercentPrice;
    }

    this.rollbackPrice = this.fullPrice - this.fullPrice * (this.rollback / 100);

    this.screens.forEach((screen) => {
      if (screen.count !== 0 && screen.price !== 0) {
        appData.sumCount += screen.count;
      }
    });
  },

  addNull: function () {
    screensDoc = document.querySelectorAll('.screen');
    let isError = false;

    screensDoc.forEach((screen) => {
      const select = screen.querySelector('select').value;
      const input = screen.querySelector('input').value;

      if (select === '' || input === '') {
        isError = true;
      }
    });


    if (!isError && (appData.screens.length == screensDoc.length)) {
      this.showResult();
      this.disabledScreens();
      this.resetVisible();
    } else {
      alert("Заполни поля!");
    }
  },

  getRollback: function () {
    span.textContent = +range.value + '%';
    this.rollback = +range.value;
  },

  getRollback2: function () {
    totalInput5.value = this.fullPrice - this.fullPrice * (this.rollback / 100);
  },

  getNull: function () {
    this.screens.length = 0;
    this.sumCount = 0;
    screensDoc.length = 0;
    this.screenPrice = 0;
    this.fullPrice = 0;
    this.serviceNumberPrice = 0;
    this.servicePercentPrice = 0;
  },

  resetVisible: function () {
    resetBtn.style.display = 'block';
    startBtn.style.display = 'none';
  },

  disabledScreens: function () {
    screensDoc = document.querySelectorAll('.screen');
    screensDoc.forEach((screen) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');

      select.setAttribute("disabled", true);
      input.setAttribute("disabled", true);

    });

    screenBtn.setAttribute("disabled", true);
    cmsOpen.setAttribute("disabled", true);
    cmsSelect.setAttribute("disabled", true);
    const cmsOtherInput = document.querySelector('#cms-other-input');
    cmsOtherInput.setAttribute("disabled", true);

    otherItemsPercent.forEach((item) => {
      const input = item.querySelector('input');
      input.setAttribute("disabled", true);
    });

    otherItemsNumber.forEach((item) => {
      const input = item.querySelector('input');
      input.setAttribute("disabled", true);
    });
  },

  AddNoneScreens: function () {
    screensDoc = document.querySelectorAll('.screen');

    screensDoc.forEach((screen, index) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');

      if (index !== 0) {
        screen.remove();
      }

      select.value = '';
      input.value = '';
    });
  },

  notDisableSxreens: function () {
    screensDoc = document.querySelectorAll('.screen');
    screensDoc.forEach((screen) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');

      select.removeAttribute("disabled");
      input.removeAttribute("disabled");
    });

    screenBtn.removeAttribute("disabled");
    cmsOpen.removeAttribute("disabled");
    cmsSelect.removeAttribute("disabled");
    const cmsOtherInput = document.querySelector('#cms-other-input');
    cmsOtherInput.removeAttribute("disabled");

    otherItemsPercent.forEach((item) => {
      const input = item.querySelector('input');
      input.removeAttribute("disabled");
    });

    otherItemsNumber.forEach((item) => {
      const input = item.querySelector('input');
      input.removeAttribute("disabled");
    });
  },

  startVisible: function () {
    resetBtn.style.display = 'none';
    startBtn.style.display = 'block';
  },

  hiddenTypeOfCms: function () {
    const mainControlsInput = cmsVariants.querySelector('.main-controls__input');
    const viewsSelect = document.querySelector('#cms-select');
    cmsVariants.style.display = 'none';
  },


  chekedFalse: function () {
    otherItemsPercent.forEach((item) => {

      const check = item.querySelector('input[type="checkbox"]');

      if (check.checked) {
        check.checked = false;
      }

    });

    otherItemsNumber.forEach((item) => {

      const check = item.querySelector('input[type="checkbox"]');

      if (check.checked) {
        check.checked = false;
      }
    });

    cmsOpen.checked = false;
  },

  showResetResult: function () {
    totalInput1.value = 0;
    totalInput2.value = 0;
    totalInput3.value = 0;
    totalInput4.value = 0;
    totalInput5.value = 0;
    cmsSelect.value = '';
    mainControlsInput.style.display = 'none';
  },

  logger: function () {
    console.log("Стоимость доп услуг", appData.allServicePrices);
    console.log("Стоимость с учетом скидки", appData.servicePercentPrice);

    console.log(title);

    console.log(startBtn);
    console.log(resetBtn);

    console.log(screenBtn);

    console.log(otherItemsPercent);
    console.log(otherItemsNumber);

    console.log(range);
    console.log(span);
    console.log(screensDoc);

    console.log(totalInput1);
    console.log(totalInput2);
    console.log(totalInput3);
    console.log(totalInput4);
    console.log(totalInput5);

    for (let key in appData) {
      console.log(key + ":" + this[key]);
    }
  }
};

appData.init();