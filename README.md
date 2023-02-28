# Semantic web

## Steps to launch the project

1. Start the fuseki server, and load `output.ttl` with the database name **paris-shooting**. If you change the database name, update the constant at the beginning of `index.js`accordingly: ``http://127.0.0.1:3030/{database-name}/query`
2. Open `index.html` in any web browser. It has been tested on Firefox.

## About this project

This project aims to demonstrate how we can query multiple available ontologies using SPARQL.
Thus, we create our own ontology from a database of film shootings which took place in Paris, and linked it with various other ontologies such as Wikidata and OpenStreetMap.
