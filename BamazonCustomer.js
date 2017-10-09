console.log("test");

var inquirer = require("inquirer");
var mysql=require("mysql");
var connection= mysql.createConnection({
host: "localhost",
port: 3306,
user: "root",
password:"Wired410",
database:"Bamazon"
});

connection.connect(function(err){
	if(err){throw err;
		}
	
		console.log("connect as id " + connection.threadId);
});




function displayProducts(){
  connection.query("select*from products", function(err,results){
	if(err) {
		throw err
	};

	var test = choices(results);

	//console.log(choices(results));

	inquirer.prompt([{
		  name: "purchase",
		  type: "list",
		  message: "What would you like to purchase?",
		  choices: test
		},{
		  name: "qty",
		  type: "input",
		  message: "How Many Would You Like to Buy?",
	
		}]).then(function(answers) {

			checkQty(answers);
		console.log(answers)
	});
  });
}; 
displayProducts();

function choices(results){
	var strArr = [];

	for (var i = 0; i < results.length; i++) {
	 strArr.push(results[i].POSITION + ' ' + results[i].product);
	}

	return strArr;

}


function checkQty(answers){

	var prodName = answers.purchase.split(' ')[1];

connection.query("select * from products where product='" + prodName + "'", function(err,results) {
	console.log(results);
	if (Number(answers.qty) <= results[0].quantity){
		var diff = results[0].quantity - answers.qty;
		connection.query("UPDATE products set quantity = ? where product=?",[diff, prodName],function(err,results) {
			console.log(results);
		})
	}
})




}
