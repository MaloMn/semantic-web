var endpoint = "http://127.0.0.1:3030/paris-shooting/query";

function haversineDistance(coords1, coords2, coords3, coords4) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var lon1 = coords1;
    var lat1 = coords2;

    var lon2 = coords3;
    var lat2 = coords4;

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}

function buildPostalCodeChart(element_id) {
    let sparql = `
    PREFIX : <http://127.0.0.1:3333/>
    SELECT ?code (COUNT(?x) AS ?nb)  WHERE {
        ?x :hasLocation ?a .
        ?a :hasPostalCode ?code .
    } GROUP BY (?code) ORDER BY DESC (?nb)`;

    d3sparql.query(endpoint, sparql, (json) => {
        config = {
            "label_x": "Postal code",  // label for x-axis (optional; default is same as var_x)
            "label_y": "Number of shootings",        // label for y-axis (optional; default is same as var_y)
            "width": 850,           // canvas width (optional)
            "height": 300,           // canvas height (optional)
            "margin": 70,            // canvas margin (optional)
            "selector": element_id
        };
        d3sparql.barchart(json, config);
    });
}


function buildForceFieldsChart(element_id, building_name) {
    let sparql = `
    PREFIX : <http://127.0.0.1:3333/>
    PREFIX osmm: <https://www.openstreetmap.org/meta/> 
    PREFIX osmt: <https://wiki.openstreetmap.org/wiki/Key:> 

    SELECT $attraction $location ?name WHERE {
        SERVICE <https://sophox.org/sparql> {
            SELECT $attraction $location ?name WHERE {
                ?attraction osmt:tourism "attraction";
                            osmt:name ?name.
                FILTER CONTAINS(?name, "${building_name}")  
                ?attraction osmm:loc ?location .                    
            } LIMIT 1
        }
    }`;

    d3sparql.query(endpoint, sparql, (json) => {
        let position = json.results.bindings[0].location.value;
        let attraction = json.results.bindings[0].attraction.value;
        let attraction_name = json.results.bindings[0].name.value;

        let sparql = `
        PREFIX : <http://127.0.0.1:3333/>
        PREFIX osmm: <https://www.openstreetmap.org/meta/> 
        PREFIX osmt: <https://wiki.openstreetmap.org/wiki/Key:> 

        select ?attraction ?shooting ?attractionlabel ?shootinglabel ?attractionvalue ?shootingvalue where {
            
            BIND(<${attraction}> AS ?attraction)
            BIND("${position}" AS ?attractionvalue)
            BIND("${attraction_name}" AS ?attractionlabel)

            ?shooting :hasGeo ?geo .
            ?geo :hasPoint ?point .

            ?shooting :hasMovie ?movie .
            ?movie :hasTitle ?shootinglabel.
            BIND(CONCAT("Point(", REPLACE(?point, ",", ""), ")") AS ?shootingvalue)
        }`;

        console.log(sparql);

        d3sparql.query(endpoint, sparql, (json) => {
            config = {
                "radius": 12,        // static value or a function to calculate radius of nodes (optional)
                "charge": -250,      // force between nodes (optional; negative: repulsion, positive: attraction)
                "distance": 30,        // target distance between linked nodes (optional)
                "width": 1000,      // canvas width (optional)
                "height": 500,       // canvas height (optional)
                "label": "name",    // SPARQL variable name for node labels (optional)
                "selector": element_id,
                "maxDistance": 0.1,
                // options for d3sparql.graph() can be added here ...
            };
            d3sparql.forcegraph(json, config);
        });
    });
}

function displayMapWithCoordinates(target) {
    // Creating a map centered on Paris
    let map = L.map('map').setView([48.8534951, 2.3483915], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
    }).addTo(map);

    // Querying shootings positions
    let sparql = `
    PREFIX : <http://127.0.0.1:3333/>

    select distinct ?point where {
        ?shooting :hasGeo ?geo .
        ?geo :hasPoint ?point .
    }`;

    d3sparql.query(endpoint, sparql, (json) => {
        let data = json.results.bindings

        data.forEach((point) => {
            const regexp = /\d+\.\d+/g
            const array = [...(point.point.value).matchAll(regexp)];
            let marker = L.marker([array[0][0], array[1][0]]).addTo(map);
        })
    });
}


// TODO Uncomment below
//buildPostalCodeChart("#result");
buildForceFieldsChart('#forcefield', 'Tour Eiffel');
//displayMapWithCoordinates("#map");


