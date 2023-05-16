function UserInput(ID, type, desc, value) {
  this.ID = ID;
  this.type = type;
  this.desc = desc;
  this.value = value;
}

var DataController = (function () {
  // private
  var budget = 0;
  var totals = {
    inc: 0,
    exp: 0,
  };
  var list = {
    inc: [],
    exp: [],
  };

  // public
  return {
    updateTotal: function (userInput) {
      totals[userInput.type] += Number(userInput.value);
      return totals;
    },
    updateBudget: function () {
      budget = totals.inc - totals.exp;
      return budget;
    },
    updateList: function (inputs) {
      var type = inputs.type;

      if (list[inputs.type].length === 0) {
        inputs.ID = 0;
      } else {
        inputs.ID = list[type][list[type].length - 1].ID + 1;
      }
      list[inputs.type].push(inputs);
    },
    deleteFromList: function (type, id) {
      // Get the index
      var index = list[type].findIndex(function (el) {
        return el.ID === +id;
      });

      // Use splice function to delete
      list[type].splice(index, 1);
    },
  };
})();

var UIController = (function () {
  // private
  var typeInput = document.querySelector(".add__type");
  var descInput = document.getElementsByClassName("add__description")[0];
  var valueInput = document.querySelector(".add__value");
  var totalIncomeElement = document.querySelector(".budget__income--value");
  var totlaExpencesElement = document.querySelector(".budget__expenses--value");
  var budgetElement = document.querySelector(".budget__value");
  var incomeListElement = document.querySelector(".income__list");
  var expenceListElement = document.querySelector(".expenses__list");
  var monthElement = document.querySelector(".budget__title--month");

  // public
  return {
    resetUI: function () {
      totalIncomeElement.textContent = 0;
      totlaExpencesElement.textContent = 0;
      budgetElement.textContent = 0;
      var date = new Date();
      var currentMonth = date.toString().split(" ")[1];
      monthElement.textContent = currentMonth;
    },
    getUserInputs: function () {
      //   return new UserInput(typeInput.value, descInput.value, valueInput.value);

      return {
        type: typeInput.value,
        desc: descInput.value,
        value: valueInput.value,
      };
    },
    updateTotal: function (totals) {
      totalIncomeElement.textContent = totals.inc.toLocaleString();
      totlaExpencesElement.textContent = totals.exp.toLocaleString();
    },
    updateBudget: function (budgate) {
      budgetElement.textContent = budgate.toLocaleString();
    },
    updateList: function (userInputs) {
      // {type: 'inc', desc: 'jjj', value: '88'}
      if (userInputs.type === "inc") {
        var html =
          '<div class="item clearfix" id="inc-' +
          userInputs.ID +
          '"><div class="item__description">' +
          userInputs.desc +
          '</div><div class="right clearfix"><div class="item__value">+ ' +
          (+userInputs.value).toLocaleString() +
          '</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        incomeListElement.insertAdjacentHTML("beforeend", html);
      } else {
        var html =
          '<div class="item clearfix" id="exp-' +
          userInputs.ID +
          '"><div class="item__description">' +
          userInputs.desc +
          '</div><div class="right clearfix"><div id="ex" class="item__value">- ' +
          (+userInputs.value).toLocaleString() +
          '</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        expenceListElement.insertAdjacentHTML("beforeend", html);
      }
    },
    resetInputs: function () {
      descInput.value = "";
      valueInput.value = "";
      descInput.focus();
    },
    deleteElement: function (elem) {
      elem.remove();
    },
  };
})();

var AppController = (function () {
  // Reset UI
  UIController.resetUI();

  function handleUserInput() {
    // Collect user inputs [UI]
    var inputs = UIController.getUserInputs();
    // Update total [Data]
    var totals = DataController.updateTotal(inputs);
    // Update total [UI]
    UIController.updateTotal(totals);
    // Update budgate [Data]
    var budgate = DataController.updateBudget();
    // Update budgate [UI]
    UIController.updateBudget(budgate);
    // Update List [Data]
    DataController.updateList(inputs);
    // Update List [UI]
    UIController.updateList(inputs);
    // Reset user inputs [UI]
    UIController.resetInputs();
  }

  function handleKeyboardPress(event) {
    if (event.key === "Enter") {
      handleUserInput();
    }
  }

  //   Add Event listener to Add Button
  document
    .querySelector(".add__btn")
    .addEventListener("click", handleUserInput);

  // Add Event listerner to Enter Button on keyboard
  document.addEventListener("keypress", handleKeyboardPress);

  //   Add Event Listener to delete
  document.querySelector("body").addEventListener("click", function (e) {
    if (e.target.classList.value === "ion-ios-close-outline") {
      var containerElement =
        e.target.parentElement.parentElement.parentElement.parentElement;
      var type = containerElement.id.split("-")[0];
      // console.log(type);
      var id = containerElement.id.split("-")[1];
      // Delete Element form list [Data]
      DataController.deleteFromList(type, id);
      // Delete Elemet form [UI]
      UIController.deleteElement(containerElement);

      // Update the totals
      var delNum = containerElement.textContent.split(" ")[1];
      var fInc = document.querySelector(".budget__income--value");
      var fExp = document.querySelector(".budget__expenses--value");
      var fBud = document.querySelector(".budget__value");
      // console.log(
      //   document.querySelector(".budget__expenses--value").textContent
      // );
      if (type === "inc") {
        fInc.textContent -= delNum;
      } else if (type === "exp") {
        fExp.textContent -= delNum;
      }
      // Update the budget
      fBud.textContent = +fInc.textContent - fExp.textContent;
    }
  });

  // public
  return {};
})();

// Falsy Values
// false "" 0 null undefined

// Slider with indicators
// Accordion with auto close
// Progress bar
// Comlete the budget app with delete and percentage features
