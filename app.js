const express = require("express");
const https = require("https");
const app = express();


app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("home")
})

app.post("/", function(req, res) {
  let sol = req.body.sol;
  let camera = req.body.camera;
  let rover = req.body.rover;
  if (camera === "") {
  var urlpart2 = "&api_key=jMvNOabwRiB4PgJevnOz2RtTu8ljMGnwNnQV9KAl";

}else {

  var urlpart2 =  "&camera="+camera+"&api_key=jMvNOabwRiB4PgJevnOz2RtTu8ljMGnwNnQV9KAl";

}
let urlpart1 = "https://api.nasa.gov/mars-photos/api/v1/rovers/"+rover+"/photos?sol="+sol;

let fullurl = urlpart1 + urlpart2;
  https.get(fullurl, (response) => {
      let chunks = "";
    response.on("data", (chunk) => {
     chunks= chunks+chunk;
 });
  response.on("end",()=>{

    let marsphoto = JSON.parse(chunks);

   if (marsphoto.errors) {
     res.render("type-error")
   }else if (marsphoto.photos.length === 0) {
      res.render("failure")
     }else {

     res.render("image",{imgsource:marsphoto.photos});


   }
  })
});


});

app.get("/docs",function(req,res){
  let Abbreviation = ['FHAZ','RHAZ','MAST','CHEMCAM','MAHLI','MARDI','NAVCAM','PANCAM','MINITES'] ;
  let camera = ['Front Hazard Avoidance Camera','Rear Hazard Avoidance Camera','Mast Camera','Chemistry and Camera Complex','Mars Hand Lens Imager','Mars Descent Imager','Navigation Camera','Panoramic Camera','Miniature Thermal Emission Spectrometer (Mini-TES)'] ;
  let curiosity = ['yes','yes','yes','yes','yes','yes','yes','no','no'];
  let opportunity =['yes','yes','no','no','no','no','yes','yes','yes'];
  let spirit = ['yes','yes','no','no','no','no','yes','yes','yes'];
  let urlmanifest = "https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity/?api_key=jMvNOabwRiB4PgJevnOz2RtTu8ljMGnwNnQV9KAl"
  https.get(urlmanifest,(response)=>{
    let chunks = ""
    response.on("data",(chunk)=>{
      chunks = chunks+chunk;
    });

    response.on("end",()=>{
      let manifestsdata = JSON.parse(chunks);
      let maxsol = manifestsdata.photo_manifest.max_sol;
      res.render("docs",{Abbreviation:Abbreviation,camera:camera,curiosity:curiosity,opportunity:opportunity,spirit:spirit,maxsol:maxsol});
    })

  })

});

let Port = process.env.PORT;
if (Port == null|| Port == "")
Port = 3000;

app.listen(Port, function() {
  console.log("working");
});
