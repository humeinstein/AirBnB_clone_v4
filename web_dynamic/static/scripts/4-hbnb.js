$(document).ready(function () {
  console.log('#### SCRIPT LOADED ####');
  const dataDict = {};
  //* detects if amenities checkbox is changed
  $('.amenities input[type="checkbox"]').on('change', function () {
    if (this.checked) {
      console.log('#### Box checked! ####');
      console.log($(this).attr('data-name'));
      // add key/value to dict if id not already in it
      if (!($(this).attr('data-id') in dataDict)) {
        dataDict[$(this).attr('data-id')] = $(this).attr('data-name');
      }
    } else {
      console.log('#### Box UNchecked! ####');

      // remove key/value from dict if id is a duplicate
      delete dataDict[$(this).attr('data-id')];
      delete dataDict[$(this).attr('data-name')];
    }

    // appends dict values as stringified list to html
    $('.amenities').find('h4').text('');
    $('.amenities').find('h4').text(Object.values(dataDict).join(', '));
  });

  /*
    ####################################################
  */

  // requests api's status on port :5001, updates html
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
    console.log('#### API Status ####');
    if (data.status === 'OK') {
      console.log('API OK!!!!');
      $('#api_status').addClass('available');
    } else {
      console.log('API NOT OK :-(');
      $('#api_status').removeClass('available');
    }
  });

  /*
    ####################################################
  */

  /* POST request to api/v1/places_search/ endpoint
     initializes only when search button selected
  */
  function searchButton () {
    $('button').click(function () {
      console.log('button clicked');

      /* object passed in to ajax must be plain object
 and then stringified inside the settings;
 async set to false so query resolves prior to
 appending new HTML
*/
      const ajaxDict = {};
      if (Object.keys(dataDict).length > 0) {
        ajaxDict.amenities = Object.keys(dataDict);
      }
      console.log('#### ajaxDict ####');
      console.log(ajaxDict);

      const posting = $.ajax({
        async: false,
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        data: JSON.stringify(ajaxDict),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          console.log('#### POST Success! ####');
          console.log('#### Data ####');
          console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('Error, status = ' + textStatus + ', ' + 'error thrown: ' + errorThrown
          );
        }
      });

      // appending data from POST query to html page
      posting.done(function (data) {
        console.log('#### Peeling JSON onion ####');

        // page element where html will be appended
        const el = $('section.places');

        // empty it to start fresh every time
        el.empty();

        el.append('<h1>Places</h1>');

        $.each(data, function (i, place) {
          el.append(
            '<article>' +
              '<div class="title">' +
'<h2>' + place.name + '</h2>' +
              '<div class="price_by_night">' +
place.price_by_night +
              '</div>' +
              '</div>' +
              '<div class="information">' +
              '<div class="max_guest">' +
              '<i class="fa fa-users fa-3x" aria-hidden="true"></i>' +
              '<br />' +
              place.max_guest + ' Guests' +
              '</div>' +
              '<div class="number_rooms">' +
              '<i class="fa fa-bed fa-3x" aria-hidden="true"></i>' +
'<br />' +
              place.number_rooms + ' Bedrooms' +
              '</div>' +
              '<div class="number_bathrooms">' +
              '<i class="fa fa-bath fa-3x" aria-hidden="true"></i>' +
'<br />' +
              place.number_bathrooms + ' Bathrooms' +
              '</div>' +
              '</div>' +
              '<div class="description">' + '<br />' +
              place.description +
              '</div>' +
'</article>'
          );
        });
      });
    });
  }
  $(window).on('load', function () {
    searchButton();
    const ajaxDict = {};
    if (Object.keys(dataDict).length > 0) {
      ajaxDict.amenities = Object.keys(dataDict);
    }
    console.log('#### ajaxDict ####');
    console.log(ajaxDict);

    const posting = $.ajax({
      async: false,
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify(ajaxDict),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        console.log('#### POST Success! ####');
        console.log('#### Data ####');
        console.log(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('Error, status = ' + textStatus + ', ' + 'error thrown: ' + errorThrown
        );
      }
    });

    // appending data from POST query to html page
    posting.done(function (data) {
      console.log('#### Peeling JSON onion ####');

      // page element where html will be appended
      const el = $('section.places');

      // empty it to start fresh every time
      el.empty();

      el.append('<h1>Places</h1>');

      $.each(data, function (i, place) {
        el.append(
          '<article>' +
              '<div class="title">' +
'<h2>' + place.name + '</h2>' +
              '<div class="price_by_night">' + '$' + place.price_by_night +
              '</div>' +
              '</div>' +
              '<div class="information">' +
              '<div class="max_guest">' +
              '<i class="fa fa-users fa-3x" aria-hidden="true"></i>' +
              '<br />' +
              place.max_guest + ' Guests' +
              '</div>' +
              '<div class="number_rooms">' +
              '<i class="fa fa-bed fa-3x" aria-hidden="true"></i>' +
'<br />' +
              place.number_rooms + ' Bedrooms' +
              '</div>' +
              '<div class="number_bathrooms">' +
              '<i class="fa fa-bath fa-3x" aria-hidden="true"></i>' +
'<br />' +
              place.number_bathrooms + ' Bathrooms' +
              '</div>' +
              '</div>' +
              '<div class="description">' + '<br />' +
            place.description +
              '</div>' +
'</article>'
        );
      });
    });
  });
});
