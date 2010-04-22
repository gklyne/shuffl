#!/bin/bash
#
# Driving eXist atompub protocol using command line curl.
#
# See: http://exist-db.org/atompub.html
#
# SLUG: works for non-Atom resources
#

DAVROOT=http://localhost/webdav

# --data-binary @- posts multiline from stdin

echo "===== CREATE FEED ====="
curl ${DAVROOT}/test/ --request MKCOL 

echo
echo "===== RETRIEVE FEED ====="
curl ${DAVROOT}/test/

echo
echo "===== ADD ITEM TO FEED ====="
curl ${DAVROOT}/test/TEST-ITEM-ZZZZZZ --request PUT --data-binary @- <<enddata
line1
line2
enddata

echo
echo "===== RETRIEVE ITEM ====="
curl ${DAVROOT}/test/TEST-ITEM-ZZZZZZ

echo
echo
echo "===== RETRIEVE FEED ====="
curl ${DAVROOT}/test/

echo
echo
echo "===== MODIFY FEED ITEM ${DAVROOT}${LOCATION} ====="
curl ${DAVROOT}/test/TEST-ITEM-ZZZZZZ --upload-file - -H "Content-Type: application/foo" <<enddata
foo1
foo2
enddata

echo
echo "===== RETRIEVE MODIFIED ITEM ====="
curl ${DAVROOT}/test/TEST-ITEM-ZZZZZZ

echo
echo "===== RETRIEVE FEED ====="
curl ${DAVROOT}/test/

echo
echo "===== ADD IMAGE TO FEED ====="
curl -v ${DAVROOT}/test/atom.jpg --upload-file atom.jpg -H "Content-Type: image/jpeg"

echo
echo
echo "===== RETRIEVE FEED WITH IMAGE ====="
curl ${DAVROOT}/test/

echo
echo
echo "===== RETRIEVE IMAGE ====="
curl ${DAVROOT}/test/atom.jpg >atom-retrieved.jpg

echo
echo "===== DELETE FEED ====="
curl ${DAVROOT}/test/ --request DELETE

echo
echo "===== RETRIEVE FEED ====="
curl ${DAVROOT}/test/ --head

echo
echo "===== DONE ====="

# End.
