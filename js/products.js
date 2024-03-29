const ORDER_ASC_BY_COST = "Min-Max";
const ORDER_DESC_BY_COST = "Max-Min";
var currentSortCriteria = undefined;
const ORDER_BY_PROD_COUNT = "Cant.";
var minCost = undefined;
var maxCost = undefined;
var currentProductsArray = [];
var searchValue = undefined;

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_COST)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function showProductsList(){ 

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){ 
        let product = currentProductsArray[i];

        if((searchValue == undefined) || ((searchValue != undefined) && (product.name.toLowerCase().includes(searchValue)))){
            if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))){

            htmlContentToAppend += 
            `<div class="card  col-lg-4 col-sm-6 mt-4 "><a href="product-info.html" class="list-group-item-action">
            <img src="${product.imgSrc}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5><strong>${product.currency} ${product.cost}</strong>
              <p class="card-text mt-2">${product.description}</p>
              <p class="card-text"><small class="text-muted">${product.soldCount} artículos vendidos</small></p>
            </div></a>
            </div>`
        }
        }
        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    };

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenadas
    showProductsList();
};




document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){ 
        if (resultObj.status === "ok"){
            sortAndShowProducts(ORDER_ASC_BY_COST, resultObj.data);
        } 
    });

        document.getElementById("sortAsc").addEventListener("click", function(){
            sortAndShowProducts(ORDER_ASC_BY_COST);
        });

        document.getElementById("sortDesc").addEventListener("click", function(){
            sortAndShowProducts(ORDER_DESC_BY_COST);
        });
        document.getElementById("sortByCount").addEventListener("click", function(){
            sortAndShowProducts(ORDER_BY_PROD_COUNT);
        });
        document.getElementById("clearRangeFilter").addEventListener("click", function(){
            document.getElementById("rangeFilterCostMin").value = "";
            document.getElementById("rangeFilterCostMax").value = "";
            document.getElementById("search").value ="";

            minCost = undefined;
            maxCost = undefined;
            searchValue = undefined;

            showProductsList();
        });

        document.getElementById("rangeFilterCost").addEventListener("click", function(){
        
            minCost = document.getElementById("rangeFilterCostMin").value;
            maxCost = document.getElementById("rangeFilterCostMax").value;
    
            if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0){
                minCost = parseInt(minCost);
            }
            else{
                minCost = undefined;
            }
    
            if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0){
                maxCost = parseInt(maxCost);
            }
            else{
                maxCost = undefined;
            }
            
            showProductsList();
        });

        document.getElementById("search").addEventListener("keyup", function() {
            searchValue = document.getElementById("search").value.toLowerCase()
            if((searchValue != undefined) && (searchValue != "")) {
                showProductsList();
            }
            else{
                searchValue = undefined;
                showProductsList();
            }


        });


});