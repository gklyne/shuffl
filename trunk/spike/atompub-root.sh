#!/bin/bash
#
# Driving eXist atompub protocol using command line curl.
# See: http://exist-db.org/atompub.html
#
# Get information about root feed.

ATOMROOT=http://localhost:8080/exist/atom

echo
echo "===== CREATE FEED ====="
curl ${ATOMROOT}/edit/test --data-binary @- -H "Content-Type: application/atom+xml" <<endatomdata
<?xml version="1.0" ?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>TEST FEED</title>
</feed>
endatomdata


echo
echo "===== CREATE FEED ====="
curl ${ATOMROOT}/edit/test/nest --data-binary @- -H "Content-Type: application/atom+xml" <<endatomdata
<?xml version="1.0" ?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>NESTED TEST FEED</title>
</feed>
endatomdata

echo
echo "===== INTROSPECT ====="
curl ${ATOMROOT}/introspect/test/nest

echo
echo "===== RETRIEVE ====="
curl ${ATOMROOT}/content/test/nest

echo
echo "===== DELETE FEED ====="
curl ${ATOMROOT}/edit/test/nest --request DELETE

echo
echo "===== DELETE FEED ====="
curl ${ATOMROOT}/edit/test --request DELETE

echo
echo "===== DONE ====="
echo
echo
echo

# End.
