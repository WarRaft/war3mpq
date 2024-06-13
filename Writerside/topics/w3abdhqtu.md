# w3abdhqtu

- [war3map(skin).w3* Modifications](https://github.com/stijnherfst/HiveWE/wiki/war3map(skin).w3%2A-Modifications)

| Расширение | Тип           | Данные                     | Типы данных                                | OPTIONAL |
|------------|---------------|----------------------------|--------------------------------------------|----------|
| .w3a       | Abilities     | Units\AbilityData.slk      | Units\AbilityMetaData.slk                  | ✅        |
| .w3b       | Destructables | Units\DestructableData.slk | Units\DestructableMetaData.slk             |          |
| .w3d       | Doodads       | Doodads\Doodads.slk        | Doodads\DoodadMetaData.slk                 | ✅        |
| .w3h       | Buffs         | Units\AbilityBuffData.slk  | Units\AbilityBuffMetaData.slk              |          |
| .w3q       | Upgrades      | Units\UpgradeData.slk      | Units\UpgradeMetaData.slk                  | ✅        |
| .w3t       | Items         | Units\ItemData.slk         | Units\UnitMetaData.slk (where useItem = 1) |          |
| .w3u       | Units         | Units\UnitData.slk         | Units\UnitMetaData.slk                     |          |

```C++
Items {
    uint32le version
    uint32le defaultCount
    Item[defaultCount]
    uint32le modifiedCount
    Item[modifiedCount]
}

Item {
    uint32be original
	uint32be modified

	if (version >= 3) {
		uint32le count
	} else {
	    count = 1
	}
	
	Set[count]
}

Set {
    if (version >= 3) {
        uint32be flag
    }
    uint32le count
    Mod[count]   
}

Mod {
    uint32be modification
    uint32le type
    
    if (OPTIONAL) { 
        uint32le level
        uint32le data
    }
    
    if (type == 0) {
        uint32 value
    }
    
    if (type == 1 || type == 2) {
        float value
    }
    
    if (type == 3) {
        string	value
    }
    
    uint32be end
}

```