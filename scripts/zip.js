(function(module) {
  var zip = {};
  zip.arrayOfZips = [];
  zip.topFive;

  zip.getData = function() {
    $.getJSON('/data/manhattan.json', function(data) {
      // TODO: start here!
      data.features.forEach(function (obj) {
        zip.arrayOfZips.push({
          zip: obj.properties.zip,
          neighborhood: obj.properties.neighborhood,
          address: obj.properties.address || null,
          coordinates: {lat: obj.geometry.coordinates[1], lng: obj.geometry.coordinates[0]}
        });
      });
    });
  };

  zip.getUniqueNeighborhoods = function () {
    return zip.arrayOfZips.map(function (obj) {
      return obj.neighborhood;
    })
    .reduce(function (uniqueS, cur) {
      if (uniqueS.indexOf(cur) === -1 && cur !== '') {
        uniqueS.push(cur);
      }
      return uniqueS;
    }, []);
  };

  zip.getNeighborhoodZips = function () {
    return zip.getUniqueNeighborhoods().map(function(neighborhood){
      return {
        neighborhood: neighborhood,
        allZips: zip.arrayOfZips.reduce(function (init, cur) {
                    if (init.indexOf(cur.zip) === -1 && cur.neighborhood === neighborhood) {
                      init.push(cur.zip);
                    }
                    return init;
                    }, [])
      }
    })
    .sort(function (a, b) {
      if (a.allZips.length < b.allZips.length) {
        return 1;
      }
      if (a.allZips.length > b.allZips.length) {
        return -1;
      }
      return 0;
    });
  };

  zip.populateTopFive = function () {
    console.log('works');
    zip.topFive = zip.getNeighborhoodZips().reduce(function (init, cur, idx) {
      if (idx < 5) {
        init.push({neighborhood: cur.neighborhood, totalZips: cur.allZips.length});
      }
      return init;
    }, []);
  };

  zip.getData();

  module.zip = zip;
  zip.populateTopFive();
  zip.populateTopFive();
})(window);
