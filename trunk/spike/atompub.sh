#!/bin/bash
#
# Driving eXist atompub protocol using command line curl.
#
# See: http://exist-db.org/atompub.html
#
# SLUG: works for non-Atom resources
#

ATOMROOT=http://localhost:8080/exist/atom

# --data-binary @- posts multiline from stdin

echo "===== CREATE FEED ====="
curl ${ATOMROOT}/edit/test --data-binary @- -H "Content-Type: application/atom+xml" <<endatomdata
<?xml version="1.0" ?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>TEST FEED</title>
</feed>
endatomdata

echo
echo "===== RETRIEVE FEED ====="
curl ${ATOMROOT}/content/test

echo
echo "===== MODIFY FEED ====="
curl ${ATOMROOT}/edit/test --upload-file - -H "Content-Type: application/atom+xml" <<endatomdata
<?xml version="1.0" ?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>MODIFIED TEST FEED</title>
</feed>
endatomdata

echo
echo "===== RETRIEVE FEED ====="
curl ${ATOMROOT}/content/test

echo
echo "===== ADD ITEM TO FEED ====="
curl ${ATOMROOT}/edit/test --data-binary @- -H "Content-Type: application/atom+xml" -H "Slug: TEST-ITEM-ZZZZZZ.ext" --dump-header itemheaders.tmp <<endatomdata
<?xml version="1.0" ?>
<entry xmlns="http://www.w3.org/2005/Atom">
<title>ITEM ADDED TO TEST FEED</title>
<id>TEST-ITEM-ZZZZZZ.ext</id>
<updated>20090709T18:30:02Z</updated>
<author><name>TEST ITEM AUTHOR NAME</name></author>
<content>TEST ITEM CONTENT</content>
</entry>
endatomdata

echo
echo "===== EXTRACT ITEM PATH ====="
LOCATION=`grep "Location:" itemheaders.tmp | sed -e 's/Location: //' -e 's/.$//'`
rm itemheaders.tmp
echo LOCATION=#$LOCATION#

echo
echo "===== RETRIEVE ITEM ====="
curl ${ATOMROOT}${LOCATION}

echo
echo
echo "===== RETRIEVE FEED ====="
curl ${ATOMROOT}/content/test

echo
echo
echo "===== MODIFY FEED ITEM ${ATOMROOT}${LOCATION} ====="
curl ${ATOMROOT}${LOCATION} --upload-file - -H "Content-Type: application/atom+xml" --dump-header - <<endatomdata
<?xml version="1.0" ?>
<entry xmlns="http://www.w3.org/2005/Atom">
<title>MODIFIED ITEM ADDED TO TEST FEED</title>
<id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>
<updated>20090709T18:30:02Z</updated>
<author><name>MODIFIED TEST ITEM AUTHOR NAME</name></author>
<content>MODIFIED TEST ITEM CONTENT</content>
</entry>
endatomdata

echo
echo "===== RETRIEVE FEED ====="
curl ${ATOMROOT}/content/test

echo
echo "===== ADD IMAGE TO FEED ====="
curl -v ${ATOMROOT}/edit/test --data-binary atom.jpg -H "Content-Type: image/jpeg" -H "SLUG: atom.jpg" --dump-header itemheaders.tmp

echo
echo "===== EXTRACT ITEM PATH ====="
LOCATION=`grep "Location:" itemheaders.tmp | sed -e 's/Location: //' -e 's/.$//'`
rm itemheaders.tmp
echo LOCATION=#$LOCATION#

echo
echo "===== RETRIEVE IMAGE ITEM ====="
curl ${ATOMROOT}${LOCATION}

echo
echo
echo "===== RETRIEVE FEED WITH IMAGE ====="
curl ${ATOMROOT}/content/test

echo
echo "===== DELETE FEED ====="
curl ${ATOMROOT}/edit/test --request DELETE

echo
echo "===== RETRIEVE FEED ====="
curl ${ATOMROOT}/content/test --head

echo
echo "===== DONE ====="

# End.
