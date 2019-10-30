var frameStore;
fetch("/20191029/frames.json")
.then(res => res.json())
.then((out) => {
  frameStore = out;
  interval = setInterval(frameAdvance, 100);
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
    // center: ol.proj.fromLonLat([-84.4999322, 42.734385]), zoom:14//Lansing
    // center: ol.proj.fromLonLat([-76.6177062, 39.2905249]), zoom:14//Baltimore
    // center: ol.proj.fromLonLat([-121.5590073, 38.5661003]), zoom:11//Sacramento
    // center: ol.proj.fromLonLat([-114.0703571, 51.0439946]), zoom:13//Calgary
    center: ol.proj.fromLonLat([172.629671, -43.5328028]), zoom:12//Christchurch
  })
});


var slider = document.getElementById("myRange");
var fps = document.getElementById("fps");
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

function frameAdvance(){
  ++slider.value;
  sliderUpdate();
}

// Update the current slider value (each time you drag the slider handle)
function sliderUpdate(){
  output.innerHTML = new Date(frameStore[slider.value][1]*1000);
  map.renderSync(); //redraw map, postrender hook will pull in the new data for the selected time
}
function fpsUpdate(){
  clearInterval(interval);
  interval = setInterval(frameAdvance, 1000/fps.value);
}
slider.oninput = function() {sliderUpdate();}
fps.oninput = function() {fpsUpdate();}