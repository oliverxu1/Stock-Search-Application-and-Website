<!Doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Stock Search</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="jquery.js"></script>
    <script src="jquery-ui/jquery-ui.min.js"></script>
    <link rel="stylesheet" href="jquery-ui/jquery-ui.min.css">
    <link rel="stylesheet" href="css/bootstrap.css" type="text/css">
    <script src="js/bootstrap.min.js"></script>
    <script src="js/moment.min.js"></script>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
    <script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
    <style type="text/css">
        body {
            background-color: #1f5577;
        }
    </style>    
</head>
	
<body>
<!--    Facebook SDK-->
    <script>
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '1556603868002431',
          xfbml      : true,
          version    : 'v2.5'
        });
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    </script>
    
<!--    Website Start Here-->
    <div class="panel panel-default">
        <div class="panel-body">
<!--            <table style="margin:auto,width:100%">-->
                <div style="text-align:center;margin:1%"><b>Stock Market Search</b></div>   
             
                <div class="col-sm-12 col-xs-12 col-md-4 col-lg-3" valign="top" padding-top="0" style="margin-top:1%;margin-bottom:1%"><small>Enter the stock name or symbol:<font color="red">*</font></small></div>
                    
<!--                    form-->
                <form id="form">
                    <div class="col-sm-6 col-xs-12 col-md-4 col-lg-6" style="text-align:center;margin-top:1%;margin-bottom:1%">
                        <input style="width:100%" id="input" onkeyup="auto()" type="text" name="input" value="<?php echo $_GET["input"];?>"  
                               placeholder="Apple Inc or AAPL" required x-moz-errormessage="Please enter name or symbol">
                    </div>
                    <div class="col-sm-6 col-xs-12 col-md-4 col-lg-3" style="margin-top:1%;margin-bottom:1%">
<!--                        data-target="#myCarousel" data-slide-to="1" -->
<!--                         id="submit" name="search" onclick="quote()"-->
                        <button class="btn btn-primary btn-sm" type="submit"><span class="glyphicon glyphicon-search" 
                            aria-hidden="true"></span> Get Quote</button>
<!--                        <button  id="search" type="submit" name="search" value="search"></button>-->
                        <button class="btn btn-default btn-sm" id="clear" type="reset" name="clear">
                                <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Clear</button>
                    </div>                    
                </form>
            
                <div class="col-md-4 col-sm-6 col-md-offset-4 col-lg-offset-3 col-lg-6  col-xs-12"><p id="wrongmessage" style="color:red;visibility:hidden">Select a valid entry</p></div>
            <div  class="col-sm-6 col-xs-12 col-md-4 col-lg-3" id="link">Powered By:
                    <a href="http://dev.markitondemand.com/MODApis/">
                        <img src="mod-logo.png" width="50%" height="60%"></a></div>
                   
        </div>
    </div>
    
    <hr style="height:1px;border:none;border-top:1px solid white;  margin-left: 10%;margin-right: 10%;" />
    
    <div class="panel panel-default">        
        <div  id="myCarousel" class="carousel slide" data-interval="false">
           <div class="carousel-inner">
<!--            first carousel-->
              <div class="item active" style="margin:1%;border:solid #e7e7e7 thin;border-radius: 4px">
                 <nav class="navbar navbar-default" style="background-color:whitesmoke;height:80%">
                     <div class="col-xs-5"><p class="navbar-text" style="color:black"><strong>Favorite List</strong></p></div>
                     
                     <button class="btn btn-default navbar-btn pull-right" style="backgroung-color:grey;margin-right:1%" id="nextbutton" disabled="disabled" data-toggle="tooltip" title="Next！" href="#myCarousel" data-slide="next">
                         <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>                    
                     <button class="btn btn-default navbar-btn pull-right" style="backgroung-color:grey;margin-right:1%" id="refresh" onclick="refresh()" data-toggle="tooltip" title="Refresh！">
                         <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></button>
                     <div  class="pull-right" style="margin-right:1%;margin-top:8px;margin-bottom:8px"><input id="autorefresh" type="checkbox" data-toggle="toggle" data-toggle="tooltip" title="Auto Refresh！"></div>                     <div class="hidden-xs not-visible pull-right" style="margin-top:15px;margin-bottom:8px">Automatic Refresh:  </div>
                 </nav>
                  
                <div id="favotable" class="table-responsive">
                  <table id="favotable1" class="table table-striped" style="width:98%;margin-left:1%">
                      <tr><td style="width:10%"><strong>Symbol</strong></td><td style="width:20%"><strong>Company Name</strong></td><td style="width:20%"><strong>Stock Price</strong></td><td style="width:20%"><strong>Change (Change Percent)</strong></td><td style="width:20%"><strong>Market Cap</strong></td><td style="width:10%"></td></tr>                      
                  </table>
                </div>
              </div>
               
<!--               second carousel-->
              <div class="item" style="margin:1%">
                 <nav class="navbar navbar-default" style="background-color:whitesmoke;height:80%">  
                     <div class="col-xs-2"><a href="#myCarousel" data-slide="prev">
                         <button class="btn btn-default navbar-btn pull-left" style="backgroung-color:grey;">
                             <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button></a></div>
                     <div class="col-xs-offset-5" ><p class="navbar-text" style="color:black"><strong>Stock Details</strong></p></div>
                 </nav>
                 <div style="margin:1%">
<!--                     nav tabs-->
                     <ul class="nav nav-pills" role="tablist">
                          <li role="presentation" class="active">
                              <a href="#current" aria-controls="current" role="tab" data-toggle="tab">
                                  <span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span> <span class="hidden-xs not-visible">Current</span> Stock</a></li>
                          <li role="presentation">
                              <a href="#historical" id="histab" aria-controls="historical" role="tab" data-toggle="tab">
                                <span class="glyphicon glyphicon-stats" aria-hidden="true"></span> <span class="hidden-xs not-visible">Historical</span> Charts</a></li>
                          <li role="presentation">
                              <a href="#news" aria-controls="news" role="tab" data-toggle="tab">
                                  <span class="glyphicon glyphicon-link" aria-hidden="true"></span> News <span class="hidden-xs not-visible">Feeds</span></a></li>
                     </ul>
                     
                     <hr style="height:1px;border:none;border-top:1px solid #e7e7e7;" />
<!--                     tabs-->
                     <div class="tab-content">
<!--                         current stock tab-->
                         <div role="tabpanel" class="tab-pane active" id="current">
                             <div class="col-xs-6 col-md-6"><p style="margin-left:1%;font-weight:bold">Stock Details</p></div>                             
<!--                                             two labels-->
                             <div class="col-xs-6 col-md-6" id="label" align="right" style="padding-right:5%">
                                 <table style="align:center;valign:middle"><tr>
                                     <td>
                                         <img class="pull-right" src="facebook.ico" height="50px" width="50px" onclick="facebook()"></td>
                                     <td> 
                                         <label class="pull-right well" for="myCheckbox" id="favoriteStar" style="cursor:pointer;padding:8px 10px;margin:0;border:0">
                                         <input type="checkbox" id="myCheckbox" style="display:none"/> 
                                         <span id="star1" class="glyphicon glyphicon-star" style="font-size:2em;color:white;text-shadow:0 0 black"></span> 
                                     </label>
                                     </td></tr></table>
                             </div>                             
                             <div name="leftside" class="col-md-6">                                         
                                 <table class="table table-striped">                                 
                                     <tr><td style="width:50%"><strong>Name</strong></td><td id="curName"></td></tr>
                                     <tr><td><strong>Symbol</strong></td><td id="curSymbol"></td></tr>
                                     <tr><td><strong>Last Price</strong></td><td id="curLast"></td></tr>
                                     <tr><td><strong>Change (Change Percent)</strong></td><td id="curChange"></td></tr>
                                     <tr><td><strong>Time and Date</strong></td><td id="curTime"></td></tr>
                                     <tr><td><strong>Market Cap</strong></td><td id="curMarket"></td></tr>
                                     <tr><td><strong>Volume</strong></td><td id="curVolume"></td></tr>
                                     <tr><td><strong>Change YTD (Change Percent YTD)</strong></td><td id="curChangeYTD"></td></tr>
                                     <tr><td><strong>High Price</strong></td><td id="curHigh"></td></tr>
                                     <tr><td><strong>Low Price</strong></td><td id="curLow"></td></tr>
                                     <tr><td><strong>Opening Price</strong></td><td id="curOpening"></td></tr>
                                 </table>
                             </div>
                              <div class="col-md-6" id="dailychart" style="text-align:center"></div>

                             
                             <table>
                                 <tr>
                                     <td style="width:50%">
                                         
                                     </td>
                                     <td style="width:50%">
                                         <div name="rightside">
                                         </div>
                                     </td>
                                 </tr>
                             </table>     
                         </div>
<!--                         historical tab-->
                         <div role="tabpanel" class="tab-pane" id="historical" style="text-align: center"><div id="chartDemoContainer" style="height:500px; min-width:80%; margin-bottom:30px; margin-left:5%; margin-right:5%"></div></div>
<!--                         news tab-->
                         <div role="tabpanel" class="tab-pane" id="news">News Feeds</div>
                     </div>
                 </div>
              </div>            
           </div>
        </div>
    </div>    
    
    <style>
        f{
           margin-bottom: 
        }
    </style>
   
    <?php               
        if(isset($_POST["input"])) {
            $input = $_POST["input"]; 
            header("Location: hw8.php?input={$input}");     
        }
    ?>
    
    <script src="script.js"></script>
</body>
