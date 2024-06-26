package raft.war.binary.parser.data

val DestructableMetaData : HashMap<String, MetaData> = hashMapOf(
	"barm" to MetaData("armor", "Armor Type", "armorType", 0),
	"bbut" to MetaData("buildTime", "Build Time", "int", 0),
	"bcat" to MetaData("category", "Category", "destructableCategory", 0),
	"bclh" to MetaData("cliffHeight", "Cliff Height", "int", 0),
	"bcpd" to MetaData("canPlaceDead", "Show Dead Version in Palette", "bool", 0),
	"bcpr" to MetaData("canPlaceRandScale", "Can Place Random Scale", "bool", 0),
	"bdsn" to MetaData("deathSnd", "Death", "soundLabel", 0),
	"bfil" to MetaData("file", "Model File", "model", 0),
	"bflh" to MetaData("flyH", "Fly-Over Height", "unreal", 0),
	"bflo" to MetaData("fatLOS", "Fat Line of Sight", "bool", 0),
	"bfra" to MetaData("fogRadius", "Fog Radius", "unreal", 0),
	"bfvi" to MetaData("fogVis", "Fog Visibility", "bool", 0),
	"bfxr" to MetaData("fixedRot", "Fixed Rotation", "unreal", 0),
	"bgpm" to MetaData("portraitmodel", "Model File - Portrait", "model", 0),
	"bgsc" to MetaData("selcircsize", "Selection Size - Game", "real", 0),
	"bgse" to MetaData("selectable", "Selectable In Game", "bool", 0),
	"bhps" to MetaData("HP", "Hit Points", "unreal", 0),
	"blit" to MetaData("lightweight", "Model File - Has Lightweight Model", "bool", 0),
	"bmap" to MetaData("maxPitch", "Maximum Pitch Angle (degrees)", "unreal", 0),
	"bmar" to MetaData("maxRoll", "Max Roll Angle (degrees)", "unreal", 0),
	"bmas" to MetaData("maxScale", "Maximum Scale", "unreal", 0),
	"bmis" to MetaData("minScale", "Minimum Scale", "unreal", 0),
	"bmmb" to MetaData("MMBlue", "Minimap Color 3 (Blue)", "int", 0),
	"bmmg" to MetaData("MMGreen", "Minimap Color 2 (Green)", "int", 0),
	"bmmr" to MetaData("MMRed", "Minimap Color 1 (Red)", "int", 0),
	"bnam" to MetaData("Name", "Name", "string", 0),
	"boch" to MetaData("occH", "Occlusion Height", "unreal", 0),
	"bonc" to MetaData("onCliffs", "Placeable on Cliffs", "bool", 0),
	"bonw" to MetaData("onWater", "Placeable on Water", "bool", 0),
	"bptd" to MetaData("pathTexDeath", "Pathing Texture (Dead)", "pathingTexture", 0),
	"bptx" to MetaData("pathTex", "Pathing Texture", "pathingTexture", 0),
	"brad" to MetaData("radius", "Elevation Sample Radius", "unreal", 0),
	"breg" to MetaData("goldRep", "Repair Gold Cost", "int", 0),
	"brel" to MetaData("lumberRep", "Repair Lumber Cost", "int", 0),
	"bret" to MetaData("repairTime", "Repair Time", "int", 0),
	"bsel" to MetaData("selSize", "Selection Size - Editor", "unreal", 0),
	"bshd" to MetaData("shadow", "Shadow", "shadowTexture", 0),
	"bsmm" to MetaData("showInMM", "Minimap - Show", "bool", 0),
	"bsuf" to MetaData("EditorSuffix", "Editor Suffix", "string", 0),
	"btar" to MetaData("targType", "Targeted As", "targetList", 0),
	"btil" to MetaData("tilesets", "Tilesets", "tilesetList", 0),
	"btsp" to MetaData("tilesetSpecific", "Has Tileset Specific Data", "bool", 0),
	"btxf" to MetaData("texFile", "Replaceable Texture File", "texture", 0),
	"btxi" to MetaData("texID", "Replaceable Texture ID", "int", 0),
	"buch" to MetaData("useClickHelper", "Show Helper Object for Selection", "bool", 0),
	"bumm" to MetaData("useMMColor", "Minimap - Use Custom Color", "bool", 0),
	"busr" to MetaData("UserList", "On User-Specified List", "bool", 0),
	"bvar" to MetaData("numVar", "Model File - Variations", "int", 0),
	"bvcb" to MetaData("colorB", "Tinting Color 3 (Blue)", "int", 0),
	"bvcg" to MetaData("colorG", "Tinting Color 2 (Green)", "int", 0),
	"bvcr" to MetaData("colorR", "Tinting Color 1 (Red)", "int", 0),
	"bwal" to MetaData("walkable", "Is Walkable", "bool", 0),
)