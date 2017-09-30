<?php
//avoid cross-domain error
header("Access-Control-Allow-Origin: *"); 

//get symbols and names of stocks stating from the character typed in
//used to autocomplete
if(isset($_GET["input"])) {
    $input = $_GET["input"];
    $url = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input={$input}";
    $file = file_get_contents($url);
    echo $file;
} 

//get the detail stock information
if(isset($_GET["symbol"])) {
    $symbol = $_GET["symbol"];
    $url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol={$symbol}";
    $file = file_get_contents($url);
    echo $file;
}

//get the related news from Bing Search API
if(isset($_GET["news"])) {
    $news = $_GET["news"];
    $accountKey = 'iEz+1P8FpTUuiiPeIxKfV06UgWfLjTZhLBpfdZP0q30';
    $ServiceRootURL =  'https://api.datamarket.azure.com/Bing/Search/';
    $WebSearchURL = $ServiceRootURL . 'News?$format=json&Query=';    
    $context = stream_context_create(array(
        'http' => array(
            'request_fulluri' => true,
            'header'  => "Authorization: Basic " . base64_encode($accountKey . ":" . $accountKey)
        )
    ));
    $request = $WebSearchURL . urlencode( '\'' . $_GET["news"] . '\'');
    $file = file_get_contents($request, 0, $context);
    echo($file);    
}

?>