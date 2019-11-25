//Budget Controller

const budgetController = (

    function() {

        let Expense = function(id, description, value){
            this.id = id
            this.description = description
            this.value = value
        }

        let Income = function(id, description, value){
            this.id = id
            this.description = description
            this.value = value
        }

        let calculateTotal = function(type){

            let sum = 0;

            data.allItems[type].forEach(function(cur){

                sum += cur.value;

            });

            data.totals[type] = sum;

        };

        let data = {
            allItems: {
                exp: [],
                inc: []
            },
            totals: {
                exp: 0,
                inc: 0
            },
            budget: 0,
            percentage: -1
        }

        return {

            addItem: function(type, des, val) {
                let newItem, ID

                //Create new ID
                if(data.allItems[type].length > 0){
                    ID = data.allItems[type][data.allItems[type].length - 1].id + 1
                }
                else{
                    ID = 0
                }


                //Create new item based on whether or not it's inc or exp
                if(type === "exp"){
                    newItem = new Expense(ID, des, val)
                }
                else if(type === "inc"){
                    newItem = new Income(ID, des, val)

                }

                //push it into our data structure
                data.allItems[type].push(newItem)

                //return new element
                return newItem

            },


            /*Broke this the first time. Second Attempt*/
            calculateBudget: function() {

                //1 Calculate total income and expenses
                calculateTotal('exp');
                calculateTotal('inc');

                //2 alculate the budget: income - expenses
                data.budget = data.totals.inc - data.totals.exp;

                //3 calculate the percentage of income that we spent
                if (data.totals.inc > 0 ){
                    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                } else {
                    data.percentage = -1;
                };
                

            },


            //Broke this the first time. Second Attempt
            getBudget: function(){
                return {
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage
                };

            },


            testing: function(){
                console.log(data)
            }

        }
})()



//UI Controller

const UIController = (

    function() {


        let DOMstrings = {

            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputButton: '.add__btn',
            incomeContainer: '.income__list',
            expensesContainer: '.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expenseLabel: '.budget__expenses--value',
            percentageLabel: '.budget__expenses--percentage'

        }

        return {

            getInput: function(){

                return {

                    type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp. These are options in the selection group.
                    description: document.querySelector(DOMstrings.inputDescription).value, //Will be a string
                    value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //Will be an integer or float

                }
            },

            addListItem: function(obj, type){

                  let html, newHTML, element

                  //create an html string with placeholder text
                  if(type === 'inc'){
                    element = DOMstrings.incomeContainer

                    html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                  }

                  else if(type === 'exp'){
                      element = DOMstrings.expensesContainer

                      html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                  }

                
                 //replace placeholder text with actual data
                 newHTML = html.replace('%id%', obj.id)
                 newHTML = newHTML.replace('%description%', obj.description)
                 newHTML = newHTML.replace('%value%', obj.value)

                
                //insert the html into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHTML)
            },

            clearFields: function(){
                let fields, fieldsArr

                //not going to return an array.
                fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue)

                //use call method to pass the fields variable to convert it to an array
                fieldsArr = Array.prototype.slice.call(fields)

                //loop over fields and clear them
                fieldsArr.forEach(function(current, index, array){
                    current.value = ""

                })

                fieldsArr[0].focus()
            },

            displayBudget: function(obj){

                document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
                document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
                document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
                

                if (obj.percentage > 0){
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                } else {
                    document.querySelector(DOMstrings.percentageLabel).textContent = '---';
                }

            },

            getDomStrings: function(){
                return DOMstrings
            }

        }

})()



//Global App Controller. Sets up event listeners for the page and delegates tasks to the other controllers.

const globalController = (

    function(budgetCtrl, UICtrl){

        //set up event listener
        let setupEventListeners = function(){

                let DOM = UICtrl.getDomStrings()

                document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem)

                document.addEventListener('keypress', function(event){
                    if(event.keyCode === 13 || event.which === 13){
                        ctrlAddItem()
                    }
                })
        }


        //
        let updateBudget = function(){
            let budget

            //1. calculate the budget
            budgetController.calculateBudget();

            //2. return the budget
            budget = budgetController.getBudget();

            //3. display the budget on the UI
            UICtrl.displayBudget(budget);
            console.log(budget)
        };



        //takes input from user interface and creates new items under expense or income
        let ctrlAddItem = function(){
            
            let input, newItem

            //1. get the field input data
            input = UICtrl.getInput()

            if (input.description !== "" && !isNaN(input.value) && input.value > 0){
                //2. add the item to the budget controller
                newItem = budgetCtrl.addItem(input.type, input.description, input.value)

                //3. add the new item to the user interface
                UICtrl.addListItem(newItem, input.type)

                //4. clear the fields
                UICtrl.clearFields()
                
                //5. Calculate and update budget
                updateBudget();
             };
        };

        return {

            init: function(){
                console.log("Application has started.")
                UICtrl.displayBudget({
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
                });
                setupEventListeners()
            }
        }


})(budgetController, UIController)


globalController.init()