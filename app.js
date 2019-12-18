//Budget Controller

const budgetController = (

    function() {

        let Expense = function(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        };


        Expense.prototype.calcPercentage = function(totalIncome) {
            
            if (totalIncome > 0){

                this.percentage = Math.round((this.value / totalIncome) * 100);

            } else {
                this.percentage = -1;
            }
            

        };

        Expense.prototype.getPercentage = function(){
            return this.percentage
        }


        let Income = function(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
        };


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

            deleteItem: function(type, id){
                let ids, index;

                //loop over all elements in income or elements array. Map returns a new array
                ids = data.allItems[type].map(function(current){

                    return current.id;

                });

                index = ids.indexOf(id);

                if(index !== -1){

                    data.allItems[type].splice(index, 1);
                }

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

            calculatePercentages: function() {

                /* a=20
                   b=10
                   c=40
                   income = 100
                   a = 20/100 = 20%
                   b = 10/100 = 10%
                   c = 40/100 = 40%
                   */

                data.allItems.exp.forEach(function(cur){

                    cur.calcPercentage(data.totals.inc);

                });

            },

            getPercentages: function() {

                let allPerc = data.allItems.exp.map(function(cur){

                    return cur.getPercentage();

                })

                return allPerc;

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
            percentageLabel: '.budget__expenses--percentage',
            container: '.container',
            expensesPercentageLabel: '.item__percentage',
            dateLabel: '.budget__title--month'

        };

        let formatNumber = function(num, type){

                var numSplit, int, dec, type

                //+ or - before the number 
                // exactly two decimal points
                //comma separating the thousands place
                // 2310.4567 -> + 2,310.46

                num = Math.abs(num);

                num = num.toFixed(2);

                numSplit = num.split('.');

                int = numSplit[0];

                if (int.length > 3) {
					int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3);
				}; 

                dec = numSplit[1];

                type === 'exp' ? sign = '-' : sign = '+'

                return (type === 'exp' ? sign = '-' : '+') + ' ' + int + '.' + dec;

            };

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

                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                  }

                  else if(type === 'exp'){
                      element = DOMstrings.expensesContainer

                      html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                  }

                
                 //replace placeholder text with actual data
                 newHTML = html.replace('%id%', obj.id)
                 newHTML = newHTML.replace('%description%', obj.description)
                 newHTML = newHTML.replace('%value%', formatNumber(obj.value, type))

                
                //insert the html into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHTML)
            },

            //Delete the list item based on the itemID
            deleteListItem: function(selectorID){
                let element 

                element = document.getElementById(selectorID);

                element.parentNode.removeChild(element);

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

                obj.budget > 0 ? type = 'inc' : type = 'exp';

                document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
                document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
                document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
                

                if (obj.percentage > 0){
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                } else {
                    document.querySelector(DOMstrings.percentageLabel).textContent = '---';
                }

            },

            displayPercentages: function(percentages){

                let fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

                let nodeListForEach = function(list, callback) {

                    for (let i = 0; i < list.length; i++){

                        callback(list[i], i)
                    }

                };


                nodeListForEach(fields, function(current, index){

                    if(percentages[index] > 0){

                        current.textContent = percentages[index] + '%';
                    } else { current.textContent = '---';

                    }

                });

            },

            displayMonth: function(){

                var now, year, month, months;

                //When will then be now?
                now = new Date();

                year = now.getFullYear();

                month = now.getMonth();

                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

                document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

            },

            changeType: function(){

            	

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

                //event listener for the add item button
                document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

                //event listener for the enter key
                document.addEventListener('keypress', function(event){
                    if(event.keyCode === 13 || event.which === 13){
                        ctrlAddItem()
                    };
                });

                //event listener on the delete button
                document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
                document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
        };


        //
        let updateBudget = function(){
            let budget

            //1. calculate the budget
            budgetController.calculateBudget();

            //2. return the budget
            budget = budgetController.getBudget();
            //console.log(budget)

            //3. display the budget on the UI
            UICtrl.displayBudget(budget);
            
        };


        let updatePercentages = function(){

            //1. Calculate the percentages
            budgetCtrl.calculatePercentages();

            //2. Read percentages from the budget controller
            let percentages = budgetCtrl.getPercentages();

            //3. Update the user interface with the new percentages. 
            UICtrl.displayPercentages(percentages);

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

                //6. Calculate and update the percentages
                updatePercentages();
             };
        };


        //set up event delegation for the delete button(parent node of .container) 
        let ctrlDeleteItem = function(event){
            let itemID, splitID, type, ID; 
            
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

            if(itemID) {

                splitID = itemID.split('-');
                type = splitID[0];
                ID = parseInt(splitID[1]);

                //1. delete the item from the data structure
                budgetController.deleteItem(type, ID)

                //2. delete the item from the UI
                UICtrl.deleteListItem(itemID)

                //3. Update and show the new budget
                updateBudget();

                //4. Calculate and update percentages
                updatePercentages();

            }
        };

        return {

            init: function(){
                console.log("Application has started.")
                UICtrl.displayMonth()
                UICtrl.displayBudget({
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
                });
                setupEventListeners();
            }
        }


})(budgetController, UIController)


globalController.init()