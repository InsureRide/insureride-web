var API = 'https://insureride.net/api/v1';
// var API = 'http://localhost:8080/v1';

var routes = [
                {
                    from: {name: "Zurich", long: 47.3673, lat: 47.3673},
                    to: {name: "Bern", long: 46.9479, lat: 7.4446},
                    km: 124,
                    score: 8.9

                },
                {
                    from: {name: "St. Gallen", long: 47.4241, lat: 9.3709},
                    to: {name: "Wil", long: 47.4635, lat: 9.0479},
                    km: 31,
                    score: 4.9
                },
                {
                    from: {name: "St. Gallen", long: 47.4241, lat: 9.3709},
                    to: {name: "Wil", long: 47.4635, lat: 9.0479},
                    km: 31,
                    score: 5.2
                },
                {
                    from: {name: "Borås", long: 57.721, lat: 9.3709},
                    to: {name: "Gothenburg", long: 57.7089, lat: 11.9746 },
                    km: 62,
                    score: 9.1
                },
            ];

function getScoreTag(score) {
    if(score > 8){
        return '<div class="ride-info-content" style="color: #27ae60"> Very Safe Drive </div>';
    }
    if(score > 5){
        return '<div class="ride-info-content" style="color: #a427ae"> Safe Drive </div>';
    }
    if(score > 3){
        return '<div class="ride-info-content" style="color: #a427ae"> Risky Drive </div>';
    }
    if(score > 0){
        return '<div class="ride-info-content" style="color: #ae2732"> Very Risky Drive </div>';
    }
}

$( document ).ready(function() {
    var car = {};

    function loadDrives(drives) {
        drives = drives.reverse();


        $.each(drives, function( index, drive ) {
                if(index < routes.length){
                    drive.route = routes[index]
                }else{
                    drive.route = routes[Math.floor(Math.random() * routes.length) ]
                }
            console.log(drive);

            // mock price calculation
            var price = parseFloat(Math.round(drive.route.km * 0.1 * 100) / 100).toFixed(2);
            

            var drivetag = '<div class="col-md-3"> <div class="panel panel-default drive-panel"> <div class="drive-row"> <div class="route-from-section"> <div class="ride-infotitle"> From </div> <div class="ride-info-content"> '+drive.route.from.name+'</div> </div> <div class="route-to-section"> <div class="ride-infotitle"> To </div> <div class="ride-info-content"> '+drive.route.to.name+' </div> </div> <br style="clear: left;" /> </div> <div class="route-locations-section"> <div class="drive-row"> <div class="ride-infotitle"> Date </div> <div class="ride-info-content">'+moment.unix((drive.Starttime)).format('MM.DD.YYYY')+'</div> </div> <div class="drive-row"> <div class="ride-infotitle"> Driving Score </div> '+ getScoreTag(drive.route.score)+' </div> <!-- <div class="drive-row"> <div class="route-from-section"> <div class="ride-infotitle"> Distance </div> <div class="ride-info-content"> '+drive.route.km+' km </div> </div> <div class="route-to-section"> <div class="ride-infotitle"> Time </div> <div class="ride-info-content"> 2h 33min </div> </div> <br style="clear: left;" /> </div> --> <div class="drive-row"> <div class="ride-infotitle"> Insurance Cost </div> <div class="ride-info-content"> CHF '+price+' </div> </div> <div class="drive-moreinfo-wrapper"> <button type="button" class="btn btn-primary btn-md drive-details-btn"> Details </button> </div> </div> </div> </div>';
            $('.journies').append(drivetag);

            if( index === 0 ) {
                $('.greetingaddition').text("Welcome back from " + drive.route.from.name);
            }
        });

        
    }

    function loadCarStatus(car) {
        
    }

    //Get Car info
    $.get( API + "/car/1", function( data ) {
      
      car = data;
      loadDrives(car.Drives);

      loadCarStatus(car);

    });


});

// Navigation
$( document ).ready(function() {
    // Hide all section
    $("section").hide();

    $("section#intro").show();

    $("a.page-scroll").on("click", function(){
        $("section").hide();
        $("section#"+ $(this).data('section')).show();
    });



});
    