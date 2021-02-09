var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

const url = "https://www.canadapharmacy.com";

const sublinks = ['prescription', 'otc', 'pet'];

const letters = ['a', 'b', 'c'];

let lettersString = "";

for(let i = 0; i< letters.length; i++) {
    lettersString += letters[i];
    if(i < letters.length - 1) {
        lettersString += ", ";
    }
}

const line = "---------------------------------------------------------------------------------------";


fs.appendFileSync('canadapharmacy-medicines.txt', "All the products in " + url + " starting with " + lettersString + "\n\n");


for(let j =0; j<sublinks.length; j++){
    for(let i =0; i<letters.length; i++) {
        request(url + "/" + sublinks[j] + "/" + letters[i], function(error, response, body) {
            if(error){
                console.log("Error: " + error);
            }
            console.log("Status code: "+ response.statusCode);

            var $ = cheerio.load(body);

            var productsClassification = "Products in "+sublinks[j]+" starting with " + letters[i].toUpperCase();
            
            console.log("Products in "+sublinks[j]+" starting with " + letters[i].toUpperCase());
            fs.appendFileSync('canadapharmacy-medicines.txt', line + "\n\n" + productsClassification + '\n\n');
            $('div#search-results > ul > li').each(function(index){
                var productName = $(this).find('div.side-link > h2 > a').text().trim();
                //console.log("Product Name: " + productName);
                fs.appendFileSync('canadapharmacy-medicines.txt', productName + '\n');
            });
            
        })
    }
}
