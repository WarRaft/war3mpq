<show-structure for="chapter,procedure" depth="3"/>

# Actions

WarCraft III Replay action format description.

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
was anything worth after all ...

## Table of Content

- 1.0 Introduction
- 1.1 Standardized APMs
- 2.0 Action ID's
- 3.0 AbilityFlags
- 4.0 ItemID's
- 4.1 Stringencoded ItemID's
- 4.2 Numeric ItemID's
- 5.0 ObjectID's
- 6.0 Click Coordinates
- 7.0 General notes
- 8.0 Notes on older Patches
- 9.0 Credits
- 10.0 Document revision history

===============================================================================
1.0 Introduction
===============================================================================

This document describes the format of the actions found in the TimeSlot blocks
of the replay (see 'w3g_format.txt' section 5 for details):

0x1F - TimeSlot block (rarely also 0x1E)
1 word - number of bytes that follow
1 word - time increment (milliseconds)
about 250 ms in battle.net
about 100 ms in LAN and single player
n-2 byte - CommandData block(s) (not present if n=2)

For every player which has executed an action during the last time slot there
is at least one 'CommandData' block.

CommandData block:
1 byte - PlayerID
1 word - Action block length
n byte - Action block(s) (may contain multiple actions !)

Action block:
1 byte - ActionID (see 2.0)
n byte - action arguments (see 2.0)

Notes:
o The number of 'Action blocks' can only be determined by parsing the actions
up to the denoted Action block length.
o The 'time increments' are only correct for replays played at fastest speed.
o Accumulate all 'time increments' to get the time of current action(s).

TODO: analyse time increments of slow/normal speed

===============================================================================
1.1 Standardized APMs
===============================================================================

This section defines a standardized Actions-Per-Minute(APM) value.
With it we hope to make APM values more comparable inbetween all current and
future replay tools out there and coming. Please use it in your tool too :D

The main goal is an easy-to-implement algorithm. This way even simple replay
tools should have no difficulties at all to calculate it.

Basic rules:
o Only count in-game actions (no map-signals, no chat).
o Every counted action increments the player action counter by one.
o Do not filter out any player action.
o APM = numbers of actions of a player / time this player played.

Accordingly all actions in section 2.0 are marked in the headline:
[APM+] = Action is counted.
[APM?] = Special, please read the notes on this action (0x16, 0x19).
[APM-] = Action is not counted.

Additionally you have to pay attention to the pause/unpause actions in order to
determine the played time correctly:
Pause game (action 0x01):
o Stop the time at the first occurence of this action
(there might be multiple ones).
o The pause action itself is not counted.
o Do NOT stop counting the actions within a pause
(but skip actions like map signals as usual).
Resume game (action 0x02):
o Resume counting the time at first occurence of this action
(there might be multiple ones).
o Do not count this action itself.

Due to this simple method there are the following inadequacies:
o Cancelling a unit/building by pressing Escape key will be counted twice
(Action 0x61 + Action 0x10 with unitid=0x08000D00).
o Map signal are uncounted. They are no real in-game actions and can very
easily abused to increase the APM value.
o No 'tab' action are counted (since patch 1.14b).
(Prior to patch 1.14b only the last action of a complete cycle through all
subgroups was not counted.)

Keep in mind that for the APM value it is not important, which consequences
within the game an action has. It is only significant *how often* it is used.
If a player executes a specific action once every minute, it only results in
a 1 APM difference at the end.
Do you really need a APM precision better than say ±5 APMs ?

Note:
o If you decide to develop your own APM system (e.g. by filtering some user
actions) please do *not* call it APM.
Call it TrueAPM, RealAPM, myAPM, UserAPM or something like that instead.

===============================================================================
2.0 Action ID's
===============================================================================

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x01 - Pause game                                             [ 1 byte ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
no additional data

Notes:
o Due to lag there can be multiple pause or unpause actions, but they didn't
stack. The first unpause will resume the game, no matter how many pause
actions came before.

o There can be other actions between pause and resume action
(e.g. map signal action, actions issued before game pausing but delayed
by network latency)

o The length of the replay (found in replay header) is the effective play
time excluding any pause


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x02 - Resume game                                            [ 1 byte ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
no additional data

Note:
o See notes for Pause game action


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x03 - Set game speed in single player game (options menu)    [ 2 byte ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - game speed:
0x00 - slow
0x01 - normal
0x02 - fast

Note:
o Time increments (see 1.0) are only correct for fast speed.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x04 - Increase game speed in single player game (Num+)       [ 1 byte ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
no additional data

Note:
o Time increments (see 1.0) are only correct for fast speed.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x05 - Decrease game speed in single player game (Num-)       [ 1 byte ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
no additional data

Note:
o Time increments (see 1.0) are only correct for fast speed.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x06 - Save game                                             [ n bytes ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
n bytes - savegame name (null terminated string)


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x07 - Save game finished                                    [ 5 bytes ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - unknown (always 0x00000001 so far)

This action is supposed to signal that saving the game finished.
It normally follows a 0x06 action.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x10 - Unit/building ability (no additional parameters)     [ 15 bytes ] [APM+]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 word - AbilityFlags (see section 3) ('byte' for patch version < 1.13)

1 dword - ItemID (see section 4)

1 dword - unknownA (0xFFFFFFFF) (only present for patch version >= 1.07)
1 dword - unknownB (0xFFFFFFFF) (only present for patch version >= 1.07)

Note:
o For pre v1.07 replays this record is only 6 bytes.

o For pre v1.13 replays AbilityFlags is a Byte and therefore
the whole block 1 byte smaller.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x11 - Unit/building ability                                [ 22 bytes ] [APM+]
(with target position)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 word - AbilityFlags (see section 3) ('byte' for patch version < 1.13)

1 dword - ItemID (see section 4)

1 dword - unknownA (0xFFFFFFFF) (only present for patch version >= 1.07)
1 dword - unknownB (0xFFFFFFFF) (only present for patch version >= 1.07)

1 dword - target location X
1 dword - target location Y

Note:
o For pre v1.07 replays this record is only 14 bytes.

o For pre v1.13 replays AbilityFlags is a Byte and therefore
the whole block 1 byte smaller.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x12 - Unit/building ability                                [ 30 bytes ] [APM+]
(with target position and target object ID)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 word - AbilityFlags (see section 3) ('byte' for patch version < 1.13)

1 dword - ItemID (see section 4)

1 dword - unknownA (0xFFFFFFFF) (only present for patch version >= 1.07)
1 dword - unknownB (0xFFFFFFFF) (only present for patch version >= 1.07)

1 dword - target position X coordinate
1 dword - target position Y coordinate

1 dword - objectID1
1 dword - objectID2

objectID1 == objectID2 == FF FF FF FF for no object (e.g. rally on ground)

Note:
o For pre v1.07 replays this record is only 22 bytes.

o For pre v1.13 replays AbilityFlags is a Byte and therefore
the whole block 1 byte smaller.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x13 - Give item to Unit / Drop item on ground              [ 38 bytes ] [APM+]
(with target position, object ID A and B)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 word - AbilityFlags (see section 3) ('byte' for patch version < 1.13)

1 dword - ItemID (see section 4)

1 dword - unknownA (0xFFFFFFFF) (only present for patch version >= 1.07)
1 dword - unknownB (0xFFFFFFFF) (only present for patch version >= 1.07)

1 dword - target location X
1 dword - target location Y

1 dword - Target_objectID_1
1 dword - Target_objectID_2

1 dword - Item_objectID_1
1 dword - Item_objectID_2

Notes:
o For pre v1.07 replays this record is only 30 bytes.

o For pre v1.13 replays AbilityFlags is a Byte and therefore
the whole block 1 byte smaller.

o Target_objectID 1 and 2 is 0xFFFFFFFF for ground

Example: drop potion on ground:
13
40
21 00 0D 00
5B 10 58 C3
97 CE 1B 44
FF FF FF FF
FF FF FF FF
11 2D 00 00
D3 96 00 00


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x14 - Unit/building ability                                [ 43 bytes ] [APM+]
(with two target positions and two item ID's)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 word - AbilityFlags (see section 3) ('byte' for patch version < 1.13)

1 dword - ItemID_A (see section 4)

1 dword - unknownA (0xFFFFFFFF) (only present for patch version >= 1.07)
1 dword - unknownB (0xFFFFFFFF) (only present for patch version >= 1.07)

1 dword - target location A_X
1 dword - target location A_Y

1 dword - ItemID_B (see section 4)

9 byte - unknown

1 dword - target location B_X
1 dword - target location B_Y

Notes:
o For pre v1.07 replays this record is only 35 bytes.

o For pre v1.13 replays AbilityFlags is a Byte and therefore
the whole block 1 byte smaller.

Examples:

(human townhall rightclick on tree (tree not direct accessible))
Felwood:
14 00 03000D00 000024C5 0000B844 72745443 40 00100100 000000FF 000024C5 0000B844
. . . . . . . . $ . . . . D  r t T C @ . . . . . . . . . . $ . . . . D

Lordaeron Summer:
14 00 03000D00 0000D8C4 00005044 746C544C 40 00100100 000000FF 0000D8C4 00005044
. . . . . . . . . . . . P D t l T L @ . . . . . . . . . . . . . . P D

Village-Autumn:
14 00 03000D00 000070C4 00007044 77745446 40 00100100 000000FF 000070C4 00007044
. . . . . . . . p . . . p D w t T F @ . . . . . . . . . . p . . . p D

Dungeon:
14 00 03000D00 0000A0C3 00009844 68735444 40 00100100 000000FF 0000A0C3 00009844
. . . . . . . . . . . . . D h s T D @ . . . . . . . . . . . . . . . D

(rightclicks)[==]
14 00 03000D00 0000D845 000000C6 6C6F676E 08 00A05500 0000000F 0000D845 000000C6
. . . . . . . . . E . . . . l o g n . . . U . . . . . . . . E . . . .

14 00 03000D00 0000C0C4 00001BC6 77745442 40 00100100 000000FF 0000C0C4 00001BC6
. . . . . . . . . . . . . . w t T B @ . . . . . . . . . . . . . . . .

14 00 03000D00 00008845 0000BE45 746C544C 40 00100100 000000FF 00008845 0000BE45
. . . . . . . . . E . . . E t l T L @ . . . . . . . . . . . E . . . E

14 00 03000D00 00004AC5 0000C3C5 65746165 08 00905908 00000001 00004AC5 0000C3C5
. . . . . . . . J . . . . . e t a e . . . Y . . . . . . . J . . . . .

14 00 03000D00 000080C4 0000D845 6C6F6775 08 0090590A 00000001 000080C4 0000D845
. . . . . . . . . . . . . E l o g u . . . Y . . . . . . . . . . . . E

(attack)[!=]
14 18 0F000D00 BA387FC3 2C6F6FC5 746C544C 40 00100100 000000FF 0000A0C3 000074C5
. . . . . . . 8  . , o o . t l T L @ . . . . . . . . . . . . . . t .

(undead gold)[==]
14 04 6C6F6775 0000F044 00002C45 6C6F676E 08 00A05500 0000000F 0000F044 00002C45
. . l o g u . . . D . . , E l o g n . . . U . . . . . . . . D . . , E"


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x16 - Change Selection (Unit, Building, Area)           [ 4+n*8 bytes ] [APM?]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - select mode:
0x01 - add to selection      (select)
0x02 - remove from selection (deselect)
1 word - number (n) of units/buildings

block repeated n times:
1 dword - ObjectID1
1 dword - ObjectID2

(ObjectID1 == ObjectID2 for starting town hall and trees ?)

Note:
o If one simply selects a new unit then this results in a single 'add to
selection'-action (16 01) preceded by a 'remove from selection'-action
(16 02) for the complete old selection.

APM-Note:
o Every 'Change Selection' action (both 'select' and 'deselect') increases
the APM counter by one [APM+], BUT:
o Do *not* count a 'select' action that follows *immediately* after a
'deselect' action within the *same* CommandData block.
This is reasonable because mostly all deselect actions in front of select
actions are autogenerated by WarCraft and therefore the whole deselect/
select combo action needs to be counted as 1 action only.
o Example pseudo algorithm:

      FOREACH TimeSlot-block DO
        ...

        FOREACH CommandData-block DO
          id = ReadPlayerID()
          LastActionWasDeselect = FALSE;
          ...

          FOREACH Action-block DO
            actionid = ReadActionID()
            ...
            IF (actionid == 0x16) THEN
              IF (selectMode == deselect) THEN
                countThisActionAsAPM()
                LastActionWasDeselect = TRUE;
              ELSE
                IF (!LastActionWasDeselect) THEN countThisActionAsAPM()
                LastActionWasDeselect = FALSE;
              ENDIF
            ELSE
              LastActionWasDeselect = FALSE;
            ENDIF
            ...
          ENDFOREACH
          ...
        ENDFOREACH
        ...
      ENDFOREACH

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x17 - Assign Group Hotkey                               [ 4+n*8 bytes ] [APM+]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - group number (0-9)
the group number is shifted by one:
key '1' is group0, ... , key '9' is group8 and key '0' is group9
1 word - number (n) of items in selection

block repeated n times:
1 dword - ObjectID1
1 dword - ObjectID2

Note:
o There is no extra 'add to group' action (Shift-[1..0]). Instead the
whole *new* group is listed with an 'assign group hotkey' action.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x18 - Select Group Hotkey                                   [ 3 bytes ] [APM+]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - group number (0-9)
the group number is shifted by one:
key '1' is group0, ... , key '9' is group8 and key '0' is group9
1 byte - unknown  (always 0x03)

Note:
o There is no deselect action (0x16 02) issued for the previous selection.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x19 - Select Subgroup (patch version >= 1.14b)             [ 13 bytes ] [APM?]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - ItemID    (see section 4)
1 dword - ObjectID1 (see section 5)
1 dword - ObjectID2

Notes:
o Always following a 0x1A-Action (Pre subselection)

o The ItemID and the ObjectID represents the first unit in the newly
selected subgroup.
This can be used to associate ItemID's with ObjectID's for one unit!

o Nearly all 'Select Subgroup' actions are autogenerated.

TODO:
o Find algorithm to detect real 'SelectSubgroup' actions (TAB-key pressed)
for APM counting.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x19 - Select Subgroup (patch version < 1.14b)               [ 2 bytes ] [APM?]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - subgroup number (0-11, 0xFF)

Notes:
o There is a special subgroup action: 0x19 0xFF
It is an auto-generated action in the replay and might mean something
like "update subgroups" (e.g. when a summoned unit disappears or peasant
turns into militia etc.).

o Most 'select subgroup 0'-actions (0x19 00) are autogenerated too (e.g. if
one selects a subgroup and then selects a completely different unit).

o Since patch 1.13 nearly all 'Select Subgroup' actions are autogenerated.
Very often WarCraft seems to write a complete subgroup status to the replay.
For every player there is an 'Update Subgroup' action (0x19 0xFF)
followed immediately by a 'Select Subgroup' action where the subgroup
number represents the current subgroup status. This status does not always
correspond to the currently selected subgroup of this player. (TODO: why?)

APM-Note:
o Only count this action if 'subgroup number' is neither 0x00 nor 0xFF.

o Do *not* count a 'Select Subgroup' action that follows *immediately* after
a 'Update Subgroup' action within the *same* CommandData block.
(Adapt the example pseudo algorithm of action 0x16.)


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x1A - Pre Subselection                                       [ 1 byte ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
no additional data

Notes:
o Mostly followed by a 0x19-Action (Select Subgroup) but not always


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x1B - Unknown                                              [ 10 bytes ] [APM-]
0x1A for WarCraft III patch version <= 1.14b
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - unknown (always 0x01 so far)
1 dword - unknown (ObjectID1?)
1 dword - unknown (ObjectID2?)

Notes:
o Only in scenarios, maybe a trigger-related command


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x1C - Select Ground Item                                   [ 10 bytes ] [APM+]
0x1B for WarCraft III patch version <= 1.14b
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - unknown (flags? always 0x04 so far)
1 dword - ObjectID1
1 dword - ObjectID2

Notes:
o Leftclick on an item laying on the ground (selecting it).

o This action is normally preceded by a deselect (0x16 02) and subgroup
update (0x19 FF) action.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x1D - Cancel hero revival                                   [ 9 bytes ] [APM+]
0x1C for WarCraft III patch version <= 1.14b
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - UnitID1 (always a hero)
1 dword - UnitID2 (always a hero)

Notes:
o This action is only present in LAN/Multiplayer games.

o It is issued for every canceled hero revival - regardless which spot
in the "build/revival queue" the hero had.

o It is not issued for canceling hero training. There you get the "usual"
"61 10 40 08 00 0D 00 ..." action sequence.

o This action is normally preceded by a deselect (0x16 02) and subgroup
update (0x19 FF) action.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x1E - Remove unit from building queue                       [ 6 bytes ] [APM+]
0x1D for WarCraft III patch version <= 1.14b
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - SlotNr (0 = unit currently build,
1 = first unit in queue,
2 = second unit in queue,
...
6 = last unit in queue)
1 dword - ItemID (StringID for the canceled unit)


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x21 - unknown                                               [ 9 bytes ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - unknown [A] (0x000064F0 so far)
1 dword - unknown [B] (0x000064F0 so far)

Note:
o Very very rare action block.
o Found in replays with patch version 1.04 and 1.05.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x20, 0x22-0x32 - Single Player Cheats                       [ * bytes ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Action | Size | Cheat | Description
-------+--------+--------------------------+-------------------------------
0x20 | 1 Byte | TheDudeAbides | Fast cooldown
0x22 | 1 Byte | SomebodySetUpUsTheBomb | Instant defeat
0x23 | 1 Byte | WarpTen | Speeds construction
0x24 | 1 Byte | IocainePowder | Fast Death/Decay
0x25 | 1 Byte | PointBreak | Removes food limit
0x26 | 1 Byte | WhosYourDaddy | God mode
0x27 | 6 Byte | KeyserSoze [amount]      | Gives you X Gold
0x28 | 6 Byte | LeafitToMe [amount]      | Gives you X Lumber
0x29 | 1 Byte | ThereIsNoSpoon | Unlimited Mana
0x2A | 1 Byte | StrengthAndHonor | No defeat
0x2B | 1 Byte | itvexesme | Disable victory conditions
0x2C | 1 Byte | WhoIsJohnGalt | Enable research
0x2D | 6 Byte | GreedIsGood [amount]     | Gives you X Gold and Lumber
0x2E | 5 Byte | DayLightSavings [time]   | Set a time of day
0x2F | 1 Byte | ISeeDeadPeople | Remove fog of war
0x30 | 1 Byte | Synergy | Disable tech tree requirements
0x31 | 1 Byte | SharpAndShiny | Research upgrades
0x32 | 1 Byte | AllYourBaseAreBelongToUs | Instant victory
| | |
? | | Motherland [race][level] | Campain level jump

Additional Parameter:
o Action 0x27,0x28,0x2D:  Adding Resources
1 byte - unknown (always 0xFF)
1 dword - (signed) amount of ressources

o Action 0x2E: Set time of day
1 float - time (IEEE single precision float, 4Bytes)

Notes:
o Action 0x21 is not a cheat (see action above).
o Cheat "TenthLevelTaurenChieftain" (changes background music) does not
appear in replays.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x50 - Change ally options                                   [ 6 bytes ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - player slot number (0-11)(including computer AI players)
1 dword - flags
bit 0-4 - set if allied with player (value 0x1F)
bit 5 - set if vision shared with player (value 0x20)
bit 6 - set if unit control is shared with player (value 0x40)
bit 10 - set if "allied victory" is ticked (value 0x0400)
(for patch version >= 1.07, see note)

Notes:
o All other bits not listed above are unused (zero).

o The parameter to this action always reflects the current status of all
options.

o There is a action for every player where at least one option was changed.

o Changing the "allied victory" option results in an action for every player
in game (no matter if ally or non-ally).

o On patch version <= 1.06 the "allied victory" option was represented by
bit 9 (value 0x0200).

o Shared unit control is linked to both shared vision and ally up.
If either of them is unticked shared unit control is disabled too.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x51 - Transfer resources                                   [ 10 bytes ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - player slot number (0-11)(including computer AI players)
1 dword - Gold to transfer
1 dword - Lumber to transfer

Note:
o Transfering resources to multiple players results in an action for every
involved player.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x60 - Map trigger chat command (?)                          [ n bytes ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - unknownA
1 dword - unknownB
n bytes - null terminated string (chat command or trigger name)

Note:
o unknownA == unknownB so far


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x61 - ESC pressed                                            [ 1 byte ] [APM+]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
no additional data

Notes:
o This action often precedes cancel build/train actions.

o But it is also found seperately (e.g. when leaving the 'choose skill'
subdialog of heros using ESC).


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x62 - Scenario Trigger                                     [ 13 bytes ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - unknown [A]
1 dword - unknown [B]
1 dword - unknown (counter) (only present for patch version >= 1.07)

Notes:
o A=B in all replays so far.

o Probably sync action for custom map timer triggers.

o The third dword counts upwards in TFT azure tower defense map games.

o The third dword was missing for replays with patch version <= 1.06

o For pre v1.07 replays this record is only 9 bytes.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x66 - Enter choose hero skill submenu                        [ 1 byte ] [APM+]
0x65 for WarCraft III patch version <= 1.06
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
no additional data

Notes:
o This action is issued if you select a hero and enter his 'choose skill'
submenu. It does not matter wether one actually can choose a new skill
(because of level up) or not.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x67 - Enter choose building submenu                          [ 1 byte ] [APM+]
0x66 for WarCraft III patch version <= 1.06
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
no additional data

Notes:
o This action is issued if you select a worker (peon, peasant, acolyte, wisp)
and enter the build submenu to choose a building to create.
It does not matter whether one really builds something.

o It is usually followed by a build action (0x11) or a ESC action (0x61).


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x68 - Minimap signal (ping)                                [ 13 bytes ] [APM-]
0x67 for WarCraft III patch version <= 1.06
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - Location X
1 dword - Location Y
1 dword - unknown (00 00 A0 40)


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x69 - Continue Game (BlockB)                               [ 17 bytes ] [APM-]
0x68 for WarCraft III patch version <= 1.06
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - unknown [C]
1 dword - unknown [D]
1 dword - unknown [A]
1 dword - unknown [B]

Notes:
o This action is issued if the game winner chooses 'continue game' or
if 'observer on defeat' is enabled and a loser chooses 'continue game'.

o Always combined with 0x6A action (see below).


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x6A - Continue Game (BlockA)                               [ 17 bytes ] [APM-]
0x69 for WarCraft III patch version <= 1.06
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 dword - unknown [A]
1 dword - unknown [B]
1 dword - unknown [C]
1 dword - unknown [D]

Notes:
o This action is issued if the game winner chooses 'continue game' or
if 'observer on defeat' is enabled and loser choose 'continue game'.

o Only present for replay saver, 'continue game' of other players results in
normal 'leave game' action.

o Always followed by a 0x69 action (see above) with data [C][D][A][B].

o Parameters [A][B] look similar to those of 0x62 action.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
0x75 - Unknown                                               [ 2 bytes ] [APM-]
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 byte - unknown

Notes:
o Only in scenarios, maybe a trigger-related command

===============================================================================
3.0 AbilityFlags
===============================================================================

Ability flags represent additional attributes of an action.
E.g.: If bit 0 is set the action was queued (by pressing the shift key) and
will only be executed after the previous action was finished.

Unfortunately Warcraft sets some of the bits automatically, even when the
player didn't press a modifier button/key (e.g. subgroup command flag).

The Flag item used to have BYTE size until patch 1.12. With patch 1.13 it
was extended to a WORD.
Flag value is composed of the following values

0x0001 - queue command (shift held down)
0x0002 - ? (apply to all units in subgroup ?)
0x0004 - ? (area effect ?)
0x0008 - group command (all units in current selection)
0x0010 - move group without formation (formation disabled)
0x0020 - ?
0x0040 - ctrl held down (subgroup command)
sometimes automatically added
(e.g. subgroup worker -> rightclick mine without ctrl)

new since patch 1.13
0x0100 - autocast on/off command

Examples:
0x42 - rightclick item in inventory
0x44 - use ability (revive hero, cast spell)
0x48 - ctrl group command (group peasants -> goldmine)

0x44 - detonate Wisp (area effect unit ability ?)
0x4C - use WON (area effect item ?)
0x00 - use ability (Stop, Hold, uproot, Mirrorimage etc.)
0x40 - Train unit / Research / Buy (resources changed?)
(Orc burrow - combatpositions)
0x42 - use special ability (that changes unit stats ???)
(heros: skill ability, HU townhall: call to arms)
0x44 - Summon (summon units and train heros)

TODO: further research, verification

===============================================================================
4.0 ItemID's
===============================================================================

There are two types of ItemID's - alphanumeric and stringencoded:
o Both types are 4 Bytes long.
o Stringencoded ID's contain four valid characters.
o Alphanumeric ID's have always the format: ?? ?? 0D 00

===============================================================================
4.1 Stringencoded ItemID's
===============================================================================

Stringencoded ItemID's are used for:
o Constructing a building
o Upgrading a building (Tier2, Tier3, tower upgrades)
o Training units/heros
o Skilling hero abilities
o Researching abilities/skills/spells
o Researching upgrades
o Buying items/merc./heros

Stringencoded ID's contain four valid characters, giving a representative name
for the unit/hero/item/ability.

Blizzard used some kind of naming convention for some things:
The lowbyte (little Endian style) of the string may mean:
'A' - Hero ability

     'e' - Night Elf unit
     'E' - Night Elf hero

     'h' - Human unit
     'H' - Human hero

     'o' - Orc unit
     'O' - Orc hero

     'R' - Research item

     'u' - Undead unit
     'U' - Undead hero

For Hero abilities ('A') the next byte denotes the race (E=elf,H=human,O=orc,U=undead).
For Research items ('R') the next byte denotes the race (e=elf,h=human,o=orc,u=undead).

Shop items and mercenaries don't fit into this naming sceme - e.g. some things
start with a 'h'. But the hole string is always unequivocal.

A complete list of string encoded ID's used can be found in the file
"war3.mpq/Scripts/common.ai"    (units & buildings)
and in the files
"war3.mpq/Units/*Strings.txt"   (units, abilities, upgrades, items)
in your WarCraft directory.

Even more information (including gold cost etc.) about the String ID's can be found
in the "war3.mpq/Units/*.slk" data files.

Following are some example ID's:

             ewsp - Elf Wisp
             esen - Elf Huntress (Sentinel?)
             etoa - Elf tree of ages (tier2)
             Resm - Research Elf Melee Attack+1
             opeo - Orc peon
             ostr - Orc stronghold (tier2)
             uaco - UD acolyte
             AOsf - Ability Orc: shadow wolves
             AOmi - Ability Orc: mirror image
             Obla - Orc Blademaster
             Ofar - Orc Farseer
             Otch - Orc Tauren Chieftain
             wneg - wand of negation (WON)
             gemt - gem of true seeing
             edob - Elf huntress hall
             emow - Elf moon well
             oalt - Orc altar
             otrb - Orc burrow
             usep - UD crypt
             uzig - UD ziggurat

===============================================================================
4.2 Numeric ItemID's
===============================================================================

Numeric ItemID's are only used on EXECUTION of abilities/spells.
(e.g. hero spells, unit spells, autocast on/off)

Alphanumeric IDs have always the format: ?? ?? 0D 00

Following is a list of alphanumeric ID's found so far:

            03 00 0D 00 - rightclick
            04 00 0D 00 - stop

            08 00 0D 00 - cancel (train, research) (often preceded by an ESC action 0x61)

            0C 00 0D 00 - set rally point

            0F 00 0D 00 - attack
            10 00 0D 00 - attack ground (e.g. Orc Catapult)                    [11-40-ID-ClickX/Y]

            12 00 0D 00 - move unit

            16 00 0D 00 - patrol

            19 00 0D 00 - hold position

            - - - - - -
            21 00 0D 00 - give away item (from inventory to unit or ground)    [13-40-ID-ClickX/Y-UnitID-ItemID]
            - - - - - -
            22 00 0D 00 - swap item place 7 (slot of item to swap with!)
            23 00 0D 00 - swap item place 8
            24 00 0D 00 - swap item place 4
            25 00 0D 00 - swap item place 5
            26 00 0D 00 - swap item place 1
            27 00 0D 00 - swap item place 2
            - - - - - -
            28 00 0D 00 - use item place 7
            29 00 0D 00 - use item place 8
            2A 00 0D 00 - use item place 4
            2B 00 0D 00 - use item place 5
            2C 00 0D 00 - use item place 1
            2D 00 0D 00 - use item place 2
            - - - - - -

            31 00 0D 00 - return resources (tested with ghoul with lumber)
            32 00 0D 00 - mine (ghoul -> lumber)

            37 00 0D 00 - use ability: reveal area (N goblin laboratory)       [11-40-ID-ClickX/Y]
            - - - - - -
            38 00 0D 00 - use ability: repair (HU peasant, Orc peon)           [12-40-ID-ClickX/Y-UnitID]
            39 00 0D 00 - enable autocast: repair (HU peasant, Orc peon)       [10-42-ID]
            3A 00 0D 00 - disable autocast: repair (HU peasant, Orc peon)      [10-42-ID]
            - - - - - -
            3B 00 0D 00 - revive hero (first  of 1 or more dead heros)         [12-44-ID-ClickX/Y-UnitID]
            3C 00 0D 00 - revive hero (second of 2 or more dead heros)         [12-44-ID-ClickX/Y-UnitID]
            3D 00 0D 00 - revive hero (third  of 3 or more dead heros)         [12-44-ID-ClickX/Y-UnitID]
            3E 00 0D 00 - revive hero (fourth of 4 or more dead heros)         [12-44-ID-ClickX/Y-UnitID]
            3F 00 0D 00 - revive hero (fifth  of 5 dead heros)                 [12-44-ID-ClickX/Y-UnitID]
            - - - - - -

            48 00 0D 00 - use ability: kaboom (Goblin sapper)                  [12-44-ID-ClickX/Y-TargetID] [Action14]
            49 00 0D 00 - enable autocast: kaboom (Goblin sapper)              [10-42-ID]
            4A 00 0D 00 - disable autocast: kaboom (Goblin sapper)             [10-42-ID]

            - - - - - -
            4E 00 0D 00 - load unit (NE mine/Zepellin)                         [12-44-ID-ClickX/Y-TargetID]
            4F 00 0D 00 - remove single unit (click unit) (NE mine/Zepellin)   [12-02-ID-ClickX/Y-TargetID]
            50 00 0D 00 - unload all units (NE mine/Zepellin)                  [12-40-ID-ClickX/Y-TargetID] [Action11]
            51 00 0D 00 - all wisp exit mine (button) (NE gold mine)           [10-40-ID]
            - - - - - -

            53 00 0D 00 - enable autocast: load corpses (UD: meat wagon)       [10-42-ID]
            54 00 0D 00 - disable autocast: load corpses (UD: meat wagon)      [10-42-ID]
            55 00 0D 00 - use ability: load corpses (UD: meat wagon)           [10-40-ID]
            56 00 0D 00 - use ability: unload corpses (UD: meat wagon)         [10-40-ID]
            57 00 0D 00 - use ability: enable defend (HU footman)              [10-42-ID]
            58 00 0D 00 - use ability: disable defend (HU footman)             [10-42-ID]
            59 00 0D 00 - use ability: area dispell (Hu priest)                [11-44-ID-ClickX/Y]

            5C 00 0D 00 - use ability: flare (Hu Mortar team)                  [11-44-ID-ClickX/Y]

            5F 00 0D 00 - use ability: heal (Hu priest)                        [12-44-ID-ClickX/Y-TargetID]
            60 00 0D 00 - enable autocast heal (Hu priest)                     [10-42-ID]
            61 00 0D 00 - disable autocast heal (Hu priest)                    [10-42-ID]
            62 00 0D 00 - use ability: inner fire (Hu priest)                  [12-44-ID-ClickX/Y-TargetID]
            63 00 0D 00 - enable autocast inner fire (Hu priest)               [10-42-ID]
            64 00 0D 00 - disable autocast inner fire (Hu priest)              [10-42-ID]
            65 00 0D 00 - use ability: invisibility (Hu sorcress)              [12-44-ID-ClickX/Y-TargetID]

            68 00 0D 00 - use ability: call to arms (Hu peasant)               [10-42-ID]
            69 00 0D 00 - use ability: return to work (Hu militia)             [10-42-ID]
            6A 00 0D 00 - use ability: polymorph (Hu sorcress)                 [12-44-ID-ClickX/Y-TargetID]
            6B 00 0D 00 - use ability: slow (Hu sorcress)                      [12-44-ID-ClickX/Y-TargetID]
            6C 00 0D 00 - enable autocast slow (Hu sorcress)                   [10-42-ID]
            6D 00 0D 00 - disable autocast slow (Hu sorcress)                  [10-42-ID]

            72 00 0D 00 - call to arms (Hu townhall)
            73 00 0D 00 - return to work (Hu townhall)

            76 00 0D 00 - use ability: avatar (Hu Mountain King ultimate)      [10-40-ID]

            79 00 0D 00 - use ability: blizzard (Hu Archmage)                  [11-44-ID-ClickX/Y] [11-5C-ID-ClickX/Y]
            7A 00 0D 00 - use ability: divine shield (Hu Paladin)              [10-40-ID]
            7B 00 0D 00 - use ability: divine shield - turn off(Hu Paladin)    [10-40-ID]
            7C 00 0D 00 - use ability: holy light (Hu Paladin)                 [12-44-ID-ClickX/Y-TargetID]
            7D 00 0D 00 - use ability: mass teleportation  (Hu Archmage)       [12-44-ID-ClickX/Y-TargetID]
            7E 00 0D 00 - use ability: revive (Hu Paladin ultimate)            [10-44-ID]
            7F 00 0D 00 - use ability: storm bolt (Hu Mountain King)           [12-44-ID-ClickX/Y-TargetID]
            80 00 0D 00 - use ability: clap (Hu Mountain King)                 [10-40-ID]
            81 00 0D 00 - use ability: summon water elemental (Hu Archmage)    [10-44-ID]

            - - - - - -
            83 00 0D 00 - peons into combat positions (Orc Burrow)

(p1.07)   84 00 0D 00 - Berserk (Orc troll berserker)                        [10- ]
85 00 0D 00 - use ability: bloodlust (Orc Shaman)                  [12-44-ID-ClickX/Y-TargetID]
86 00 0D 00 - enable autocast bloodlust (Orc Shaman)               [10-42-ID]
87 00 0D 00 - disable autocast bloodlust (Orc Shaman)              [10-42-ID]
88 00 0D 00 - use ability: devour (Orc Kodo beast)                 [12-44-ID-ClickX/Y-TargetID]
89 00 0D 00 - use ability: sentry ward (Orc Witch Doctor)          [11-44-ID-ClickX/Y]
8A 00 0D 00 - use ability: entangle (Orc Raider)                   [12-44-ID-ClickX/Y-TargetID]

            8D 00 0D 00 - use ability: healing ward (Orc Witch Doctor)         [11-44-ID-ClickX/Y]
            8E 00 0D 00 - use ability: lightning shield (Orc Shaman)           [12-44-ID-ClickX/Y-TargetID]
            8F 00 0D 00 - use ability: purge (Orc Shaman)                      [12-44-ID-ClickX/Y-TargetID]

            91 00 0D 00 - return to work (Orc Burrow)
            92 00 0D 00 - use ability: stasis trap (Orc Witch Doctor)          [11-44-ID-ClickX/Y]

            97 00 0D 00 - use ability: chain lightning (Orc Farseer)           [12-44-ID-ClickX/Y-TargetID]

            99 00 0D 00 - use ability: earthquake (Orc Farseer ultimate)       [11-44-ID-ClickX/Y]
            9A 00 0D 00 - use ability: farsight (Orc Farseer)                  [11-44-ID-ClickX/Y]
            9B 00 0D 00 - use ability: mirror image (Orc Blademaster)

            9D 00 0D 00 - use ability: shockwave (Orc Tauren Chieftain)        [12-44-ID-ClickX/Y-TargetID] [14- ]
            9E 00 0D 00 - use ability: shadow wolves (Orc Farseer)
            9F 00 0D 00 - use ability: war stomp (Orc Tauren Chieftain)        [10-40-ID]
            A0 00 0D 00 - use ability: blade storm (Orc Blademaster ultimate)  [10-42-ID]
            A1 00 0D 00 - use ability: wind walk (Orc Blademaster)             [10-42-ID]

            - - - - - -
            A3 00 0D 00 - use ability: shadowmeld (NE females)
            A4 00 0D 00 - use ability: dispell magic (NE Dryad)                [12-44-ID-ClickX/Y-TargetID]
            A5 00 0D 00 - enable autocast: dispell magic (NE Dryad)            [10-42-ID]
            A6 00 0D 00 - disable autocast: dispell magic (NE Dryad)           [10-42-ID]

            AA 00 0D 00 - use ability: transform: DotC -> bear (NE DotC)       [10-42-ID] (followed by [19-FF])
            AB 00 0D 00 - use ability: transform: bear -> DotC (NE DotC)       [10-42-ID] (followed by [19-FF])

            AE 00 0D 00 - use ability: pick up archer (NE hippogryph)          [12-44-ID-ClickX/Y-TargetID]
            AF 00 0D 00 - use ability: mount hippogryph (NE archer)            [12-44-ID-ClickX/Y-TargetID]
            B0 00 0D 00 - use ability: cyclone (NE DotT)                       [12-44-ID-ClickX/Y-TargetID]
            B1 00 0D 00 - use ability: detonate (NE Wisp)
            B2 00 0D 00 - use ability: eat tree (NE Ancient)                   [12-44-ID-ClickX/Y-TargetID] [14- ]
            B3 00 0D 00 - use ability: entangle goldmine (NE Tree of Life)     [12-40-ID-ClickX/Y-TargetID] [14- ]

            B5 00 0D 00 - use ability: feary fire (NE DotT)                    [12-44-ID-ClickX/Y-TargetID]
            B6 00 0D 00 - enable autocast: feary fire (NE DotT)                [10-42-ID]
            B7 00 0D 00 - disable autocast: feary fire (NE DotT)               [10-42-ID]

            BB 00 0D 00 - use ability: transform into crow form (NE DotT)      [10-42-ID] (followed by [19-FF])
            BC 00 0D 00 - use ability: transform back from crow form (NE DotT) [10-42-ID] (followed by [19-FF])
            BD 00 0D 00 - use ability: replenish life/mana (NE Moon well)      [12-44-ID-ClickX/Y-TargetID]
            BE 00 0D 00 - enable autocast: replenish life/mana (NE Moon well)  [10-42-ID]
            BF 00 0D 00 - disable autocast: replenish life/mana (NE Moon well) [10-42-ID]
            C0 00 0D 00 - use ability: rejuvenation (NE DotC)                  [12-44-ID-ClickX/Y-TargetID]
            C1 00 0D 00 - use ability: renew (repair) (NE Wisp)                [12-40-ID-ClickX/Y-UnitID]
            C2 00 0D 00 - enable autocast: renew (repair) (NE Wisp)            [10-42-ID]
            C3 00 0D 00 - disable autocast: renew (repair) (NE Wisp)           [10-42-ID]
            C4 00 0D 00 - use ability: roar (NE DotC)                          [10-44-ID]
            C5 00 0D 00 - use ability: root (NE Ancient)                       [11-04-ID-ClickX/Y]
            C6 00 0D 00 - use ability: uproot (NE Ancient)                     [10-40-ID]

            CB 00 0D 00 - use ability: entangling roots (NE KotG)              [12-44-ID-ClickX/Y-TargetID]

            CD 00 0D 00 - use ability: searing arrow (NE PotM)                 [12-44-ID-ClickX/Y-TargetID]
            CE 00 0D 00 - enable autocast: searing arrow (NE PotM)             [10-42-ID]
            CF 01 0D 00 - disable autocast: searing arrow (NE PotM)            [10-42-ID]
            D0 00 0D 00 - use ability: summon treants (NE KotG)
            D1 00 0D 00 - use ability: immolation ON (NE Daemon Hunter)        [10-42-ID]
            D2 00 0D 00 - use ability: immolation OFF (NE Daemon Hunter)       [10-42-ID]
            D3 00 0D 00 - use ability: manaburn (NE Daemon Hunter)             [12-44-ID-ClickX/Y-TargetID]
            D4 00 0D 00 - use ability: metamorphosis ((NE DH ultimate)         [10-40-ID]
            D5 00 0D 00 - use ability: scout owl (NE PotM)                     [10-44-ID]
            D6 00 0D 00 - use ability: sentinel (NE huntress)                  [12-5C-ID-ClickX/Y-TargetID] [14- ]
            D7 00 0D 00 - use ability: starfall (NE PotM ultimate)             [10-40-ID]
            D8 00 0D 00 - use ability: tranquility (NE KotG ultimate)          [10-40-ID]

            - - - - - -
            DA 00 0D 00 - use ability: anti magic shell (UD Banshee)           [12-44-ID-ClickX/Y-TargetID]

            DC 00 0D 00 - use ability: cannibalize (UD Ghoul)                  [10-40-ID]
            DD 00 0D 00 - use ability: cripple (UD Necromancer)                [12-44-ID-ClickX/Y-TargetID]
            DE 00 0D 00 - use ability: curse (UD Banshee)                      [12-44-ID-ClickX/Y-TargetID]
            DF 00 0D 00 - enable autocast: curse (UD Banshee)                  [10-42-ID]
            E0 00 0D 00 - disable autocast: curse (UD Banshee)                 [10-42-ID]

            E4 00 0D 00 - use ability: possession (UD Banshee)                 [12-44-ID-ClickX/Y-TargetID]

            E6 00 0D 00 - enable autocast: raise skeletons (UD Necromancer)    [10-42-ID]
            E7 00 0D 00 - disable autocast: raise skeletons (UD Necromancer)   [10-42-ID]
            E8 00 0D 00 - use ability: raise skeletons (UD Necromancer)        [10-40-ID]
            E9 00 0D 00 - use ability: sacrifice (UD Acolyte button)           [12-44-ID-ClickX/Y-UnitID]
            EA 00 0D 00 - use ability: restore (repair) (UD Acolyte)           [12-40-ID-ClickX/Y-UnitID]
            EB 00 0D 00 - enable autocast: restore (repair) (UD Acolyte)       [10-42-ID]
            EC 00 0D 00 - disable autocast: restore (repair) (UD Acolyte)      [10-42-ID]
            ED 00 0D 00 - use ability: sacrifice (Sacrificial Pit's button)    [12-44-ID-ClickX/Y-UnitID]
            EE 00 0D 00 - transform: gargoyle -> stone (UD Gargoyle)           [10-42-ID] (followed by a [19-FF])
            EF 00 0D 00 - transform: stone -> gargoyle (UD Gargoyle)           [10-42-ID] (followed by a [19-FF])

            F1 00 0D 00 - use ability: unholy frenzy (UD Necromancer)          [12-44-ID-ClickX/Y-TargetID]
            F2 00 0D 00 - use ability: unsummon (UD Acolyte)                   [12-44-ID-ClickX/Y-TargetID]
            F3 00 0D 00 - use ability: web (UD Crypt fiend)                    [12-44-ID-ClickX/Y-TargetID]
            F4 00 0D 00 - enable autocast: web (UD Crypt fiend)                [10-42-ID]
            F5 00 0D 00 - disable autocast: web (UD Crypt fiend)               [10-42-ID]

            F9 00 0D 00 - use ability: animate dead (UD DeathKnight ultimate)  [10-44-ID]
            FA 00 0D 00 - use ability: swarm (UD Dreadlord)                    [12-44-ID-ClickX/Y-TargetID]
            FB 00 0D 00 - use ability: dark ritual (UD Lich)                   [12-44-ID-ClickX/Y-TargetID]

            FD 00 0D 00 - use ability: death and decay (UD Lich ultimate)      [11-44-ID-ClickX/Y]
            FE 00 0D 00 - use ability: death coil (UD DeathKnight)             [12-44-ID-ClickX/Y-TargetID]
            FF 00 0D 00 - use ability: death pact (UD DeathKnight)             [12-44-ID-ClickX/Y-TargetID]
            00 01 0D 00 - use ability: Inferno (UD Dreadlord ultimate)         [11-44-ID-ClickX/Y]
            01 01 0D 00 - use ability: frost armor (UD Lich)                   [12-44-ID-ClickX/Y-TargetID]
            02 01 0D 00 - use ability: frost nova (UD Lich)                    [12-44-ID-ClickX/Y-TargetID]
            03 01 0D 00 - use ability: sleep (UD Dreadlord)                    [12-44-ID-ClickX/Y-TargetID]
            - - - - - -
            04 01 0D 00 - use ability: dark conversion (N Malganis)            [12-44-ID-ClickX/Y-TargetID]
            05 01 0D 00 - use ability: Dark portal (N Archimonde)              [11-44-ID-ClickX/Y]
            06 01 0D 00 - use ability: Finger of death (N Archimonde)          [12-44-ID-ClickX/Y-TargetID]
            07 01 0D 00 - use ability: Firebolt (N Warlock)                    [12-44-ID-ClickX/Y-TargetID]

(p1.07)   0E 01 0D 00 - use ability: Rain of Fire (Hero: Pit Lord)           [11-44-ID-ClickX/Y]
use ability: Chaos rain (Archimonde)                 [11-44-ID-ClickX/Y]
use ability: Fire rain (daemonic statue)             [11-44-ID-ClickX/Y]

            12 01 0D 00 - use ability: soul preservation (N Malganis)          [12-44-ID-ClickX/Y-TargetID]
            13 01 0D 00 - use ability: cold arrows (N Sylvana)                 [12-44-ID-ClickX/Y-TargetID]
            14 01 0D 00 - enable autocast: cold arrows (N Sylvana)             [10-42-ID]
            15 01 0D 00 - disable autocast: cold arrows (N Sylvana)            [10-42-ID]
            16 01 0D 00 - use ability: animate dead (N Satyr Hellcaller)       [10-40-ID]
            17 01 0D 00 - use ability: devour (N Storm Wyrm)                   [12-44-ID-ClickX/Y-TargetID]
            18 01 0D 00 - use ability: heal (N Troll Shadowpriest)             [12-44-ID-ClickX/Y-TargetID]
            19 01 0D 00 - enable autocast: heal (N Troll Shadowpriest)         [10-42-ID]
            1A 01 0D 00 - disable autocast: heal (N Troll Shadowpriest)        [10-42-ID]

            1C 01 0D 00 - use ability: creep storm bolt (N Stone Golem)        [12-44-ID-ClickX/Y-TargetID] [14- ]
            1D 01 0D 00 - use ability: creep thunder clap (N Granit Golem)     [10-40-ID]

(p1.07)   2E 01 0D 00 - use ability: reveal (HU Arcane Tower)                [11-]

            - - - - - -
            E9 01 0D 00 - enable autocast frost armor (UD Lich)                [10-42-ID] (added patch 1.03)

(<p1.07)   EA 01 0D 00 - disable autocast frost armor (UD Lich)               [10-42-ID] (added patch 1.03)
(p1.07)   EA 01 0D 00 - enable autocast frost armor (UD Lich)                [10-42-ID]
(p1.07)   EB 01 0D 00 - disable autocast frost armor (UD Lich)               [10- ]

all unitIDs below are introduced with patch 1.07:

            EE 01 0D 00 - revive first dead hero on tavern                     [12- ]
            EF 01 0D 00 - revive second dead hero on tavern                    [12- ]
            F0 01 0D 00 - revive third dead hero on tavern                     [12- ]
            F1 01 0D 00 - revive 4th dead hero on tavern                       [12- ]
            F2 01 0D 00 - revive 5th dead hero on tavern                       [12- ]

            - - - - - -
            F9 01 0D 00 - Cloud (HU dragonhawk rider)                          [11- ]
            FA 01 0D 00 - Control Magic (HU spell breaker)                     [12- ]

            00 02 0D 00 - Aerial Shackles (HU dragonhawk rider)                [12- ]

            03 02 0D 00 - Spell Steal (HU spell breaker)                       [12- ]
            04 02 0D 00 - enable autocast: Spell Steal (HU spell breaker)      [10- ]
            05 02 0D 00 - disable autocast: Spell Steal (HU spell breaker)     [10- ]
            06 02 0D 00 - Banish (HU blood mage)                               [12- ]
            07 02 0D 00 - Siphon Mana (HU blood mage / Dark Ranger)            [12- ]
            08 02 0D 00 - Flame Strike (HU blood mage)                         [11- ]
            09 02 0D 00 - Phoenix (HU blood mage ultimate)                     [10- ]
            - - - - - -
            0A 02 0D 00 - Ancestral Spirit (Orc spirit walker)                 [10- ]

            0D 02 0D 00 - transform to Corporeal Form (Orc spirit walker)      [10- ]
            0E 02 0D 00 - transform to Ethereal Form (Orc spirit walker)       [10- ]

            13 02 0D 00 - spirit link (Orc spirit walker)                      [12- ]
            14 02 0D 00 - Unstable Concoction (Orc troll batrider)             [12- ]
            15 02 0D 00 - Healing Wave (Orc shadow hunter)                     [12- ]
            16 02 0D 00 - Hex (Orc shadow hunter)                              [12- ]
            17 02 0D 00 - Big Bad Voodoo (Orc shadow hunter ultimate)          [10- ]
            18 02 0D 00 - Serpent Ward (Orc shadow hunter)                     [11- ]

            - - - - - -
            1C 02 0D 00 - build Hippogryph Rider (NE archer / hippogryph)      [10- ]
            1D 02 0D 00 - separate Archer (NE hippograph raider)               [10- ]

            1F 02 0D 00 - War Club (NE mountain giant)                         [12- ]
            20 02 0D 00 - Mana Flare (NE faerie dragon)                        [10- ]
            21 02 0D 00 - Mana Flare (NE faerie dragon)                        [10- ]
            22 02 0D 00 - Phase Shift (NE faerie dragon)                       [10- ]
            23 02 0D 00 - enable autocast: Phase Shift (NE faerie dragon)      [10- ]
            24 02 0D 00 - disable autocast: Phase Shift (NE faerie dragon)     [10- ]

            28 02 0D 00 - Taunt (NE mountain giant)                            [10- ]

            2A 02 0D 00 - enable autocast: Spirit of Vengeance (NE vengeance ultimate)  [10- ]
            2B 02 0D 00 - disable autocast: Spirit of Vengeance (NE vengeance ultimate) [10- ]
            2C 02 0D 00 - Spirit of Vengeance (NE vengeance ultimate)          [10- ]
            2D 02 0D 00 - Blink (NE warden)                                    [11- ]
            2E 02 0D 00 - Fan of Knives (NE warden)                            [10- ]
            2F 02 0D 00 - Shadow Strike (NE warden)                            [12- ]
            30 02 0D 00 - Vengeance (NE warden ultimate)                       [10- ]
            - - - - - -
            31 02 0D 00 - Absorb Mana (UD destroyer)                           [12- ]
            33 02 0D 00 - morph to Destroyer (UD obsidian statue)              [10- ]

            35 02 0D 00 - Burrow (UD crypt fiend / carrion beetle)             [10- ]
            36 02 0D 00 - Unburrow (UD crypt fiend / carrion beetle)           [10- ]

            38 02 0D 00 - Devour Magic (UD destroyer)                          [11- ]

            3B 02 0D 00 - Orb of Annihilation (UD destroyer)                   [12- ]
            3C 02 0D 00 - enable autocast: Orb of Annihilation (UD destroyer)  [10- ]
            3D 02 0D 00 - disable autocast: Orb of Annihilation (UD destroyer) [10- ]

            41 02 0D 00 - Essence of Blight (UD obsidian statue)               [10- ]
            42 02 0D 00 - enable autocast: Essence of Blight (UD obsidian statue)     [10- ]
            43 02 0D 00 - disable autocast: Essence of Blight (UD obsidian statue)    [10- ]
            44 02 0D 00 - Spirit Touch (UD obsidian statue)                    [10- ]
            45 02 0D 00 - enable autocast: Spirit Touch (UD obsidian statue)   [10- ]
            46 02 0D 00 - disable autocast: Spirit Touch (UD obsidian statue)  [10- ]

            48 02 0D 00 - enable autocast: Carrion Beetles (UD crypt lord)     [10- ]
            49 02 0D 00 - disable autocast: Carrion Beetles (UD crypt lord)    [10- ]
            4A 02 0D 00 - Carrion Beetle (UD crypt lord)                       [10- ]
            4B 02 0D 00 - Impale (UD crypt lord)                               [12- ]
            4C 02 0D 00 - Locust Swarm (UD crypt lord ultimate)                [10- ]

            - - - - - -
            51 02 0D 00 - Frenzy (beastmasters quilbeast)                      [10- ]
            52 02 0D 00 - enable autocast: Frenzy (beastmasters quilbeast)     [10- ]
            53 02 0D 00 - disable autocast: Frenzy (beastmasters quilbeast)    [10- ]

            - - - - - -
            56 02 0D 00 - Change Shop Buyer                                    [12- ]
            - - - - - -

            61 02 0D 00 - Black Arrow (Hero: Dark Ranger)                      [12- ]
            62 02 0D 00 - enable autocast: Black Arrow (Hero: Dark Ranger)     [10- ]
            63 02 0D 00 - disable autocast: Black Arrow (Hero: Dark Ranger)    [10- ]
            64 02 0D 00 - Breath of Fire (Hero: Pandaren Brewmaster)           [12- ]
            65 02 0D 00 - Charm (Hero: Dark Ranger ultimate)                   [12- ]

            67 02 0D 00 - Doom (Hero: Pit Lord ultimate)                       [12- ]

            69 02 0D 00 - Drunken Haze (Hero: Pandaren Brewmaster)             [12- ]
            6A 02 0D 00 - Storm, Earth and Fire (Hero: Pandaren ultimate)      [10- ]
            6B 02 0D 00 - Forked Lightning (Hero: Naga Sea Witch)              [12- ]
            6C 02 0D 00 - Howl of Terror (Hero: Pit Lord)                      [10- ]
            6D 02 0D 00 - Mana Shield (Hero: Naga Sea Witch)                   [10- ]
            6E 02 0D 00 - Mana Shield (Hero: Naga Sea Witch)                   [10- ]

            70 02 0D 00 - Silence (Hero: Dark Ranger)                          [11- ]
            71 02 0D 00 - Stampede (Hero: Beastmaster ultimate)                [12- ] [14- ]
            72 02 0D 00 - Summon Bear (Hero: Beastmaster)                      [10- ]
            73 02 0D 00 - Summon Quilbeast (Hero: Beastmaster)                 [10- ]
            74 02 0D 00 - Summon Hawk (Hero: Beastmaster)                      [10- ]
            75 02 0D 00 - Tornado (Hero: Naga Sea Witch ultimate)              [11- ]
            76 02 0D 00 - Summon Prawn (N Makrura Snapper)                     [10- ]

(p1.15)   AC 02 0D 00 - Cluster Rockets (Hero: Goblin Tinker)                [11- ]

(p1.15)   B0 02 0D 00 - Robo-Goblin (Hero: Goblin Tinker ultimate)           [10- ]
(p1.15)   B1 02 0D 00 - Revert to Tinker (Hero: Goblin Tinker)               [10- ]
(p1.15)   B2 02 0D 00 - Pocket Factory (Hero: Goblin Tinker)                 [11- ]

(p1.17)   B6 02 0D 00 - Acid Bomb (Hero: Goblin Alchemist)                   [12- ]
(p1.17)   B7 02 0D 00 - Chemical Rage (Hero: Goblin Alchemist)               [10- ]
(p1.17)   B8 02 0D 00 - Healing Spray (Hero: Goblin Alchemist)               [11- ]
(p1.17)   B9 02 0D 00 - Transmute (Hero: Goblin Alchemist)                   [10- ]

(p1.17)   BB 02 0D 00 - Summon Lava Spawn (Hero: Fire Lord)                  [10- ]
(p1.17)   BC 02 0D 00 - Soulburn (Hero: Fire Lord)                           [12- ]
(p1.17)   BD 02 0D 00 - Volcano (Hero: Fire Lord)                            [11- ]
(p1.18)   BE 02 0D 00 - Incinerate (Hero: Fire Lord)                         [10- ]
(p1.18)   BF 02 0D 00 - enable autocast: Incinerate (Hero: Fire Lord)        [10- ]
(p1.18)   C0 02 0D 00 - disable autocast: Incinerate (Hero: Fire Lord)       [10- ]

The following abilities are present in the world editor but cannot be used
in the game (and therefore the ItemID remains unknown):

    - Tank Load Pilot (HU) (game crashes)
    - Tank Drop Pilot (HU) (Msg: "no pilot present")
    - Pilot Tank (HU)      (Msg: "unit not a tank")

    - Gold2Lumber Exchange (disabled)
    - Lumber2Gold Exchange (disabled)

===============================================================================
5.0 Object ID's
===============================================================================

Every single object (units, heros, items, buildings, summons, even trees) in a
replay gets a unique number, the ObjectID. It is used as a reference to this
object in 'change selection' actions or for denoting target objects.
Warcraft generates the number probably just-in-time and (more or less)
upcounting.

One ObjectID consists of two doubleword numbers. Sometimes these numbers are
equal (probably for all objects that exist at the start of the game).

Notes:
o ObjectIDs are still an unsolved problem in replays.
(And will maybe never be solved in a usable way.
Maybe the new action 0x1A introduced with patch 1.14b can be used to get
some usable information out of the ObjectID's.)

Differenz der ObjectID1 der Startarbeiter:
Peasant: 0x16
Peon:    0x16
Wisp:    0x16
Aco:     0x19

Differenz ObjectID2 - ObjectID1

Team:Differenz

Replay:            | m100 | m107 | m106

Player Slot 1 - NE | | | 0:0x03
UD | 0:0x06 | |
HU | | 0:0x00 |
O | | |

Player Slot 2 - NE | 1:0x09 | 1:0x03 |
UD | | |
HU | | |
O | | | 1:0x03

Player Slot 3 - NE | 0:0x0C | 0:0x06 |
UD | | | 0:0x09
HU | | |
O | | |

Player Slot 4 - NE | | |
UD | 1:0x12 | 1:0x0C |
HU | | |
O | | | 1:0x09

===============================================================================
6.0 Click Coordinates
===============================================================================

Click coordinates are standard IEEE single precision floats (4 bytes)
corresponding to the coordinates in World Editor.

Notes:
o The center of the map has the coordinates (0,0).
//FIXME: its rather the center of map coordinate range

o The range of the coordinates depends on the size of the map and the
equivalent settings in the World Editor.

o Maximum range is -16384.000 to 16384.000 (256x256 maps).

o Buildings can only be placed on a discrete grid.
The grid step size is 64.00 Units per grid line.

===============================================================================
7.0 General notes
===============================================================================
o Patch 1.07 represents the retail version of the expansion pack
'The Frozen Throne' (TFT). It was immediatlely followed by a patch 1.10 that
brought both TFT and ROC to the same patch level. Actually both game
versions seem to use the improved TFT game engine.

o There are only user inputs in a replay. There are no computer actions, no
'training complete' data, no results of fights, no information about death
of units, etc..

o Most actions in the replay are right-click actions. The true actions they
are translated to by the game remain hidden.

o There are no special actions for build, skill, train etc.
There are only five basic actions for this task (0x10 - 0x14) that
differ in the number of arguments provided.
The true nature of the action is only detectable by the provided ItemID.

o Build actions that failed due to unsufficient resources are not saved
in the replay !

o There is no difference regarding action codes between a train action for a
single building and a train action for two or more buildings.
One cannot determine whether a unit is build in all of the selected
buildings or only in one. It depends on resources and food supply but is
not denoted in the replay.

o There are no notifications in the replay, if a player overrides a command
before it was executed (e.g. by giving the unit a new order while it is on
the way to execute an ability at a distant location/target).
Therefore for all actions 0x11-0x14 one cannot be sure whether the assigned
action was really executed.

o Changing map colors (friend/foe) is not recorded in replay.

o Selecting already selected units gives no additional actions in the replay!

o Day/night changes are not denoted in the replay data.

o Any field of view changes (e.g. click on minimap, 'space', 'ctrl-c')
are not saved in the replay.

o In replays of patch version <= 1.06 only chat messages that activate
map triggers are saved (action 0x60).

===============================================================================
8.0 Notes on older Patches
===============================================================================
Pre Patch 1.14b:
o Action 0x19 was used instead of action 0x1A.
o Action 0x1B - 0x1E were shifted down by one (0x1A - 0x1D).

Pre patch 1.13:
o AbilityFlag (action 0x10-0x14) was only a byte, instead of a word.
o Actions 0x10 - 0x14 were 1 byte shorter.

Pre patch 1.07:
o Chat text messages were not saved
o Actions 0x10 - 0x14 were 8 bytes shorter.
o Actions 0x62 used to be 4 bytes shorter.
o There was *one* action missing between 0x63 and 0x65 (the specific action
is still unknown). So all following actions were shifted by one.

Pre patch 1.03:
o (TODO)

Frozen Throne Beta Replays:
o (not investigated)

===============================================================================
9.0 Credits
===============================================================================

We like to thank the following people for their help on decoding the
W3G action format (in alphabetical order):

o Jca for

- inspiration by publishing w3chart and bwchart

o Julas for

- help on changes in patch 1.13, 1.17
- hint on correct interpretation of 0x19/0x1a select subgroup command
- many other hints and comments

o JemHadar for

- info on changed size of Abilityflags in 1.13

o Kliegs for

- hosting a CVS for replay format related documents

o LeoLeal for

- investigations on patches 1.17

o Mike for

- finding the meaning of action 0x1C
- finding upshifted actions 0x1B-0x1E in patch 1.14b
- documenting new action 0x1A in patch 1.14b

o Pr1v for

- documenting actions 0x1A and 0x75

o ShadowFlare for

- WinMPQ
- hosting the developer forum

o Soar

- hint on additional dword in action 0x62
- hint on correct interpretation of 0x19/0x1a select subgroup command

o Ziutek for

- Total Commander MPQ plugin

We like to thank the following people for their help on working out the
APM standard (in alphabetical order again):

o kackn00b
o LeoLeal
o Mike
o MrO
o Pr1v
o Soar

If we forgot to mention someone here, please let us know.
We are only human too :D

===============================================================================
10.0 Document revision history
===============================================================================

o general notes

+ information added

- information changed

version 1.01 (2006-03-25)
-------------------------
2006-03-25: - updated urls in file header

version 1.00 (2005-04-30)
-------------------------
2005-04-30: o finally tagged this an 1.xx version (yeah!)
2005-04-30: - updated credits (did we forget someone?)
2005-04-26: - did some additions and fixes on the new heros (numeric IDs)
(thx LeoLeal, Julas)
2005-04-26: + added numeric IDs for autocast Incinerate (patch 1.18)
2005-04-26: - huge fix on 0x19/0x1a select subgroup command
(thanks to Soar and Julas once again)


version 0.98 (2004-10-02) (internal)
-------------------------
2004-10-02: + added new heros introduced with patch 1.17 (thx Soar)
2004-04-20: + added 'Goblin Tinker' abilities


version 0.97 (2004-01-18)
-------------------------
2004-01-28: - some minor additions and corrections.
2004-01-17: + added notes on patch 1.14b in section 8
2004-01-17: - changed action 0x1B-0x1E for patch 1.14b
2004-01-17: + added new action 0x1A (SelectSubgroup) for patch 1.14b


version 0.96 (2004-01-02)
-------------------------
2004-01-02: o release candidate 5
2004-01-01: - changed APM algorithm for action 0x19 (SelectSubgroup)
2004-01-01: + added patch 1.13 related note in action 0x19 (SelectSubgroup)
2003-12-27: + added actions 0x1A and 0x75
2003-12-25: + added notes on patch 1.13 in section 8
2003-12-20: + added some more credits
2003-12-18: + added more information on changed AbilityFlags value.
2003-12-18: + added new (1.13) action 0x1C
2003-12-17: - changed Abilityflags from 'byte' to 'word' for patch 1.13+
2003-12-15: - fixed developer forum URL in header


version 0.95 (2003-12-14)
-------------------------
2003-12-14: o release candidate 4
2003-12-14: - various minor tweaks
2003-12-06: - replaced term 'command' with term 'action' in many places.
2003-12-06: - more differentiated use of the term 'select' in various places.
2003-12-06: - renamed action 0x16 from 'Select' to 'Change Selection'.
2003-12-06: - fixed various minor typos and grammar mistakes.
2003-12-05: - changed APM algorithm for action 0x16


version 0.94 (2003-12-02)
-------------------------
2003-12-02: o release candidate 3
2003-12-02: - killed a lot of trailing spaces
2003-11-11: - fixed typos and grammar at various places
2003-10-30: + added section and notes about standardized APM
2003-09-27: - changed note on Pause action
2003-09-27: - changed note on ContinueGame action


version 0.93 (2003-09-20)
-------------------------
o release candidate 2
o various layout improvements

+ added coordinate information
+ added ObjectID information
+ added ItemID for 'abort divine shield'
+ added ItemID for manual use of 'Spell Steal'
+ added ItemID for 'reveal (Human arcane tower)'
+ added continue game block description

- fixed parameter of action 0x3E (cheat 'daylightsavings')
- fixed some errors in description of action 0x50 (ally options)
- changed section 1 - Introduction
- changed section 5 - ItemID
- various minor fixes and updates

version 0.92 (2003-07-22)
-------------------------
o release candidate 1

+ added actions for single player cheats
+ added data dword for action 0x62 (thx Soar)
+ added some additional notes to disclaimer
+ added many/most TFT unitIDs

- fixed typo with size of action 0x11
- fixed size of action 0x62 (changed in 1.07)
- renamed mostly all 'patch 1.10' to 'patch 1.07',
  because first TFT release was 1.07 and the replays had the same structure
  as in 1.10
  o some minor layout changes

version 0.91 (2003-07-14)
-------------------------
o fixed size bug of action 0x11 (thx to A. Chaschev)


version 0.90 (2003-06-29)
-------------------------
o internal beta for release version

===============================================================================
Test this !
===============================================================================

Following are some internal notes for further research (partly german - sorry).

- more menu options
- 'CTRL' key option in game options menu
- 0x14 command - double rightclick ?
- AbilityFlags weiter untersuchen

Add this:

- APM testsuite + logo

===============================================================================
End of File
===============================================================================