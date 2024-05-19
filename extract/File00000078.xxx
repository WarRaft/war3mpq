//============================================================================
// OrcVsOrc

//***************************************************************************
//*
//*  Global Variables
//*
//***************************************************************************

globals
	trigger morningbegintrigger = null
	trigger nightbegintrigger = null
	trigger morningendtrigger = null
	trigger nightendtrigger = null

	integer musicVolume = 127
	integer stopMusicFadeOut = 0
	integer morningstart = 0
	integer morningend = 1
	integer nightstart = 2
	integer nightend = 3
endglobals

function InitGlobals takes nothing returns nothing
endfunction

//***************************************************************************
//*
//*  Destructable Objects
//*
//***************************************************************************

function CreateAllDestructables takes nothing returns nothing
endfunction

//***************************************************************************
//*
//*  Items
//*
//***************************************************************************

function CreateAllItems takes nothing returns nothing
endfunction

//***************************************************************************
//*
//*  Unit Items
//*
//***************************************************************************


//***************************************************************************
//*
//*  Unit Creation
//*
//***************************************************************************

//===========================================================================
function CreateUnitsForPlayer0 takes nothing returns nothing
    local player p = Player(0)
    local unit u
    local trigger t
    local real life

endfunction

//===========================================================================
function CreateUnitsForPlayer1 takes nothing returns nothing
    local player p = Player(1)
    local unit u
    local trigger t
    local real life

endfunction

//===========================================================================
function CreateNeutralPassive takes nothing returns nothing
    local player p = Player(PLAYER_NEUTRAL_PASSIVE)
    local unit u
    local trigger t
    local real life

    set u = CreateUnit( p, 'ngol', 3000.0, 3000.0, 270 )
    call SetResourceAmount( u, 7500 )
    set u = CreateUnit( p, 'ngol', 7200.0, 7200.0, 270 )
    call SetResourceAmount( u, 7500 )
endfunction

//===========================================================================
function CreatePlayerUnits takes nothing returns nothing
    call CreateUnitsForPlayer0(  )
    call CreateUnitsForPlayer1(  )
endfunction

//===========================================================================
function CreateNeutralUnits takes nothing returns nothing
    call CreateNeutralPassive(  )
endfunction

//***************************************************************************
//*
//*  Triggers
//*
//***************************************************************************

//===========================================================================
function TriggerResponseGlueSound takes nothing returns nothing
	call DisplayTextToPlayer(Player(0), 0, 0, "Playing glue music")
	call PlayMusic("GlueMusic")
endfunction

//===========================================================================
function TriggerResponseGameSound takes nothing returns nothing
	call DisplayTextToPlayer(Player(0), 0, 0, "Playing game music")
	call PlayMusic("Music")
endfunction

//===========================================================================
function TriggerResponseIncreaseVolume takes nothing returns nothing
	call DisplayTextToPlayer(Player(0), 0, 0, "Increasing music volume")
	set musicVolume = musicVolume + 32
	call SetMusicVolume(musicVolume)
endfunction

//===========================================================================
function TriggerResponseLowerMusicVolumeGroup takes nothing returns nothing
	call DisplayTextToPlayer(Player(0), 0, 0, "Lowering Music Volume Group Volume")
	call VolumeGroupSetVolume(SOUND_VOLUMEGROUP_MUSIC,0.5)
endfunction

//===========================================================================
function TriggerResponseLowerUnitVolumeGroup takes nothing returns nothing
	call DisplayTextToPlayer(Player(0), 0, 0, "Lowering Unit Volume Group Volume")
	call VolumeGroupSetVolume(SOUND_VOLUMEGROUP_UNITSOUNDS,0.5)
endfunction

//===========================================================================
function TriggerResponseResetVolumeGroups takes nothing returns nothing
	call DisplayTextToPlayer(Player(0), 0, 0, "Resetting Volume Groups")
	call VolumeGroupReset()
endfunction

//===========================================================================
function MorningBeginTriggerResponse takes nothing returns nothing
	call DisplayTextToPlayer(Player(0),0,0,"morning start")
endfunction

//===========================================================================
function NightBeginTriggerResponse takes nothing returns nothing
	call DisplayTextToPlayer(Player(0),0,0,"night start")
endfunction

//===========================================================================
function MorningEndTriggerResponse takes nothing returns nothing
	call DisplayTextToPlayer(Player(0),0,0,"morning end")
endfunction

//===========================================================================
function NightEndTriggerResponse takes nothing returns nothing
	call DisplayTextToPlayer(Player(0),0,0,"night end")
endfunction

//===========================================================================
function InitCustomTriggers takes nothing returns nothing
    local player player0 = Player(0)
    local trigger trig
	local integer duration = 0

	local unit unitGlueSound = CreateUnit		(player0, 'hfoo',	1600,	1600,	0)
	local unit unitGameSound = CreateUnit		(player0, 'hfoo',	1800,	1600,	0)
	local unit unitIncreaseVolume = CreateUnit	(player0, 'hfoo',	1600,	1800,	0)

	local unit unitLowerMusicVolumeGroup = CreateUnit	(player0, 'hfoo',	1800,	1800,	0)
	local unit unitLowerUnitVolumeGroup = CreateUnit		(player0, 'hfoo',   1600,	2000,	0)
	local unit unitResetVolumeGroups = CreateUnit		(player0, 'hfoo',   1800,	2000,	0)

    // Create Default Melee Starting Units
    call MeleeStartingUnits()

    // Mucho Moneys
    call SetPlayerState( Player(0), PLAYER_STATE_RESOURCE_GOLD,       100000 )
    call SetPlayerState( Player(0), PLAYER_STATE_RESOURCE_FOOD_CAP,      100 )
    call SetPlayerState( Player(0), PLAYER_STATE_RESOURCE_LUMBER,      10000 )
    call SetPlayerState( Player(1), PLAYER_STATE_RESOURCE_GOLD,       100000 )
    call SetPlayerState( Player(1), PLAYER_STATE_RESOURCE_FOOD_CAP,      100 )
    call SetPlayerState( Player(1), PLAYER_STATE_RESOURCE_LUMBER,      10000 )

    // Sound debug triggers

	set duration = GetSoundFileDuration("intro.mp3")

	set morningbegintrigger = CreateTrigger()
	set nightbegintrigger = CreateTrigger()
	set morningendtrigger = CreateTrigger()
	set nightendtrigger = CreateTrigger()
	
	call TriggerRegisterGameStateEvent(morningbegintrigger,GAME_STATE_TIME_OF_DAY,EQUAL,6)
	call TriggerRegisterGameStateEvent(morningendtrigger,GAME_STATE_TIME_OF_DAY,EQUAL,19)
	call TriggerRegisterGameStateEvent(nightbegintrigger,GAME_STATE_TIME_OF_DAY,EQUAL,21)
	call TriggerRegisterGameStateEvent(nightendtrigger,GAME_STATE_TIME_OF_DAY,EQUAL,5)

	call TriggerAddAction(morningbegintrigger,function MorningBeginTriggerResponse)
	call TriggerAddAction(morningendtrigger,function MorningEndTriggerResponse)
	call TriggerAddAction(nightbegintrigger,function NightBeginTriggerResponse)
	call TriggerAddAction(nightendtrigger,function NightEndTriggerResponse)

	set trig = CreateTrigger()
	call TriggerRegisterUnitEvent(trig,unitGlueSound,EVENT_UNIT_SELECTED)
	call TriggerAddAction(trig,function TriggerResponseGlueSound)

	set trig = CreateTrigger()
	call TriggerRegisterUnitEvent(trig,unitGameSound,EVENT_UNIT_SELECTED)
	call TriggerAddAction(trig,function TriggerResponseGameSound)

	set trig = CreateTrigger()
	call TriggerRegisterUnitEvent(trig,unitIncreaseVolume,EVENT_UNIT_SELECTED)
	call TriggerAddAction(trig,function TriggerResponseIncreaseVolume)

	set trig = CreateTrigger()
	call TriggerRegisterUnitEvent(trig,unitLowerMusicVolumeGroup,EVENT_UNIT_SELECTED)
	call TriggerAddAction(trig,function TriggerResponseLowerMusicVolumeGroup)

	set trig = CreateTrigger()
	call TriggerRegisterUnitEvent(trig,unitLowerUnitVolumeGroup,EVENT_UNIT_SELECTED)
	call TriggerAddAction(trig,function TriggerResponseLowerUnitVolumeGroup)

	set trig = CreateTrigger()
	call TriggerRegisterUnitEvent(trig,unitResetVolumeGroups,EVENT_UNIT_SELECTED)
	call TriggerAddAction(trig,function TriggerResponseResetVolumeGroups)
endfunction

//===========================================================================
function RunInitializationTriggers takes nothing returns nothing
endfunction

//***************************************************************************
//*
//*  Players
//*
//***************************************************************************

function InitCustomPlayerSlots takes nothing returns nothing

    // Player 0
    call SetPlayerStartLocation( Player(0), 0 )
    call ForcePlayerStartLocation( Player(0), 0 )
    call SetPlayerColor( Player(0), ConvertPlayerColor(0) )
    call SetPlayerRacePreference( Player(0), RACE_PREF_ORC )
    call SetPlayerRaceSelectable( Player(0), true )
    call SetPlayerController( Player(0), MAP_CONTROL_USER )

    // Player 1
    call SetPlayerStartLocation( Player(1), 1 )
    call ForcePlayerStartLocation( Player(1), 1 )
    call SetPlayerColor( Player(1), ConvertPlayerColor(1) )
    call SetPlayerRacePreference( Player(1), RACE_PREF_HUMAN )
    call SetPlayerRaceSelectable( Player(1), true )
    call SetPlayerController( Player(1), MAP_CONTROL_COMPUTER )

endfunction

function InitCustomTeams takes nothing returns nothing
    // Force: Force 1
    call SetPlayerTeam( Player(0), 0 )

    // Force: Force 2
    call SetPlayerTeam( Player(1), 1 )

endfunction

//***************************************************************************
//*
//*  Main Initialization
//*
//***************************************************************************

//===========================================================================
function main takes nothing returns nothing
    call SetCameraBounds( 768.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 512.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 9472.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 9216.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 768.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 9216.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 9472.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 512.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM) )
    call SetDayNightModels( "Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl" )
    call SetAmbientDaySound( "LordaeronSummerDay" )
    call SetAmbientNightSound( "LordaeronSummerNight" )
    call SetMapMusic( "Music", true, 0 )
    call CreateNeutralUnits(  )
    call CreatePlayerUnits(  )
    call InitBlizzard(  )
    call InitGlobals(  )
    call InitCustomTriggers(  )
    call RunInitializationTriggers(  )

endfunction

//***************************************************************************
//*
//*  Map Configuration
//*
//***************************************************************************

function config takes nothing returns nothing
    call SetMapName( "TRIGSTR_000" )
    call SetMapDescription( "TRIGSTR_002" )
    call SetPlayers( 2 )
    call SetTeams( 2 )
    call SetGamePlacement( MAP_PLACEMENT_USE_MAP_SETTINGS )

    call DefineStartLocation( 0, 3840.0, 3072.0 )
    call DefineStartLocation( 1, 6400.0, 7168.0 )

    // Player setup
    call InitCustomPlayerSlots(  )
    call InitCustomTeams(  )
endfunction

