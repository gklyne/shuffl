#!/bin/bash
#
# Make 6 shuffle card definitions from the template file
#

ROOTNAME=shuffl_sample_2_card_
TEMPLATE=${ROOTNAME}ZZZ.json

for i in 1 2 3 4 5 6; do
  cat $TEMPLATE | \
  sed \
    -e "s/ZZZ/$i/" \
    >${ROOTNAME}${i}.json
done

# End.
