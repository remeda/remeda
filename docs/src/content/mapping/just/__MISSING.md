Just is built into individual packages for each util. This makes it easier to
know which functions people actually use and which aren't. Below is the list of
all functions as listed in the just docs, with a priority number in parenthesis
based on the number of monthly downloads based on: https://www.npmjs.com/search?page=0&q=keywords%3Ajust&sortBy=downloads_monthly&perPage=100. Use this number when deciding what parts of Just need a migration
guide or need to be implemented in Remeda. Utilities without a number have a
priority of 40+ and are not widely used.

# Collections

- clone (5)
- compare (8)
- diff (2)
- diff-apply (3)
- flush (23)
- pluck-it

# Objects

- deep-map-values (34)
- entries
- extend (1)
- filter-object
- flip-object
- has (38)
- is-circular
- is-empty (15)
- is-primitive
- map-keys (39)
- map-object
- map-values (17)
- merge (25)
- omit (14)
- pick (9)
- reduce-object (30)
- safe-get (13)
- safe-set (18)
- typeof (33)
- values

# Arrays

- cartesian-product
- compact
- flatten-it (36)
- group-by (20)
- index
- insert
- intersect (29)
- last
- order-by (35)
- partition
- permutations
- random
- range (16)
- remove (31)
- shuffle
- sort-by (32)
- split (19)
- split-at
- tail
- union (40)
- unique (11)
- zip-it (24)

# Statistics

- mean
- median
- mode
- percentile
- skewness
- standard-deviation
- variance

# Strings

- camel-case (7)
- capitalize (27)
- kebab-case (10)
- left-pad
- pascal-case (21)
- prune
- replace-all
- right-pad
- snake-case (22)
- squash
- template
- truncate

# Numbers

- clamp
- in-range
- is-prime
- modulo
- random-integer

# Functions

- compose (37)
- curry-it (4)
- debounce-it (6)
- demethodize
- flip
- memoize (26)
- memoize-last
- once (28)
- partial-it
- pipe
- throttle (12)
