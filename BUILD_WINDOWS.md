# BUILD WINDOWS - GATO QUEST

## Prerrequisitos

Asegúrate de tener instalado:
- **Node.js** v16 o superior
- **npm** (incluido con Node.js)

## Generar .exe para Windows x64

### Opción 1: Usando el script predefinido (RECOMENDADO)

```bash
cd c:\Users\pranz\Escritorio\gatoquest-kaboom
npm run package
```

El .exe estará en: `GatoQuest-win32-x64\GatoQuest.exe`

### Opción 2: Comando manual

```bash
cd c:\Users\pranz\Escritorio\gatoquest-kaboom
npx electron-packager . GatoQuest --platform=win32 --arch=x64 --overwrite
```

### Opción 3: Desde cero (si no existe package.json)

1. Instalar dependencias:
```bash
npm install kaboom@3000.1.17 --save
npm install electron@28.0.0 electron-packager@17.1.2 --save-dev
```

2. Empaquetar:
```bash
npm run package
```

## Probar en el Navegador (sin compilar)

1. Instalar servidor local:
```bash
npx serve .
```

2. Abrir en navegador: `http://localhost:3000`

3. **Alternativamente**, simplemente abre `index.html` directamente en Chrome/Edge (puede haber limitaciones de audio en archivos locales).

## Ubicación del Build

Después de ejecutar `npm run package`, el ejecutable estará en:

```
c:\Users\pranz\Escritorio\gatoquest-kaboom\GatoQuest-win32-x64\GatoQuest.exe
```

## Contenido del Build

El directorio `GatoQuest-win32-x64` contiene:
- `GatoQuest.exe` - Ejecutable principal
- `resources/` - Assets del juego (sprites, sounds, game.js)
- Archivos de Electron framework

## Distribución

Para distribuir el juego:

1. **Comprime** el directorio completo `GatoQuest-win32-x64` en un .zip
2. **Envía** el .zip al usuario final
3. El usuario solo necesita extraer y ejecutar `GatoQuest.exe`

**NO** se requiere instalación de Node.js ni navegador para el usuario final.

## Solución de Problemas

### Error: "EBUSY: resource busy or locked"
- Cierra todas las instancias de `GatoQuest.exe` o Electron
- Ejecuta: `taskkill /F /IM electron.exe`
- Vuelve a intentar el build

### Error: "Module not found"
- Ejecuta: `npm install`
- Verifica que `package.json` existe

### El juego no abre
- Verifica que todas las carpetas `/sprites/` y `/sounds/` existen
- Revisa que `game.js` y `index.html` están en la raíz

### Audio no funciona en navegador
- Normal en archivos locales
- Usa `npx serve .` para servidor local
- O usa el .exe (funciona siempre)

## Archivos Requeridos

Estructura mínima para build exitoso:

```
gatoquest-kaboom/
├── game.js           (código principal)
├── index.html        (HTML base)
├── package.json      (config npm)
├── main.js           (Electron entry, opcional)
├── sprites/          (35 archivos .png)
│   ├── gato.png
│   ├── boss_*.png
│   ├── ...
└── sounds/           (3 archivos .mp3)
    ├── music_boss.mp3
    ├── musicgame.mp3
    └── finalsong.mp3
```

## Comandos Rápidos

```bash
# Build completo
npm run package

# Limpiar build anterior
rmdir /s /q GatoQuest-win32-x64

# Test en navegador
npx serve .

# Ver procesos Electron
tasklist | findstr electron
```

## Información del Build

- Platform: Windows x64
- Electron Version: v28.3.3
- Kaboom Version: v3000.1.17
- Build Time: ~30 segundos
- Size: ~150 MB (con Electron framework)

---

**Última actualización:** 2025-12-11  
**Autor:** Paz Molina - Duoc UC
