# imp

Информация о импорте.

> Файл `war3map.imp` необходим только для редактора.

```C++
Imports {
    uint32le format // 0 - ROC
                    // 1 - TFT
    uint32le count
    Item[count]     
}

Item {
    if (format == 1) {
        uint8BE flags 
    }
    string path
}

```

## Флаги {id="flag"}

<table style="none">
<tr><td rowspan="2"><code>0x01</code></td><td><code>0</code></td><td>Нужно будет из пути извлечь только имя файла и дописать <code>war3mapImported\</code></td></tr>
<tr><td><code>1</code></td><td>Будет отображаться полный путь импортированного файла (т.е нестандартный)</td></tr>

<tr><td rowspan="2"><code>0x02</code></td><td><code>0</code></td><td>Ничего не значит</td></tr>
<tr><td><code>1</code></td><td>Пункт <code>byte</code> и <code>string</code> обнуляются при чтении</td></tr>

<tr><td><code>0x04</code></td><td colspan="2">Неизвестно (можно игнорировать)</td></tr>
<tr><td><code>0x08</code></td><td colspan="2">Неизвестно (можно игнорировать)</td></tr>
<tr><td><code>0x10</code></td><td colspan="2">Неизвестно (можно игнорировать)</td></tr>
</table>
