import re


turtle = """:2577   rdf:type          :Shooting ;
        :hasEndDate       "2020-12-22"^^xsd:date ;
        :hasGeo           [ rdf:type   :Geo ;
                            :hasPoint  "48.828805798906224, 2.350837433819488" ;
                            :hasShape  "{\"coordinates\": [2.350837433819488, 48.828805798906224], \"type\": \"Point\"}"
                          ] ;
        :hasLocation      [ rdf:type        :Location ;
                            :hasAddress     "rue jonas, 75013 paris" ;
                            :hasCustomType  "2020-1109" ;
                            :hasPostalCode  "75013"^^xsd:int
                          ] ;
        :hasMovie         [ rdf:type      :Movie ;
                            :hasDirector  "Sylvie Verheyde" ;
                            :hasProducer  "ATELIER DE PRODUCTION" ;
                            :hasTitle     "STELLA EST AMOUREUSE"
                          ] ;
        :hasShootingType  "Long métrage" ;
        :hasStartDate     "2020-12-22"^^xsd:date ;
        :hasXCoordinate   "2.35083743"^^xsd:double ;
        :hasYCoordinate   "48.8288058"^^xsd:double ;
        :hasYear          "2020"^^xsd:int ."""


if __name__ == '__main__':
    data = [re.sub(r'\s+', '#', line) for line in turtle.split("\n")]
    print(data)

    classes_labels = []
    properties = []

    for i, line in enumerate(data):
        temp = re.findall(r':[A-Z][a-z]+', line)
        if len(temp) > 0:
            classes_labels += temp

        temp = re.findall(r':has[A-z]+', line)
        if len(temp) > 0:
            _range = re.findall(r'xsd:[A-z]+', line)
            _range = 'xsd:string' if len(_range) == 0 else _range[0]

            properties.append((classes_labels[-1], temp[0], _range))

    print(classes_labels)
    print(properties)

    output = ""
    for lab in classes_labels:
        output += lab + " a rdf:Class .\n"

    for dom, prop, ran in properties:
        output += prop + " a rdf:Property" + " .\n"
        output += prop + " :hasRange " + ran + " .\n"
        output += prop + " :hasDomain " + dom + " .\n"

    print(output)



