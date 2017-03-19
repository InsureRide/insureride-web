var API = 'https://insureride.net/api/v1';
// var API = 'http://localhost:8080/v1';

var routes = [
               {
                   from: {name: "St. Gallen", long: 47.4241, lat: 9.3709},
                   to: {name: "Munich", long: 48.1448, lat: 11.558},
                   km: 227,
                   score: 6.9
               },
               {
                   from: {name: "Munich", long: 48.1448, lat: 11.558},
                   to: {name: "St. Gallen", long: 47.4241, lat: 9.3709},
                   km: 227,
                   score: 4.7
               },
               {
                   from: {name: "St. Gallen", long: 47.4241, lat: 9.3709},
                   to: {name: "St. Gallen", long: 47.4241, lat: 9.3709},
                   km: 1,
                   score: 6.2
               },
           ];

var drives = {};

function getScoreTag(score) {
    if(score > 8){
        return '<div class="ride-info-content" style="color: #27ae60"> Very Safe Drive </div>';
    }
    if(score > 5){
        return '<div class="ride-info-content" style="color: #2ecc71"> Safe Drive </div>';
    }
    if(score > 3){
        return '<div class="ride-info-content" style="color: #d35400"> Risky Drive </div>';
    }
    if(score > 0){
        return '<div class="ride-info-content" style="color: #c0392b"> Very Risky Drive </div>';
    }
}

function getTimeDiff(from, to){
    var now  = to;
    var then = from;

    return moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm");
}


$( document ).ready(function() {
    var car = {};

    function loadDrives(drives) {
        


        $.each(drives, function( index, drive ) {
                if(index < routes.length){
                    drive.route = routes[index]
                }else{
                    drive.route = routes[Math.floor(Math.random() * routes.length) ]
                }
            console.log(drive);

            // mock price calculation
            //var price = parseFloat(Math.round(drive.route.km * 0.1 * 100) / 100).toFixed(2);
           

            var drivetag = '<div class="col-md-3"> <div class="panel panel-default drive-panel"> <div class="drive-row"> <div class="route-from-section"> <div class="ride-infotitle"> From </div> <div class="ride-info-content"> '+drive.route.from.name+'</div> </div> <div class="route-to-section"> <div class="ride-infotitle"> To </div> <div class="ride-info-content"> '+drive.route.to.name+' </div> </div> <br style="clear: left;" /> </div> <div class="route-locations-section"> <div class="drive-row"> <div class="ride-infotitle"> Date </div> <div class="ride-info-content">'+moment.unix((drive.Starttime)).format('DD.MM.YYYY')+'</div> </div> <div class="drive-row"> <div class="ride-infotitle"> Driving Score </div> '+ getScoreTag(drive.route.score)+' </div> <div class="drive-row"> <div class="ride-infotitle"> Insurance Cost </div> <div class="ride-info-content"> CHF '+ drive.Price +' </div> </div> <div class="drive-moreinfo-wrapper"> <button type="button" class="btn btn-primary btn-md drive-details-btn" data-id="'+ index +'"> Details </button> </div> </div> </div> </div>';
            $('.journies').append(drivetag);

            if( index === 0 ) {
                $('.greetingaddition').text("Welcome back from " + drive.route.from.name);
            }
        });

        
    }

    function loadTransaction(drives) {
        $.each(drives, function( index, drive ) {
            $('#transactiontablebody').append("<tr><td>"+moment.unix(drive.Starttime).format('DD.MM.YYYY')+"</td><td>"+moment.unix(drive.Starttime).format('HH:mm')+"</td><td class='tablecontentright'>"+drive.Price+"</td></tr>");
        });

        $('.current-balance').text("CHF " + car.Balance);
    }

    function loadCarStatus(car) {
        
    }

    function showDriveDetail(driveId) {
        $("section").hide();

        $('.drivedetailstitle').text( car.Drives[driveId].route.from.name +' to '+ car.Drives[driveId].route.to.name +' on '+ moment.unix((car.Drives[driveId].Starttime)).format('DD.MM.YYYY'));

        $('#detailfromname').text(car.Drives[driveId].route.from.name);
        $('#detailtoname').text(car.Drives[driveId].route.to.name);
        $('#detaildate').text(moment.unix((car.Drives[driveId].Starttime)).format('DD.MM.YYYY'));
        $('#detailtoname').text(car.Drives[driveId].route.to.name);
            

        var scoreTitle = getScoreTag(car.Drives[driveId].route.score);
        $('#detailscore').append(scoreTitle);
        $('#detaildistance').text((Math.round(car.Drives[driveId].Kilometers * 100) / 100)+' km');

        var starttime = moment.unix((car.Drives[driveId].Starttime)).format('DD/MM/YYYY HH:mm:ss');
        var endtime = moment.unix((car.Drives[driveId].Endtime)).format('DD/MM/YYYY HH:mm:ss');
        console.log(starttime);
        console.log(getTimeDiff(starttime, endtime));

        $('#detailtime').text(getTimeDiff(starttime, endtime)+" h");
         $('#detailprice').text('CHF '+car.Drives[driveId].Price);
         $('#detailkmh').text(Math.round(car.Drives[driveId].Avgspeed * 100) / 100);

            

        $("section#drivedetails").show();


    }

    //Get Car info
    $.get( API + "/car/1", function( data ) {
      
      car = data;
      console.log(car);
      car.Drives = car.Drives.reverse();
      loadDrives(car.Drives);
      loadTransaction(car.Drives);

      loadCarStatus(car);

      // load account

    });


       // If drive detail button is clicked
    $(document.body).on('click', '.drive-details-btn' ,function(){
        var driveId = $(this).data("id");
        showDriveDetail(driveId);
        drawMap(car.Drives[driveId].route.from.name, car.Drives[driveId].route.to.name)
    });



    
});

function drawMap(from, to){
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        console.log(document.getElementById('map-canvas'));
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom:7,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        directionsDisplay.setMap(map);

        var request = {
            origin: String(from), 
            destination: String(to),
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }

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
    