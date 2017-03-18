

$( document ).ready(function() {
   
    var car = {};

    function loadDrives(drives) {

        for(var i = 0; i<drives.length(); i++){


        var drive = '<div class="col-md-3"> <div class="panel panel-default drive-panel"> <div class="drive-row"> <div class="route-from-section"> <div class="ride-infotitle"> From </div> <div class="ride-info-content"> St. Gallen </div> </div> <div class="route-to-section"> <div class="ride-infotitle"> To </div> <div class="ride-info-content"> Munich </div> </div> <br style="clear: left;" /> </div> <div class="route-locations-section"> <div class="drive-row"> <div class="ride-infotitle"> Date </div> <div class="ride-info-content" > 17.03.2017 </div> </div> <div class="drive-row"> <div class="ride-infotitle"> Driving Score </div> <div class="ride-info-content" style="color: #27ae60"> Very Safe Drive </div> </div> <!-- <div class="drive-row"> <div class="route-from-section"> <div class="ride-infotitle"> Distance </div> <div class="ride-info-content"> 233 km </div> </div> <div class="route-to-section"> <div class="ride-infotitle"> Time </div> <div class="ride-info-content"> 2h 33min </div> </div> <br style="clear: left;" /> </div> --> <div class="drive-row"> <div class="ride-infotitle"> Insurance Cost </div> <div class="ride-info-content"> CHF 9.15 </div> </div> <div class="drive-moreinfo-wrapper"> <button type="button" class="btn btn-primary btn-md drive-details-btn"> Details </button> </div> </div> </div> </div>'
        }

        $('.journeys').append('drive');
    }

    function loadCarStatus(car) {

    }

    //Get Car info
    $.get( "/car/1", function( data ) {
      
      car = data;

      loadDrives(car.drives);

      loadCarStatus(car);

    });


});