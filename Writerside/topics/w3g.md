<show-structure for="chapter,procedure" depth="3"/>

# w3g

WarCraft III Replay action format description.

For more informtion about w3g file format, please visit [](http://w3g.deepnode.de).

## DISCLAIMER

All information in this document was solely obtained by looking at the replay
file and guessing the meaning of each single field. All knowledge about the
games mechanics is based on experience obtained by playing the game.
Neither reverse engineering was used nor any copyrighted files modified.
It is explicitly prohibited to use the information provided in this document
for any illegal activities including hacking, cheating and pirating.
Thank you Blizzard for your great games and a quite straight-forward
WarCraft III replay file format ;-)

The use of the information provided in this document is free of charge as long
as you follow the rules above. Furthermore you may copy it freely as long as
the file is unchanged (please mail us about any error or addition - we like
to keep things centralized).
We would really appreciate it if you credit us in your project or drop us
a line via mail - because we like to know if the work put into this document
was anything worth after all ;-)

## Another parsers

- [](https://github.com/PBug90/w3gjs)
- [](https://w3rep.sourceforge.net/)
- [](https://github.com/JSamir/wc3-replay-parser)

## Convention

WORD = 2byte = int16
DWORD = 4byte = int32
QWORD = 8byte = int64

## Header {id="Header"}

The replay file consist of a header followed by a variable number of compressed
data blocks. The header has the following format:

```C
Header {
  string[28] magick // 
}
```

| offset | size/type                                           | Description                                                 |
|--------|-----------------------------------------------------|-------------------------------------------------------------|
| 0x0000 | 28 chars                                            | zero terminated string `Warcraft III recorded game \0x1A\0` |
| 0x001c | 1 dword                                             | fileoffset of first compressed data block (header size)     |
|        | 0x40 for WarCraft III with patch <= v1.06           |                                                             |
|        | 0x44 for WarCraft III patch >= 1.07 and TFT replays |                                                             |
| 0x0020 | 1 dword                                             | overall size of compressed file                             |
| 0x0024 | 1 dword                                             | replay header version:                                      |
|        | 0x00 for WarCraft III with patch <= 1.06            |                                                             |
|        | 0x01 for WarCraft III patch >= 1.07 and TFT replays |                                                             |
| 0x0028 | 1 dword                                             | overall size of decompressed data (excluding header)        |
| 0x002c | 1 dword                                             | number of compressed data blocks in file                    |
| 0x0030 | n bytes                                             | SubHeader (see section 2.1 and 2.2)                         |

The size of the header excluding the subheader is `0x30` bytes so far.

### SubHeader for header version 0 {id="SubHeader0"}

This header was used for all replays saved with WarCraft III patch version `v1.06` and below.

| offset | size/type                                           | Description                                |
|--------|-----------------------------------------------------|--------------------------------------------|
| 0x0000 | 1 word                                              | unknown (always zero so far)               |
| 0x0002 | 1 word                                              | version number (corresponds to patch 1.xx) |
| 0x0004 | 1 word                                              | build number (see section 2.3)             |
| 0x0006 | 1 word                                              | flags                                      |
|        | 0x0000 for single player games                      |                                            |
|        | 0x8000 for multiplayer games (LAN or Battle.net)    |                                            |
| 0x0008 | 1 dword                                             | replay length in msec                      |
| 0x000C | 1 dword                                             | CRC32 checksum for the header              |
|        | (the checksum is calculated for the complete header |                                            |
|        | including this field which is set to zero)          |                                            |

Overall header size for version 0 is 0x40 bytes.

### SubHeader for header version 1 {id="SubHeader1"}

This header is used for all replays saved with WarCraft III patch version `v1.07` and above.

| offset | size/type                                                 | Description                                       |
|--------|-----------------------------------------------------------|---------------------------------------------------|
| 0x0000 | 1 dword                                                   | version identifier string reading:                |
|        | 'WAR3' for WarCraft III Classic                           |                                                   |
|        | 'W3XP' for WarCraft III Expansion Set 'The Frozen Throne' |                                                   |
|        | (note that this string is saved in little endian format   |                                                   |
|        | in the replay file)                                       |                                                   |
| 0x0004 | 1 dword                                                   | version number (corresponds to patch 1.xx so far) |
| 0x0008 | 1 word                                                    | build number (see section 2.3)                    |
| 0x000A | 1 word                                                    | flags                                             |
|        | 0x0000 for single player games                            |                                                   |
|        | 0x8000 for multiplayer games (LAN or Battle.net)          |                                                   |
| 0x000C | 1 dword                                                   | replay length in msec                             |
| 0x0010 | 1 dword                                                   | CRC32 checksum for the header                     |
|        | (the checksum is calculated for the complete header       |                                                   |
|        | including this field which is set to zero)                |                                                   |

Overall header size for version 1 is `0x44` bytes.

### Version information {id="Version"}

| game version | version in replay | version of war3.exe | release date |
|--------------|-------------------|---------------------|--------------|
| 1.00         | 1.00.4448         | 1.0. 0.4448         | 2002-07-03   |
| 1.01         | 1.01.4482         | 1.0. 1.4482         | 2002-07-05   |
| 1.01b        | 1.01.4482         | 1.0. 1.4483         | 2002-07-10   |
| 1.01c        | 1.01.4482         | ?                   | 2002-07-28   |
| 1.02         | 1.02.4531         | 1.0. 1.4531         | 2002-08-15   |
| 1.02a        | 1.02.4531         | 1.0. 1.4563         | 2002-09-06   |
| 1.03         | 1.03.4572         | 1.0. 3.4653         | 2002-10-09   |
| 1.04         | 1.04.4654         | 1.0. 3.4709         | 2002-11-04   |
| 1.04b        | 1.04.4654         | 1.0. 3.4709         | 2002-11-07   |
| 1.04c        | 1.04.4654         | 1.0. 4.4905         | 2003-01-30   |
| 1.05         | 1.05.4654         | 1.0. 5.4944         | 2003-01-30   |
| 1.06         | 1.06.4656         | 1.0. 6.5551         | 2003-06-03   |
| 1.07         | 1.07.6031         | 1.0. 7.5535         | 2003-07-01   |
| 1.10         | 1.10.6034         | 1.0.10.5610         | 2003-06-30   |
| 1.11         | 1.11.6035         | 1.0.11.5616         | 2003-07-15   |
| 1.12         | 1.12.6036         | 1.0.12.5636         | 2003-07-31   |
| 1.13         | 1.13.6037         | 1.0.13.5816         | 2003-12-16   |
| 1.13b        | 1.13.6037         | 1.0.13.5818         | 2003-12-19   |
| 1.14         | 1.14.6039         | 1.0.14.5840         | 2004-01-07   |
| 1.14b        | 1.14.6040         | 1.0.14.5846         | 2004-01-10   |
| 1.15         | 1.15.6043         | 1.0.15.5917         | 2004-04-14   |
| 1.16         | 1.16.6046         | 1.0.16.5926         | 2004-05-10   |
| 1.17         | 1.17.6050         | 1.0.17.5988         | 2004-09-20   |
| 1.18         | 1.18.6051         | 1.0.18.6030         | 2005-03-01   |
| 1.19         | 1.19.6052         | 1.0.19.6041         | 2005-09-19   |
| 1.19b        | 1.19.6052         | 1.0.19.6046         | 2005-09-21   |
| 1.20         | 1.20.6052         | 1.0.20.6048         | 2005-10-03   |
| 1.20b        | 1.20.6052         | 1.0.20.6056         | 2005-12-12   |
| 1.20c        | 1.20.6052         | 1.20.2.6065         | 2006-01-09   |
| 1.20d        | 1.20.6052         | 1.20.3.6070         | 2006-04-12   |
| 1.20e        | 1.20.6052         | 1.20.4.6074         | 2006-06-22   |
| 1.21         | 1.21.6052         | 1.21.0.6263         | 2007-01-23   |
| 1.21b        | 1.21.6052         | 1.21.1.6300         | 2008-02-06   |

Notes on specific patches:

- The mpq file for patch 1.02a is named 1.02c.
- Patch 1.04b was only available as standalone patch (not on bnet)
  and solely adds a new copy protection to war3.exe.
- The minor version number of the 'war3.exe' is wrong for patches
  1.02, 1.02a, 1.04, 1.04b.
- Blizzard released no standalone versions of the patches:
  1.01c, 1.04c, 1.10.
- Replays of patch 1.14 and 1.14b are incompatible

General notes:

- There are no differences in replays between minor versions
  (except for patch 1.14 and 1.14b).
- Check the file properties of the existing war3.exe to get the current
  installed version of Warcraft III (see column 3).
- There are no differences in version and build numbers between RoC and TFT.
- There are no differences between various language versions.
- You can identify the replay version of the installed game by extracting
  the 'product version number' from the version resource of the 'war3.exe'.
- You can identify the version of the 'war3.exe' by extracting the
  'file version number' from the version resource of the file.
- On early patches build number of replays and 'war3.exe' are equal.
  Later on they differ.

### Beta for Frozen Throne retail (version 1.07)

Beta replays are similar to RoC / final TFT replays.
Here comes a list of version numbers, header version and build numbers:

| version | subheader version | build | release date |
|---------|-------------------|-------|--------------|
| 301     | version 0         | 6010  | 2003-03-04   |
| 302     | version 0         | 6011  | 2003-03-11   |
| 303     | version 0         | 6012  | 2003-03-14   |
| 304     | version 0         | 6013  | 2003-03-19   |
| 304a    | version 0         | 6013  | 2003-03-24   |
| 305     | version 1(*)      | 6015  | 2003-03-28   |
| 305a    | version 1(*)      | 6016  | 2003-03-30   |
| 306     | version 1         | 6018  | 2003-04-08   |
| 307     | version 1         | 6019  | 2003-04-11   |
| 308     | version 1         | 6021  | 2003-04-16   |
| 309     | version 1         | 6022  | 2003-04-17   |
| 310     | version 1         | 6023  | 2003-04-24   |
| 311     | version 1         | 6027  | 2003-04-30   |
| 312     | version 1         | 6030  | 2003-05-13   |
| 313     | version 1         | 6031  | 2003-05-19   |
| 314     | version 1         | 6034  | 2003-05-30   |
| 314a    | version 1         | 6034  | 2003-06-02   |
| 315     | version 1         | 6034  | 2003-06-10   |

> Patch 305 and 305a still use the old V0 GameVersion scheme (2 words).

> 313 replays might be convertable to FT retail 1.07 replays.

> 315 replays might be convertable to FT retail 1.10/1.11 replays.

### Beta versions of various patches

These patches were only distributed through the 'Westfall' gateway.

| game version | version in replay | version of war3.exe | date of release | beta for   |
|--------------|-------------------|---------------------|-----------------|------------|
| 1.15         | 1. 15.6041        | 1.0.15.5900         | 2004-04-16      | patch 1.15 |
| 1.401        | 1.401.6042        | 401.0. 0.5911       | 2004-04-22      | patch 1.15 |
| 1.402        |                   |                     | 2004-04-24      | patch 1.15 |
| 1.403        |                   |                     | 2004-06-23      | Ladder XP  |
| 1.404        |                   |                     | 2004-08-14      | patch 1.17 |
| 1.405        |                   |                     | 2004-08-19      | patch 1.17 |
| 1.406        |                   |                     | 2004-08-31      | patch 1.17 |

## 3.0 Data block header {id="Data"}

Each compressed data block consists of a header followed by compressed data.
The first data block starts at the address denoted in the replay file header.
All following addresses are relative to the start of the data block header.
The decompressed data blocks append to a single continueous data stream
(disregarding the block headers). The content of this stream (see section 4) is
completely independent of the original block boundaries.

| offset | size/type | Description                                        |
|--------|-----------|----------------------------------------------------|
| 0x0000 | 1 word    | size n of compressed data block (excluding header) |
| 0x0002 | 1 word    | size of decompressed data block (currently 8k)     |
| 0x0004 | 1 dword   | unknown (probably checksum)                        |
| 0x0008 | n bytes   | compressed data (decompress using zlib)            |

To decompress one block with zlib:

- call `inflate_init`
- call `inflate` with `Z_SYNC_FLUSH` for the block

The last block is padded with `0` bytes up to the `8K` border. These bytes can
be disregarded.

> TODO: add decompression details and move explanation to seperate file

## 4.0 Decompressed data {id="Decompressed"}

Decompressed data is a collection of data items that appear back to back in
the stream. The offsets for these items vary depending on the size of every
single item.

This section describes the records that always appear at the beginning of
a replay data stream. They hold information about settings and players right
before the start of the game. Data about the game in progress is described
in section 5.

The order of the start up items is as follows:

| #  | Size                        | Name                                        |
|----|-----------------------------|---------------------------------------------|
| 1  | 4 byte                      | Unknown (0x00000110 - another record id?)   |
| 2  | variable                    | PlayerRecord (see 4.1)                      |
| 3  | variable                    | GameName (null terminated string) (see 4.2) |
| 4  | 1 byte                      | Nullbyte                                    |
| 5  | variable                    | Encoded String (null terminated) (see 4.3)  |
|    | - GameSettings (see 4.4)    |                                             |
|    | - Map&CreatorName (see 4.5) |                                             |
| 6  | 4 byte                      | PlayerCount (see 4.6)                       |
| 7  | 4 byte                      | GameType (see 4.7)                          |
| 8  | 4 byte                      | LanguageID (see 4.8)                        |
| 9  | variable                    | PlayerList (see 4.9)                        |
| 10 | variable                    | GameStartRecord (see 4.11)                  |

The following sections describe these items in detail.
After the static items (as described above) there follow variable information
organized in blocks that are described in section 5.

## 4.1 PlayerRecord {id="PlayerRecord"}

| offset | size/type                             | Description                         |
|--------|---------------------------------------|-------------------------------------|
| 0x0000 | 1 byte                                | RecordID:                           |
|        | 0x00 for game host                    |                                     |
|        | 0x16 for additional players (see 4.9) |                                     |
| 0x0001 | 1 byte                                | PlayerID                            |
| 0x0002 | n bytes                               | PlayerName (null terminated string) |
| n+2    | 1 byte                                | size of additional data:            |
|        | 0x01 = custom                         |                                     |
|        | 0x08 = ladder                         |                                     |

Depending on the game type one of these records follows:

- For custom games:

| offset | size/type | Description        |
|--------|-----------|--------------------|
| 0x0000 | 1 byte    | null byte (1 byte) |

- For ladder games:

| offset | size/type                                              | Description                                     |
|--------|--------------------------------------------------------|-------------------------------------------------|
| 0x0000 | 4 bytes                                                | runtime of players Warcraft.exe in milliseconds |
| 0x0004 | 4 bytes                                                | player race flags:                              |
|        | 0x01=human                                             |                                                 |
|        | 0x02=orc                                               |                                                 |
|        | 0x04=nightelf                                          |                                                 |
|        | 0x08=undead                                            |                                                 |
|        | (0x10=daemon)                                          |                                                 |
|        | 0x20=random                                            |                                                 |
|        | 0x40=race selectable/fixed (see notes in section 4.11) |                                                 |

## GameName {id="GameName"}

<!-- 4.2 -->

This is a plain null terminated string reading the name of the game.

Only in custom battle.net games you can name your game, otherwise the name
is fixed:

- For ladder games it reads "BNet".
- For custom LAN games it holds a localized string including the game creators
  player name.
  Examples: a game created by the player 'Blue' results in:
  "Blue's game" for the english version of Warcraft III
  "Spiel von Blue" for the german version
- For custom single player games it holds a localized fixed string.
  "local game" for the english version
  "Lokales Spiel" for the german version
- Following is a list for all localized strings (encoded in plain ASCII) used
  by WarCraft III patch version 1.06 and earlier
  (see war3.mpq\UI\FrameDef\GlobalStrings.fdf: GAMENAME, LOCAL_GAME):

|                 |                 |                  |
|-----------------|-----------------|------------------|
| English         | "%s's Game"     | "local game"     |
| Czech    (1029) | "Hra %s"        | "Místní hra"     |
| German   (1031) | "Spiel von %s"  | "Lokales Spiel"  |
| Spanish  (1034) | "Partida de %s" | "Partida local"  |
| French   (1036) | "Partie de %s"  | "Partie locale"  |
| Italian  (1040) | "Partita di %s" | "Partita locale" |
| Polish   (1045) | "Gra (%s)"      | "Gra lokalna"    |

`%s` denotes the game creators player name.

- The following list shows all localized strings (encoded in plain ASCII) used
  by WarCraft III patch version 1.07 and later
  (see war3.mpq\UI\FrameDef\GlobalStrings.fdf: GAMENAME, LOCAL_GAME):

German   (1031): "Lokales Spiel (%s)"  : "Lokales Spiel"

`%s` denotes the game creators player name.

## 4.3 EncodedString {id="EncodedString"}

There are the GameSetting and three null-terminated strings here back-to-back,
all encoded into a single null terminated string.
(But we don't know the reason for this encoding!)

Every even byte-value was incremented by 1. So all encoded bytes are odd.
A control-byte stores the transformations for the next 7 bytes.

Since all NullBytes were transformed to 1, they will never occure inside the
encoded string. But a NullByte marks the end of the encoded string.

The encoded string starts with a control byte.
The control byte holds a bitfield with one bit for each byte of the next 7
bytes block. Bit 1 (not Bit 0) corresponds to the following byte right after
the control-byte, bit 2 to the next, and so on.
Only Bit 1-7 contribute to encoded string. Bit 0 is unused and always set.

Decoding these bytes works as follows:

If the corresponding bit is a `1` then the character is moved over directly.
If the corresponding bit is a `0` then subtract 1 from the character.

After a control-byte and the belonging 7 bytes follows a new control-byte
until you find a NULL character in the stream.

Example decompression code (in 'C'):

```C
char* EncodedString;
char* DecodedString;
char mask;
int pos=0;
int dpos=0;

while (EncodedString[pos] != 0)
{
if (pos%8 == 0) mask=EncodedString[pos];
else
{
if ((mask & (0x1 << (pos%8))) == 0)
DecodedString[dpos++] = EncodedString[pos] - 1;
else
DecodedString[dpos++] = EncodedString[pos];
}
pos++;
}
```

Alternatively one could interprete the encoding scheme as follow:
Bit 0 of every character was moved to the control byte and set to 1 afterwards.

> TODO: Maybe this gives a simpler decoding algorithm.

## 4.4 GameSettings {id="GameSettings"}

Make sure you have decoded the GameSettings (see 4.3).

The game settings (extended options on create game screen) are packed using
various flags distributed over 13 bytes.
For details about the single options read the file
"support/Readme/(PC)UIMainMenus.html"
in your WarCraft III installation directory.

Denoted below are only nonzero flags.

| offset | bitnr                                                         | Description                                            |
|--------|---------------------------------------------------------------|--------------------------------------------------------|
| 0x0000 | 0,1                                                           | Game Speed: 0 = slow, 1 = normal, 2 = fast, 3 = unused |
| 0x0001 | 0                                                             | Visibility: 'hide terrain'                             |
| 1      | Visibility: 'map explored'                                    |                                                        |
| 2      | Visibility: 'always visible' (no fog of war)                  |                                                        |
| 3      | Visibility: 'default'                                         |                                                        |
| 4,5    | Observer  : 0 = off or 'Referees' (see 0x0003 Bit6)           |                                                        |
|        | 1 = unused                                                    |                                                        |
|        | 2 = 'Obs on Defeat'                                           |                                                        |
|        | 3 = on or 'Referees'                                          |                                                        |
| 6      | Teams Together (team members are placed at neighbored places) |                                                        |
| 0x0002 | 1,2                                                           | Fixed teams: 0 = off, 1 = unused, 2 = unused, 3 = on   |
| 0x0003 | 0                                                             | Full Shared Unit Control                               |
| 1      | Random Hero                                                   |                                                        |
| 2      | Random Races                                                  |                                                        |
| 6      | Observer: Referees (other observer bits are 0 or 3)           |                                                        |
| 0x0004 |                                                               | 0                                                      |
| 0x0005 |                                                               | unknown (0 in ladder games, but not in custom)         |
| 0x0006 |                                                               | 0                                                      |
| 0x0007 |                                                               | unknown (0 in ladder games, but not in custom)         |
| 0x0008 |                                                               | 0                                                      |
| 0x0009 | 4Byte                                                         | Map Checksum //TODO: find algorithm                    |
| - 0C   |                                                               |                                                        |

## 4.5 MapCreatorName {id="MapCreatorName"}

Make sure you have decoded the three Strings (see 4.3).

First is the map name, second is the game creators name (can be "Battle.Net"
for ladder) and a third is an always empty string.

Here ends the encoded string. There should not be any unprocessed decoded
bytes left.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
4.6 [PlayerCount]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

4 bytes - num players or num slots
in Bnet games is the exact ## of players
in Custom games, is the ## of slots on the join game screen
in Single Player custom games is 12


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
4.7 [GameType]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

offset | size/type | Description
-------+-----------+-----------------------------------------------------------
0x0000 | 1 byte | Game Type:
| | (0x00 = unknown, just in a few pre 1.03 custom games)
| | 0x01 = Ladder -> 1on1 or FFA
Custom -> Scenario  (not 100% sure about this)
| | 0x09 = Custom game
| | 0x1D = Single player game
| | 0x20 = Ladder Team game (AT or RT, 2on2/3on3/4on4)
0x0001 | 1 byte | PrivateFlag for custom games:
| | 0x00 - if it is a public LAN/Battle.net game
| | 0x08 - if it is a private Battle.net game
0x0002 | 1 word | unknown (always 0x0000 so far)

TODO:
values in patch `>=1.07`:

```
01 00 00 00 : ladder 1on1 / custom scenario
20 00 00 00 : ladder team
09 00 00 00 : custom game
09 A8 12 00 : custom game
09 A0 12 00 : custom game
09 A8 42 00 : custom game
09 A8 14 00 : custom game
09 A0 14 00 : custom game
01 40 13 00 : custom game
09 A0 42 00 : custom game
09 A8 44 00 : custon game
```

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
4.8 [LanguageID]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
4 byte - (independent of realm, map, gametype !)
Might be another checksum or encoded language.
I found the following numbers in my replays:

C4 F0 12 00 - patch 1.10 ger
90 F1 12 00 - patch 1.06 ger
90 F1 12 00 - patch 1.05 ger
A0 F6 6D 00 - patch 1.04 ger
24 F8 12 00 - patch 1.04 eng(?)
A0 F6 6D 00 - patch 1.03 ger
C0 F6 6D 00 - patch 1.02 ger

//TODO: Find out what this field is really about.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
4.9 [PlayerList]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

The player list is an array of PlayerRecords for all additional players
(excluding the game host and any computer players).
If there is only one human player in the game it is not present at all!
Per additional player there is the following structure in the file:

offset | size/type | Description
-------+-----------+-----------------------------------------------------------
0x0000 | 4/11 byte | PlayerRecord (see 4.1)
0x000? | 4 byte | unknown
| |  (always 0x00000000 for patch version >= 1.07
| | always 0x00000001 for patch version <= 1.06)

This record is repeated as long as the first byte equals the additional
player record ID (0x16).


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
4.10 [GameStartRecord]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

offset | size/type | Description
-------+-----------+-----------------------------------------------------------
0x0000 | 1 byte | RecordID - always 0x19
0x0001 | 1 word | number of data bytes following
0x0003 | 1 byte | nr of SlotRecords following (== nr of slots on startscreen)
0x0004 | n bytes | nr * SlotRecord (see 4.11)
n+4 | 1 dword | RandomSeed (see 4.12)
n+8 | 1 byte | SelectMode
| | 0x00 - team & race selectable (for standard custom games)
| | 0x01 - team not selectable
| |          (map setting: fixed alliances in WorldEditor)
| | 0x03 - team & race not selectable
| |          (map setting: fixed player properties in WorldEditor)
| | 0x04 - race fixed to random
| |          (extended map options: random races selected)
| | 0xcc - Automated Match Making (ladder)
n+9 | 1 byte | StartSpotCount (nr. of start positions in map)


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
4.11 [SlotRecord]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

offset | size/type | Description
-------+-----------+-----------------------------------------------------------
0x0000 | 1 byte | player id (0x00 for computer players)
0x0001 | 1 byte | map download percent: 0x64 in custom, 0xff in ladder
0x0002 | 1 byte | slotstatus:
| | 0x00 empty slot
| | 0x01 closed slot
| | 0x02 used slot
0x0003 | 1 byte | computer player flag:
| | 0x00 for human player
| | 0x01 for computer player
0x0004 | 1 byte | team number:0 - 11
| | (team 12 == observer or referee)
0x0005 | 1 byte | color (0-11):
| | value+1 matches player colors in world editor:
| |   (red, blue, cyan, purple, yellow, orange, green,
| | pink, gray, light blue, dark green, brown)
| | color 12 == observer or referee
0x0006 | 1 byte | player race flags (as selected on map screen):
| | 0x01=human
| | 0x02=orc
| | 0x04=nightelf
| | 0x08=undead
| | 0x20=random
| | 0x40=race selectable/fixed (see notes below)
0x0007 | 1 byte | computer AI strength: (only present in v1.03 or higher)
| | 0x00 for easy
| | 0x01 for normal
| | 0x02 for insane
| | for non-AI players this seems to be always 0x01
0x0008 | 1 byte | player handicap in percent (as displayed on startscreen)
| | valid values: 0x32, 0x3C, 0x46, 0x50, 0x5A, 0x64
| | (field only present in v1.07 or higher)

Notes:
o This record is only 7 bytes in pre 1.03 replays.
The last two fields are missing there.

o For pre v1.07 replays this record is only 8 bytes.
The last field is missing there.

o For open and closed slots team and color fields are undetermined.

o For WarCraft III patch version <= 1.06:
If bit 6 of player race flags is additionally set (0x40 added) then the
race is fixed by the map (see also section 4.10).

o For WarCraft III patch version >= 1.07:
If bit 6 of player race flags is additionally set (0x40 added) then the
race is selectable by the player - otherwise it is a ladder game or the
race is fixed by the map (see also section 4.10).


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
4.12 [RandomSeed]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
This field is the best bet on the random seed the Warcraft III engine is
initialized with. The replay data that follows requires already a set up seed
(since starting positions and race are fixed at this time).

For custom games (no matter if battle.net or LAN) this dword appears to be
the runtime of the Warcraft.exe of the game host in milliseconds.

For ladder games the value variies very much - probably the battle.net server
hands out a 'real' seed (not runtime based) to the clients.

## 5.0 ReplayData {id="ReplayData"}

This section describes the Replay data following directly after the static data
described in section 4. It represents information about the game in progress.

Replay data is segmented into seperate blocks of either fixed or variable size.
The order of these blocks is not fixed and not all known blocktypes have to be
present in a replay.

Blocks always start with one byte representing the block ID. Using this ID one
can identify specific blocks while skipping unwanted (using the block size).
Below all known blocks are listed by their block ID followed by a description
of the data following the ID. Denoted in square brackets is the overall size
of each block (including the one byte block ID).

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x17 - LeaveGame                                                   [ 14 byte ]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - reason
0x01 - connection closed by remote game
0x0C - connection closed by local game
0x0E - unknown (rare) (almost like 0x01)
1 byte - PlayerID
1 dword - result - see table below
1 dword - unknown (number of replays saved this warcraft session?)

Key for Table:
player = player according to PlayerID
saver = replay saver ( = player of very last leave-action)
INC = the unknown parameter in the last leave-action was incremented by 1
(compared to the other LeaveGame actions before)
[?]    = entries marked with this symbol are true for common replays but
we encountered at least one nonconform replay.
[O]    = if the replay saver was an observer it regularly happens that
players get a result of 0x01

Reason | Result | Description
===========+========+=======================================================
0x01 | 0x01 | player left (disconnected or saver is observer)    [O]
(remote)  | 0x07 | player left
| 0x08 | player lost (was completly erased)
| 0x09 | player won
| 0x0A | draw (long lasting tournament game)
| 0x0B | player left (was observer)                         [?]
-----------+--------+-------------------------------------------------------
0x0E | 0x01 | player left                                        [?]
(remote)  | 0x07 | player left                                        [?]
| 0x0B | player left (was observer)                         [?]
===========+========+=======================================================
0x0C | 0x01 | saver disc. / observer left                        [O]
(not last)| 0x07 | saver lost, no info about the player               [?]
| 0x08 | saver lost (erased), no info about the player
| 0x09 | saver won, no info about the player
| 0x0A | draw (long lasting tournament game)
| 0x0B | saver lost (obs or obs on defeat)                  [?]
-----------+--------+-------------------------------------------------------
last 0x0C | 0x01 | saver disconnected
(rep.saver)| 0x07 | with INC => saver won
| | w/o INC => saver lost
| 0x08 | saver lost (completly erased)
| 0x09 | saver won
| 0x0B | with INC => saver won most times, but not always   [?]
| | w/o INC => saver left (was obs or obs on defeat)  [?]

Personal note:

- Until now we have not found a robust winner detection algorithm that
  works for every replay :(
  We checked about 6000 replays. Normal ladder games works well,
  but especially FFA games saved by an observer are very &§*#$.
  So here is still work to do...

Notes:
o Do NOT use the marked lines ([?],[N]) for winner detection.
If you use these you will probably increase the detection rate but also
get false detections.
The unmarked lines proofed to be fail-safe (at least until now).

o If at least one player gets a draw result the whole game is draw.

o The result*s* of the replay saver - he can get more than one because all
local leave actions (reason=0x0C) belong to this result - do not
contradict (except in draw games). There is never a win and a loss result
at the same time (if you use the none marked lines).

o All result-values in a leave-action are player specific results.
E.g. if one player of a team quits he gets a 'lost' result value - even
if his team mate later wins the game.

o If you get a win result for a player his team is definitely the winner and
all other teams lost.

o If the result for every player of a team is "loss" the whole team lost.

o Even WarCraft cannot see into the future ;). If the saver of a team replay
leaves the game first, you will always detect a 'saver-lost' result.
It is impossible to detect who is the winner in this replay.
Unfortunately this happens quite often. Imagine a 2vs2 game: One team was
nearly beaten, both players say 'gg' and leave. If the replay saver (one of
these losers) quits only 1 second before his team mate, you cannot detect
the winner in this replay.
Our strategy in this situation is to assume that the whole replay saver
team lost. This might not be correct in every situation (but from the
replay we will never know).
An alternative strategy could be: The team with the most remaining players
wins. This can be wrong too e.g. if in a 2on2 one team nearly won when one
of the players of this team disconnects but the second player finishes the
work.
In 2on2 games both strategies lead to same result.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x1A - unknown (first startblock)                               [ 5 byte ]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - unknown (always 0x01 so far)

Notes:
o This block seems to be always the first block at start of game.
It is never repeated.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x1B - unknown (second startblock)                              [ 5 byte ]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - unknown (always 0x01 so far)

Notes:
o This block seems to be always the second block at start of game.
It is never repeated.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x1C - unknown (third startblock)                               [ 5 byte ]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - unknown (always 0x01 so far)

Notes:
o This block seems to be always the third block at start of game.
It is never repeated.
o Rarely there is a chat block (0x20) or a LeaveGame block (0x17) between
2nd startblock (0x1B) and this 3rd startblock (0x1C)


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x1E - TimeSlot block                                       [ n+3 byte ]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
for details see block 0x1F

Notes:
o For patch version <= 1.02 this block was used instead of block 0x1F.
o This block also rarely appears in version >= 1.07. In this case the usual
RandomSeed block (0x22) does *not* follow though.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x1F - TimeSlot block                                       [ n+3 byte ]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 word - n = number of bytes that follow
1 word - time increment (milliseconds)
about 250 ms in battle.net
about 100 ms in LAN and single player
n-2 byte - CommandData block(s) (not present if n=2)

For every player which has executed an action during this time slot there is
at least one 'Command data block'.

CommandData block:
1 byte - PlayerID
1 word - Action block length
n byte - Action block(s) (see file 'w3g_actions.txt' for details)

Notes:
o The 'time increments' are only correct for replays played at fastest speed.
o Accumulate all 'time increments' to get the time of current action(s).
o This block is always followed by a 'Random Seed' block (0x22)
o For patch version <= 1.02 this block has the ID 0x1E.
o A detailed description of the action block format and all valid actions can
be found in the seperate document 'w3g_actions.txt'.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x20 - Player chat message (patch version >= 1.07)           [ n+4 byte ]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - PlayerID (message sender)
1 word - n = number of bytes that follow
1 byte - flags
0x10 for delayed startup screen messages? (see note)
0x20 for normal messages
1 dword - chat mode (not present if flag = 0x10):
0x00 for messages to all players
0x01 for messages to allies
0x02 for messages to observers or referees
0x03+N for messages to specific player N (with N = slotnumber)

n bytes - zero terminated string containing the text message

Notes:
o This block was introduced with patch 1.07.
o Only messages send and received by the player who saved the replay are
present.
o Messages to observers are not saved.
o The slot number corresponds to the record number as per section 4.11
starting with zero (first record = slot 0).
o To get the time of the chat command, accumulate all 'time increments' from
the 'TimeSlot' blocks (see above, block 0x1E and 0x1F).

Notes on chat messages with flag = 0x10:
o Only appears on startup between action block 0x1B and 0x1C.
o The 'chat mode' dword is not present. The message text starts right after
the flag field. The length value reflects this correctly.
o These chat messages do not appear when the replay is watched with WarCraft.
o The messages only appear in custom game replays. Maybe these are chat
messages written in the game startup screen, which were send right before
the game was started and could not be shown there in time because of lag.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x22 - unknown (Checksum or random number/seed for next frame)  [ 6 byte ]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - number of bytes following (always 0x04 so far)
1 dword - unknown (very random)

Notes:
o For patch version <= 1.02 this block has the ID 0x20.
o This message eventually syncs the random seed used for any calculation
within the previous or next frame between all clients.
It might be a complete gamescene checksum too though.
o This block follows always after a 'TimeSlot' block.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x23 - unknown                                                 [ 11 byte ]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Maybe:
1 dword - unknown
1 byte - unknown (always 4?)
1 dword - unknown (random?)
1 byte - unknown (always 0?)

Notes:

- Very rare.
- Appears in front of a 'LeaveGame' action.

Examples:

```
23 4C 0D 00 00 04 0B B0 B1 FC 00 ->  "#L........."    3404 4 4239503371 0
23 64 07 00 00 04 AC 34 28 7E 00 ->  "#d.....4(~."    1892 4 2116564140 0
23 FB 0D 00 00 04 DD B8 B1 87 00 ->  "#.........."    3579 4 2276571357 0
23 D5 15 00 00 04 19 ED 43 72 00 ->  "#.......Cr."    5589 4 1917054233 0
23 1B 03 00 00 04 D8 2E 81 4F 00 ->  "#........O."     795 4 1333866200 0
23 F2 04 00 00 04 91 7F C6 01 00 ->  "#...... ..."    1266 4 29786001 0
```

all following back-to-back in a single replay:

```
23 3A 03 00 00 04 B5 1F DC 80 00 ->  "#:........."     826 4 2161909685 0
23 3B 03 00 00 04 DE A7 93 77 00 ->  "#;.......w."     827 4 2006165470 0
23 3C 03 00 00 04 A9 A6 78 3B 00 ->  "#<......x;."     828 4 997762729 0
23 3D 03 00 00 04 25 87 97 9C 00 ->  "#=....%...."     829 4 2627176229 0
```

TODO: more analysis


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x2F - Forced game end countdown (map is revealed)              [ 9 byte ]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - mode:
0x00 countdown is running
0x01 countdown is over (end is forced *now*)
1 dword - countdown time in sec

Notes:
o This block was introduced with patch 1.07.
o Only found in battle.net tournament games which last too long.
o Normally countdown starts with 4:58 and the block is repeated every 30s
(4:58, 4:28, 3:58, ..., 0:58, 0:28, 0:00, now).
o On first occurence of this block the "fog of war" is turned off
(the complete map is revealed to all player).

===============================================================================
6.0 General notes
===============================================================================

o It seems that the following things are *not* to be found in the replay:

+ the Battle.net realm
+ the time/date of the game
+ the level/exp/record of the players in a ladder game

o You may add your own data at the end of the replay file - Warcraft III
ignores them (except for official blizzard replays, see section 6.1).
This might be useful e.g. for an replay database tool when storing a
description of the game right with the replay data.

o The saver of the replay is the last player leaving the game. This
'LeaveGame'-Action (see 5.0) is also the very last action of the replay.
This means the player id of the replay saver is the 9th last byte of the
uncompressed replay (so you don't have to parse the action-blocks to get the
name of the replay saver). This method does not work for official Blizzard
replays.

o Warcraft starts showing a replay with the game hosts point of view.

o The game type is not explicitly recorded in the replay:

- there is no difference between AT (arranged team) and RT (random team)
  ladder games replay wise
- one can detect team games by the team number in slot records
- one can detect FFA games by all players having different team numbers
  and there are more than 2 in the game

o One can start Warcraft with the parameter '-loadfile' to play back a replay
immediately:  War3.exe -loadfile "replayfilename"
Before patch 1.14 there was a side effect: the single-player user-name was
automatically changed to 'WorldEdit'.

o There was no patch 1.07, 1.08 and 1.09 for WarCraft III classic.
Patch 1.10 was released after patch 1.06 reflecting the release of
WarCraft III expansion set 'The Frozen Throne'.

o WarCraft III Frozen Throne was shipped with patch version 1.07 but was
immediately patched to version 1.10. There was no patch 1.08 or 1.09.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
6.1 Notes on official Blizzard Replays
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

These replays are automatically obtained by Blizzard during or after high level
ladder games and tournament final games. They are available for download
through the official Battle.net web page and show some differences to normal
replays saved by users.

Differences:

- The build number (see 2.2) is always zero.

- The filesize is 132 byte larger than denoted in header (see below).

- The map record (see 4.4) always reads '01 01 01 F9 01 01 FF FF FF FF'.

- The values of the unknown PlayerList entry (see 4.9) of all players in the
  replay is equal to the LanguageID (see 4.8).

- The number of SlotRecords (Byte 0x0003 of [GameStartRecord] in section 4.10)
  is always zero - there are no slot records (see 4.11) present.

- The StartSpotCount (see [GameStartRecord] in section 4.10) is always 0xCC.

- There is a signature block at the end of the replay:
  1 dword  : 4E 47 49 53 = 'NGIS' <=> 'SIGN'
  128 Byte : signature

Notes:

- Since the lack of all slot records, one has to generate these data:
  iterate slotNumber from 1 to number of PlayerRecords (see 4.1)
  player id = slotNumber
  slotstatus = 0x02                   (used)
  computerflag = 0x00                   (human player)
  team number = (slotNumber -1) mod 2  (team membership alternates in
  PlayerRecord)
  color = unknown                (player gets random colors)
  race = as in PlayerRecord
  computerAI = 0x01                   (non computer player)
  handicap = 0x64                   (100%)

- Tournament replays are given a unique name using the following scheme:
  'YYYYMMDDhhmmxxxxx-TAG-TYPEp.w3g'
  where:
  YYYY - year of the beginning of the game in greenwitch mean time (GMT)
  MM - month ...
  DD - day ...
  hh - hour ...
  mm - minutes ...
  xxxxx - numeric ID
  TAG - 'W3XP' for FrozenThrone, 'WAR3' for Classic
  TYPE - standard or race/map limitations,...
  without limitations (day of week):
  FRI - friday
  SAT - saturday
  SUN - sunday
  race limitation tournament:
  HUM - Human
  ORC - Orc
  NLF - Nightelf
  UND - Undead
  RND - Random
  map limitation tournament:
  CLD - Coldheart
  FLD - Floodplains
  GNW - Gnollwood
  LST - Lost Temple
  RCK - Turtle Rock
  WET - Wetlands
  p - number of players per team

File name examples:
20030816204000041-W3XP-SAT1.w3g
Frozen Throne 1on1 tournament on Saturday august 16th
(round started at 20:40 GMT)
20030817222400050-W3XP-SUN2.w3g
Frozen Throne 2on2 tournament on Sunday august 17th
20030820205400081-W3XP-LST1.w3g
TFT 1on1 "Lost Temple"-only tournament on august 20th

o Since one cannot change the name of the replay file, there has to be a
checksum in the signature (or maybe within the replay data itself).

o This feature was officially announced by Blizzard a couple of days after the
release of patch 1.12. It might have been present in previous versions of
the game though.

TODO: - signature analysis

## 7.0 Credits {id="Credits"}

We like to thank the following people for their help on decoding the
W3G format (in alphabetical order):

- BlackDick for
    - info on header checksum calculation
    - info on updates with patch 1.10
    - version/build information on TFT beta replays
    - various other hints and minor updates

- DooMeer for

    - info on '-loadfile' parameter

- Ens for

    - info on chat modes (observer, specific player)

- Mark Pflug for

    - finding action blocks 0x1E and 0x23

- Kliegs for

    - his notes.txt on which this document is based
    - hosting a CVS for replay format related documents

- ShadowFlare for

    - WinMPQ
    - hosting the developer forum

- Soar

    - some infos on changes with TFT

- Ziutek for

    - Total Commander MPQ plugin