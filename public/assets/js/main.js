// Licensed Materials - Property of IBM
//
// SAMPLE
//
// (c) Copyright IBM Corp. 2017 All Rights Reserved
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp

// This function changes the number of items to be bought in the item modal
function itemNumber(selection, id, inStock) {
  var current = parseInt(document.getElementById("number_" + id).innerHTML);

  if (selection == "up") {
    // User selects + button
    newValue = current + 1;
  } else if (selection == "down") {
    // User selects - button
    newValue = current - 1;
  }

  if (newValue <= 0){
    alert("Order Value must be greater than 0");
  } else if (newValue > inStock){
    alert("There is only" + inStock + " items in stock.")
  } else {
    // Update item number in modal if value is above 0 or below maximum stock number
    document.getElementById("number_" + id).innerHTML = newValue;
  }

}

// Calls list of all items in catalogue and dynamically renders item cards + item modals
function refreshItems(itemsLength,divToAppend) {
  //var fullURL = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
  $.ajax({
    type: 'GET',
    url: location.origin + "/catalogManager/items",
    dataType: 'json',
    success: function (allItemsJson) {
      console.log(allItemsJson);
      console.log("calling node!");

      for (i = 0; i < itemsLength; i++) {

        var item_ref = allItemsJson[i].ca_item_ref;
        var item_description = allItemsJson[i].ca_description;
        var item_cost = "£" + allItemsJson[i].ca_cost.substring(2);
        var item_stock = "In Stock: " + allItemsJson[i].in_stock;
        var item_maxnumber = allItemsJson[i].in_stock;

        // Some returned items are blank (item_ref=0). Don't attempt to make cards from these
        if (item_ref != 0) {

          /*Create item card for all items*/
          $('<div class="col-md-4 col-sm-4 col-xs-6"><div class="grid mask"><figure><img class="img-responsive" src="assets/img/portfolio/' + item_ref + '.png" alt=""><figcaption><h5>' + item_description.substring(0, 12) + '...</h5><a data-toggle="modal" href="#modal_' + item_ref + '" class="btn btn-primary btn-lg">Quick Buy</a></figcaption></figure></div></div>').appendTo('#'+divToAppend+'').fadeIn('slow');

          up = "up";
          down = "down";

          /*Create corresponding modal for each item*/
          $('<div class="modal fade" id="modal_' + item_ref + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
              <div class="modal-dialog">\
                <div class="modal-content">\
                  <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                    <h4 id="name_'+ item_ref + '" class="modal-title">' + item_description + '</h4>\
                  </div>\
                  <div class="modal-body" style="text-align:center">\
                    <p><img class="img-responsive" src="assets/img/portfolio/'+ item_ref + '.png" alt=""></p>\
                    <h2>Cost: <span id="modal_'+ item_ref + '_price">' + item_cost + '</span></h2>\
                    <p id="modal_'+ item_ref + '_stock">' + item_stock + '</p>\
                    <div class="btn-group center" role="group" aria-label="...">\
                      Number of items to buy:\
                    </div>\
                    <div>\
                      <button type="button" class="btn btn-default" onClick="itemNumber(down,'+ item_ref +','+item_maxnumber+ ')">-</button>\
                      <button type="button" id="number_'+ item_ref + '" class="btn btn-default noMouse">1</button>\
                      <button type="button" class="btn btn-default" onClick="itemNumber(up,'+ item_ref + ','+item_maxnumber+ ')">+</button>\
                    </div>\
                    <br>\
                    <button type="submit" class="btn btn-success" onClick="buyItem('+ item_ref + ')">Buy</button>\
                  </div>\
                  <div class="modal-footer">\
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                  </div>\
                </div>\
              </div>\
             </div>').appendTo('#'+divToAppend+'');
        }
      } // end for loop

    },
    error: function (e) {
      console.log(e.message);
    }
  });

}

function buyItem(id) {
  //get number of items requested from modal
  var numberOfItems = parseInt(document.getElementById("number_" + id).innerHTML);
  var nameOfItem = document.getElementById("name_" + id).innerHTML;
  //var fullURL = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

  var buyurl = location.origin + "/catalogManager/buy/00" + id + "/"+numberOfItems+"";
  console.log("BUY URL IS : " + buyurl);

  $.ajax({
    type: "POST",
    url: buyurl,
    contentType: 'application/json',
    success: function (r) {
      alert("Thank you for buying " + numberOfItems + " order(s) of " + nameOfItem + "!");

      /*If successful, refresh page*/
      window.location.reload()
    }, error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details0: " + desc + "\nError:" + err);
    }
  });
}

// Load all images from folder on page load for quicker item loading
window.onload = function () {

  setTimeout(function () {
    new Image().src = "assets/img/portfolio/10.png";
    new Image().src = "assets/img/portfolio/20.png";
    new Image().src = "assets/img/portfolio/30.png";
    new Image().src = "assets/img/portfolio/40.png";
    new Image().src = "assets/img/portfolio/50.png";
    new Image().src = "assets/img/portfolio/60.png";
    new Image().src = "assets/img/portfolio/70.png";
    new Image().src = "assets/img/portfolio/80.png";
    new Image().src = "assets/img/portfolio/90.png";
    new Image().src = "assets/img/portfolio/100.png";
    new Image().src = "assets/img/portfolio/110.png";
    new Image().src = "assets/img/portfolio/120.png";
    new Image().src = "assets/img/portfolio/130.png";
    new Image().src = "assets/img/portfolio/140.png";
    new Image().src = "assets/img/portfolio/150.png";
    new Image().src = "assets/img/portfolio/160.png";
    new Image().src = "assets/img/portfolio/170.png";
    new Image().src = "assets/img/portfolio/180.png";
    new Image().src = "assets/img/portfolio/190.png";
    new Image().src = "assets/img/portfolio/200.png";
    new Image().src = "assets/img/portfolio/210.png";
  }, 100);

// For the index page, load 3 random items into the "Best Sellers" and "Last chance" sections
// For the full catalogue page, load all items onto the page

if (location.pathname == "/fullcatalogue.html") {
  refreshItems(30,"product_div");
} else if (location.pathname == "/index.html" || location.pathname == "/") {
  refreshItems(3,"bestseller_div");
  refreshItems(6,"lastchance_div");
}

};
