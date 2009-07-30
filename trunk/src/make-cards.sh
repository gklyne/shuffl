#!/bin/bash
#
# Make 6 shuffle card definitions from the template file
#

ROOTNAME=shuffl_sample_2_card_
TEMPLATE=${ROOTNAME}ZZZ.json
CLASSES=(white yellow blue green orange pink purple)
for i in 1 2 3 4 5 6; do
  echo "i $i, class ${CLASSES[i]}"
  cat $TEMPLATE | \
  sed \
    -e "s/ZZZ/$i/" \
    -e "s/YYYY/${CLASSES[i]}/" \
    >${ROOTNAME}${i}.json
done

# End.
