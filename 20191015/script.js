var frameStore;
fetch("/20191015/frames.json")
.then(res => res.json())
.then((out) => {
  frameStore = out;
  setInterval(function (){++slider.value;sliderUpdate();}, 100)
})
.catch(err => { throw err });


var ScooterChargeTask = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({color: '#77D018'}),
    // stroke: new ol.style.Stroke({color: 'white', width: 1})
  })
});

var VehicleRetrievalTask = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({color: '#FF585C'}),
    // stroke: new ol.style.Stroke({color: 'white', width: 1})
  })
});


var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    new ol.layer.Vector({
      source: new ol.source.Vector()
    })
  ],
  view: new ol.View({
    // center: ol.proj.fromLonLat([-84.4999322, 42.734385]), //Lansing
    center: ol.proj.fromLonLat([-76.6177062, 39.2905249]), //Baltimore
    zoom: 14
  })
});


var slider = document.getElementById("myRange");
var output = document.getElementById("output");

function addHook(){
  map.getLayers().array_[0].on("postrender", function(event){
    var vectorContext = ol.render.getVectorContext(event);
    var frame = frameStore[slider.value][0];
    
    for (var i = Object.values(frame).length - 1; i >= 0; i--) { //loop over task types
      var coordinates = [];
      //           V Starting at 1 is intentional; display color is at index 0
      for (var j = 1; j < Object.values(frame)[i].length; ++j) {
        var x = Object.values(frame)[i][j][0];
        var y = Object.values(frame)[i][j][1];
        coordinates.push(ol.proj.fromLonLat([y,x]));
      }
      vectorContext.setStyle(eval(Object.keys(frame)[i]));
      vectorContext.drawGeometry(new ol.geom.MultiPoint(coordinates));
    }
  });
}
setTimeout(addHook, 1000); //I am not a good JS programmer

// Update the current slider value (each time you drag the slider handle)
function sliderUpdate(){
  output.innerHTML = new Date(frameStore[slider.value][1]*1000);
  map.renderSync(); //redraw map, postrender hook will pull in the new data for the selected time
}
slider.oninput = function() {
  sliderUpdate();
}
