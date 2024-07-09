# slk

- [SLK](https://github.com/stijnherfst/HiveWE/wiki/SLK)
- [sylk4j](https://github.com/ruediste/sylk4j)
- [wc3libs](https://github.com/inwc3/wc3libs/tree/master)
- [sylk_parser](https://github.com/majerteam/sylk_parser/tree/master)

The SYLK format with the extension .slk defines an ASCII representation of a table. The format described hereafter is
not the complete SYLK format, but rather the subset of it used by Blizzard. The full SYLK specification can be
found [here](https://en.wikipedia.org/wiki/SYmbolic_LinK_(SYLK)), but includes things like formatting and styling which
aren't relevant to the Warcraft game data.

## Format

An SLK file is built out of records where there is always only one per line. Every record can have zero or more fields
of which some are mandatory and some aren't. There is no mandatory order in which field should appear within records.
Fields themselves are separated by a semicolon ";". Any line in the file that is not one of the following records should
be skipped.

	ID  

The ID record should always be the first line. The fields of the ID record can be safely ignored, but I shall explain
them nonetheless.

**Mandatory**

* P

The P field denotes the program that created the SLK file. Common values are MP (Multiplan) or XL (Excel).

**Optional**

* N or E

The N or E field denote the cell protection settings for the table. See the Wikipedia article for more information. This
field is irrelevant to Warcraft game data.

	B

This Record defined the size of the table. In the case of Blizzard game data files it seems to always appear before data
records, but doesn't necessarily have to which may complicate loading.

**Mandatory**

* X

The number of columns in the table.

* Y

The number of rows in the table

	C

Defines data for a cell.

**Mandatory**

* X

The column which this line applies to. This field is mandatory, but is sometimes missing in the Blizzard SLK files.

**Optional**

* Y

The row which this line applies to. If this field is not present then the row of the last occuring Y field should be
used.

* K

The data for the cell. If the data is enclosed in quotes "data" then the data is a string. Otherwise it is a floating
point number.

	E

The end of the file. Reading should stop immediately.
