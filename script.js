//function used to autocomplete
function auto() {
    $("#wrongmessage").css("visibility","hidden");
    $('#input').autocomplete({        
        source: function( request, response ) {
            $.ajax({
                url: "http://www-scf.usc.edu/~ziaoxu/HW8/index.php?input=" + $('#input').val(),                
                dataType: "json",
                data: {term: request.term},
                success: function(data) {
                    response($.map(data, function(item) {
                        return {
                            id: item.Symbol,
                            value: item.Name,
                            label: item.Symbol +  " - " + item.Name + " ( " + item.Exchange + " )"
                            };
                    }));
                }
            });
            return false;
        },
        minLength: 1,
        select: function(event, ui) {
                $('#input').val(ui.item.id);   
                return false;
        }
    })
}


$("#form").submit(function(){
    var symbol = $('#input').val();
    getquote(symbol);
    return false;
});
               

function quote() {
    var symbol = $('#input').val();
    getquote(symbol);
}

//function used to get information of user typed in and print out as an organized table
function getquote(input) {     
    $("#nextbutton").removeAttr("disabled");
    var symbol1 = input;

//    ***current stock information***
    $.ajax({
        type:"get",
        url: "http://www-scf.usc.edu/~ziaoxu/HW8/index.php?symbol=" + symbol1,                
        dataType: "json",
        jsonp: "jsoncallback",
        jsonpCallback:"success_jsonpCallback",
        success: function(json) {
            if(json.Status=="SUCCESS") {                
                $("#curName").text(json.Name);
                $("#curSymbol").text(json.Symbol);
                var curLast = "$ " + Math.round(json.LastPrice*100)/100;
                $("#curLast").text(curLast);
                if(json.Change>=0) {
                    var curChange = Math.round(json.Change*100)/100 + "(" + Math.round(json.ChangePercent*100)/100 + "%)  <img src='up.png'>";
                    $("#curChange").css("color","green");
                    $("#curChange").html(curChange);
                } else {
                    var curChange = Math.round(json.Change*100)/100 + "(" + Math.round(json.ChangePercent*100)/100 + "%)  <img src='down.png'>" ;        
                    $("#curChange").css("color","red");
                    $("#curChange").html(curChange);
                }            
                var curTime = moment(json.Timestamp).format("DD MMMM YYYY, hh:mm:ss a");
                $("#curTime").text(curTime);
                if(json.MarketCap/1000000000>1) {
                    var curMarket = Math.round(json.MarketCap/10000000)/100 + " Billion";
                } else if(json.MarketCap/1000000>1) {
                    var curMarket = Math.round(json.MarketCap/10000)/100 + " Million";
                } else {
                    var curMarket = Math.round(json.MarketCap/10)/100;
                }
                $("#curMarket").text(curMarket);
                $("#curVolume").text(json.Volume);
                if(json.ChangePercentYTD>=0) {
                    var curChangeYTD = Math.round(json.ChangeYTD*100)/100 + "(" + Math.round(json.ChangePercentYTD*100)/100 + "%)  <img src='up.png'>";
                    $("#curChangeYTD").css("color","green");
                    $("#curChangeYTD").html(curChangeYTD);
                } else {
                    var curChangeYTD = Math.round(json.ChangeYTD*100)/100 + "(" + Math.round(json.ChangePercentYTD*100)/100 + "%)  <img src='down.png'>" ;        
                    $("#curChangeYTD").css("color","red");
                    $("#curChangeYTD").html(curChangeYTD);
                }            
                var curHigh = "$ " + Math.round(json.High*100)/100;
                $("#curHigh").text(curHigh);
                var curLow = "$ " + Math.round(json.Low*100)/100;
                $("#curLow").text(curLow);
                var curOpening = "$ " + Math.round(json.Open*100)/100;
                $("#curOpening").text(curOpening); 
                var dailychart = "<img src='http://chart.finance.yahoo.com/t?s=" + json.Symbol + "&lang=en-US&width=600&height=450' width='90%'>"
                $("#dailychart").html(dailychart); //add daily chart
                
                
               
                //check local storage
                for(i=1; i<=Number(localStorage.clickcount); i++) {
                    $('#myCheckbox').prop('checked', false);
                    $("#star1").css("color","white");
                    if(localStorage.getItem(i)==json.Symbol) {
                        $('#myCheckbox').prop('checked', true);
                        $("#star1").css("color","yellow");     
                        i = Number(localStorage.clickcount)+1;
                    }
                }
                //    ***NEWS information***
                $.ajax({
                    type:"get",
                    url: "http://www-scf.usc.edu/~ziaoxu/HW8/index.php?news=" + symbol1, 
                    dataType: "json",
                    jsonp: "jsoncallback",
                    jsonpCallback:"success_jsonpCallback",
                    success: function(json) {                        
                        var output = "";
                        for(i=0; i<json.d.results.length; i++) {
                            output += "<div class='panel panel-default'style='background-color:whitesmoke;margin-left:2%;margin-right:2%'>";
                            output += "<div style='margin:2%'>";
                            output += "<a href='" 
                            output += json.d.results[i].Url;
                            output += "' target='_blank'>";
                            output += json.d.results[i].Title;
                            output += "</a><br>";
                            output += "<p  style='margin-top:1%'>";
                            output += json.d.results[i].Description;
                            output += "</p><br>";
                            output += "<p><b>Publisher: ";
                            output += json.d.results[i].Source;
                            output += "</b></p>";
                            output += "<p><b>Date: ";
                            var Date = moment(json.d.results[i].Date).format("DD MMM YYYY hh:mm:ss a");
                            output += Date;
                            output += "</b></p>";        
                            output += "</div>";                
                            output += "</div>";
                        }           
                        $("#news").html(output);
                    }
                });
                
//                high stock graph
                $(function(){
                    var sym =  symbol1;
                    var dur =  3650;
                    new Markit.InteractiveChartApi(sym, dur);
                });
                $("#myCarousel").carousel(1); //翻页
            } else {            
                $("#wrongmessage").css("visibility","visible");
            }
            return 0;
        }
    });   
}

$("#histab").click(function(){
    var sym =  $("#curSymbol").text();
    var dur =  3650;
    new Markit.InteractiveChartApi(sym, dur);
});


$("#clear").click(function(){
    document.getElementById("input").innerHTML="";
      document.getElementById("nextbutton").disabled=true;
      $("#myCarousel").carousel(0);
});

//function used to share stock information with facebook
function facebook() {
    var symbol = $("#curSymbol").text();
    $.ajax({
        type:"get",
        url: "http://www-scf.usc.edu/~ziaoxu/HW8/index.php?symbol=" + symbol,                
        dataType: "json",
        jsonp: "jsoncallback",
        jsonpCallback:"success_jsonpCallback",
        success: function(json) {
            if(json.Status=="SUCCESS") { 
                var last1 = "$" + Math.round(json.LastPrice*100)/100;
                var last = "$ " + Math.round(json.LastPrice*100)/100;
                FB.ui({
                    method: 'feed',
                    link: 'http://dev.markitondemand.com/MODApis/',
                    title: 'Current Stock Price of ' + json.Name + ' is ' + last1,
                    description: 'Stock Information of ' + json.Name + ' (' + json.Symbol + ')',
                    caption: 'LAST TRADE PRICE: ' + last +', CHANGE: ' + Math.round(json.Change*100)/100 + '(' + Math.round(json.ChangePercent*100)/100 + '%)' ,
                    picture: 'http://chart.finance.yahoo.com/t?s=' + json.Symbol + '&lang=en-US&width=200&height=150',
                }, function(response){
                    if(response) {
                        alert("Posted Successfully");
                    } else {
                        alert("Not Posted");
                    }
                });
            }
        }});    
}


//favoritr button
//localStorage.clear();
$("#favoriteStar").change(function () {
    
    if($("#myCheckbox").prop('checked')) {
        $("#star1").css("color","yellow");        
        addFavourite();                
        console.log(localStorage);
    } else {
        $("#star1").css("color","white");
        removeFavourite(document.getElementById("curSymbol").innerHTML);        
        console.log(localStorage);
    }
});


$("#autorefresh").change(function () {    
    if($("#autorefresh").prop('checked')) {
        autorefresh = setInterval(refresh,5000);
    } else {
        clearInterval(autorefresh); 
    }
});

//function used to add specific stock to user favourite list
function addFavourite() {    
    if (localStorage.clickcount) {
        localStorage.clickcount = Number(localStorage.clickcount) + 1;
    } else {
        localStorage.clickcount = 1;
    }
    var number = localStorage.clickcount;
    var symbol = document.getElementById("curSymbol").innerHTML;
    localStorage.setItem(number,symbol); 
    favoList();
}

//function used to remove specific stock to user favourite list
function removeFavourite(symbol) {
    for(i=1; i<=Number(localStorage.clickcount); i++) {        
        if(localStorage.getItem(i)==symbol){
            localStorage.removeItem(i);
        }            
    }
    favoList();
}

//function used to modify the information in favourite list
function favoList() {
    console.log(localStorage);
    var output1 = '<table class="table table-striped" style="width:98%;margin-left:1%"><tr><td style="width:10%"><strong>Symbol</strong></td><td style="width:20%"><strong>Company Name</strong></td><td style="width:20%"><strong>Stock Price</strong></td><td style="width:20%"><strong>Change (Change Percent)</strong></td><td style="width:20%"><strong>Market Cap</strong></td><td style="width:10%"></td></tr>';
    for(i=1; i<=Number(localStorage.clickcount); i++) {
        if(localStorage.getItem(i)!="") {
            output1 += "<tr id='";
            output1 += localStorage.getItem(i);
            output1 += "'>"
            $.ajax({
                type:"get",
                url: "http://www-scf.usc.edu/~ziaoxu/HW8/index.php?symbol=" + localStorage.getItem(i),
                dataType: "json",
                jsonp: "jsoncallback",
                jsonpCallback:"success_jsonpCallback",
                async:true,
                success: function(json) {
                    if(json.Status=="SUCCESS") {
                        var output = "<td><a style='cursor:pointer' data-target='#myCarousel' data-slide-to='1' onclick=getquote(\"";
                        output += json.Symbol;
                        output += "\")>";
                        output += json.Symbol;
                        output += "</a></td><td>";
                        output += json.Name;
                        output += "</td><td id='price";
                        output += json.Symbol;
                        output += "'>";
                        var Last = "$ " + Math.round(json.LastPrice*100)/100;                
                        output += Last;
                        output += "</td>";
                        if(json.Change>=0) {
                            var Change = Math.round(json.Change*100)/100 + "(" + Math.round(json.ChangePercent*100)/100 + "%)  <img src='up.png'>";
                            output += "<td style='color:green' id='change";
                            output += json.Symbol;
                            output += "'>";
                        } else {
                            var Change = Math.round(json.Change*100)/100 + "(" + Math.round(json.ChangePercent*100)/100 + "%)  <img src='down.png'>" ;
                            output += "<td style='color:red' id='change";
                            output += json.Symbol;
                            output += "'>";
                        }
                        output += Change;
                        output += "</td><td>";
                        if(json.MarketCap/1000000000>1) {
                            var Market = Math.round(json.MarketCap/10000000)/100 + " Billion";
                        } else if(json.MarketCap/1000000>1) {
                            var Market = Math.round(json.MarketCap/10000)/100 + " Million";
                        } else {
                            var Market = Math.round(json.MarketCap/10)/100;
                        }
                        $("#curMarket").html(curMarket);
                        output += Market;
                        output += "</td><td>";
                        output += "<button class='btn btn-default btn-sm' onclick='removeFavourite(\"";
                        output += json.Symbol;
                        output += "\")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button>";
                        output += "</td><td>";
                        output += "</td>";
                        $("#"+json.Symbol).html(output);
                    }
                }
            });            
        }        
    }
    output1 += "</table>";
    $("#favotable").html(output1);
}

//function used to refresh stock information in favourite list
function refresh() {
        for(i=1; i<=Number(localStorage.clickcount); i++) {
        if(localStorage.getItem(i)!="") {            
            $.ajax({
                type:"get",
                url: "http://www-scf.usc.edu/~ziaoxu/HW8/index.php?symbol=" + localStorage.getItem(i),
                dataType: "json",
                jsonp: "jsoncallback",
                jsonpCallback:"success_jsonpCallback",
                async:true,
                success: function(json) {
                    if(json.Status=="SUCCESS") {       
                        var Last = "$ " + Math.round(json.LastPrice*100)/100;
                        $("#price"+json.Symbol).html(Last);
                         if(json.Change>=0) {
                            var Change = Math.round(json.Change*100)/100 + "(" + Math.round(json.ChangePercent*100)/100 + "%)  <img src='up.png'>";                            
                        } else {
                            var Change = Math.round(json.Change*100)/100 + "(" + Math.round(json.ChangePercent*100)/100 + "%)  <img src='down.png'>" ;                            
                        }
                        $("#change"+json.Symbol).html(Change);
                        console.log(json.Symbol);
                    }
                }
            });            
        }        
    }
}