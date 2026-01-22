# 🎵 Sonic Bot

Bot multifuncional de Discord con funcionalidades de música, moderación e información. Desarrollado con Discord.js v14 y NodeLink para reproducción de audio de alta calidad.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord.js](https://img.shields.io/badge/discord.js-v14.21.0-blue.svg)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/node.js-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

## 📋 Características

### 🎧 Música
- **Reproducción de audio** con NodeLink y Moonlink.js
- Soporte para múltiples plataformas (Deezer, Spotify, SoundCloud, Twitch)
- **Fallback inteligente:** Links de Spotify/YouTube se resuelven automáticamente a Deezer
- Control de reproducción (play, pause, resume, skip, stop)
- Sistema de colas con shuffle
- Control de volumen
- Modo loop/repetición
- Desconexión automática por inactividad (30 segundos)

### 🛡️ Moderación
- Sistema de advertencias (warn/unwarn/warnings)
- Kick y mute de usuarios
- Sistema de sorteos (giveaways)
- Transcripciones HTML de conversaciones

### ℹ️ Información
- Comando de ayuda
- Comando de ping/latencia

## 🚀 Instalación

### Requisitos Previos

- **Node.js** v16.0.0 o superior
- **Bun** (runtime alternativo, opcional pero recomendado)
- **MongoDB** (para almacenamiento de datos)
- **NodeLink** (servidor de audio - reemplazo de Lavalink)
- **Git** (opcional, para clonar el repositorio)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/lukitaz-r/sonic-bot.git
cd sonic-bot
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar archivos de configuración**

#### a) Configuración del Bot (`config/config.json`)
Copia el archivo de ejemplo y configúralo:
```bash
cp config/config.example.json config/config.json
```

Edita `config/config.json` con tus credenciales:
```json
{
  "token": "TU_TOKEN_DE_DISCORD",
  "mongodb": "TU_URI_DE_MONGODB",
  "prefix": "so!",
  "color": "Blurple",
  "greetings": [
    "Hola, pon ?help para ver mis comandos! 🚀",
    "Holaaa!"
  ],
  "lavalink": {
    "host": "localhost",
    "port": 2333,
    "password": "youshallnotpass",
    "secure": false
  },
  "opcionales": {
    "apiAI": false,
    "vipRoles": []
  }
}
```

**Campos requeridos:**
- `token`: Token de tu bot de Discord (obtenerlo en [Discord Developer Portal](https://discord.com/developers/applications))
- `mongodb`: URI de conexión a MongoDB (ejemplo: `mongodb://localhost:27017/sonicbot` o MongoDB Atlas)
- `lavalink.host`: Host de tu servidor Lavalink (por defecto: `localhost`)
- `lavalink.password`: Contraseña configurada en `application.yml`

#### b) Configuración de NodeLink

NodeLink es el servidor de audio que reemplaza a Lavalink. Descarga o clona NodeLink desde [PerformanC/NodeLink](https://github.com/PerformanC/NodeLink).

Configura el archivo `config.json` de NodeLink con:
- Credenciales de Spotify (clientId, clientSecret)
- ARL de Deezer (para streaming)
- Puerto y contraseña (deben coincidir con `config/config.json`)

> **Nota:** NodeLink no requiere Java, usa Node.js/Bun directamente.

4. **Configurar intents del bot**

Ve al [Discord Developer Portal](https://discord.com/developers/applications) y habilita los siguientes **Privileged Gateway Intents**:
- ✅ Server Members Intent
- ✅ Message Content Intent
- ✅ Presence Intent (opcional)

## ▶️ Ejecución

### 1. Iniciar NodeLink

En una terminal separada, ejecuta desde el directorio de NodeLink:
```bash
bun run start
# o
node src/index.js
```

Espera a ver los mensajes de las fuentes cargadas (Spotify, Deezer, SoundCloud).

### 2. Iniciar el Bot

En otra terminal:
```bash
npm start
# o con bun
bun run test
```

Si todo está configurado correctamente, verás:
```
Node sonicbot connected
```

## 📦 Estructura del Proyecto

```
sonic-bot/
├── commands/           # Comandos del bot
│   ├── Info/          # Comandos de información
│   ├── Moderacion/    # Comandos de moderación
│   └── Musica/        # Comandos de música
├── config/            # Archivos de configuración
│   └── config.json    # Configuración principal (no incluido en Git)
├── events/            # Manejadores de eventos
│   ├── client/        # Eventos del cliente
│   └── server/        # Eventos del servidor
├── handlers/          # Cargadores de comandos y eventos
├── models/            # Modelos de MongoDB
├── plugins/           # (Deprecated - NodeLink no usa plugins)
├── utils/             # Utilidades y funciones auxiliares
├── logs/              # Archivos de log (generados automáticamente)
├── jsconfig.json      # Configuración de JavaScript para autocompletado
├── index.js           # Punto de entrada principal
└── package.json       # Dependencias y scripts
```

## 🎮 Comandos Disponibles

### Música
- `so!play <canción/URL>` - Reproduce una canción
- `so!pause` - Pausa la reproducción
- `so!resume` - Reanuda la reproducción
- `so!skip` - Salta a la siguiente canción
- `so!stop` - Detiene la reproducción y limpia la cola
- `so!queue` - Muestra la cola de reproducción
- `so!volume <0-100>` - Ajusta el volumen
- `so!loop` - Activa/desactiva el modo repetición
- `so!shuffle` - Mezcla la cola de reproducción

### Moderación
- `so!kick <usuario> [razón]` - Expulsa a un usuario
- `so!mute <usuario> [tiempo] [razón]` - Silencia a un usuario
- `so!unmute <usuario>` - Quita el silencio a un usuario
- `so!warn <usuario> <razón>` - Advierte a un usuario
- `so!unwarn <usuario> <ID>` - Elimina una advertencia
- `so!warnings <usuario>` - Muestra las advertencias de un usuario
- `so!sorteos` - Gestiona sorteos

### Información
- `so!help` - Muestra la lista de comandos
- `so!ping` - Muestra la latencia del bot

> **Nota:** El prefijo por defecto es `so!` pero puede cambiarse en `config/config.json`

## 🔧 Dependencias Principales

- **[discord.js](https://discord.js.org/)** (v14.21.0) - Librería para interactuar con la API de Discord
- **[moonlink.js](https://www.npmjs.com/package/moonlink.js)** (v4.60.21) - Cliente de NodeLink/Lavalink para Node.js
- **[mongoose](https://mongoosejs.com/)** (v8.16.4) - ODM para MongoDB
- **[discord-giveaways](https://www.npmjs.com/package/discord-giveaways)** (v6.0.1) - Sistema de sorteos
- **[discord-html-transcripts](https://www.npmjs.com/package/discord-html-transcripts)** (v3.2.0) - Generador de transcripciones
- **[colors](https://www.npmjs.com/package/colors)** (v1.4.0) - Colores para la consola

## 🔐 Archivos Ignorados (.gitignore)

Los siguientes archivos **NO** se incluyen en el repositorio por seguridad y deben ser configurados manualmente:

- `config/config.json` - Contiene tokens y credenciales sensibles
- `bun.lock` - Archivo de lock de Bun
- `node_modules/` - Dependencias (se instalan con `npm install`)
- `logs/` - Archivos de registro
- `.env` - Variables de entorno

**Archivos de ejemplo incluidos:**
- ✅ `config/config.example.json`

## 🐛 Solución de Problemas

### El bot no se conecta a Discord
- Verifica que el token en `config/config.json` sea correcto
- Asegúrate de haber habilitado los intents necesarios en el Developer Portal

### NodeLink no se conecta
- Asegúrate de que el puerto 2333 no esté en uso
- Verifica que la contraseña en NodeLink coincida con `config/config.json`
- Revisa que las credenciales de Spotify y el ARL de Deezer sean válidos

### Error de MongoDB
- Verifica que MongoDB esté ejecutándose
- Comprueba que la URI de conexión sea correcta
- Si usas MongoDB Atlas, verifica que tu IP esté en la lista blanca

### Los comandos de música no funcionan
- Asegúrate de que NodeLink esté ejecutándose
- Verifica los logs de NodeLink para errores
- Comprueba que Deezer esté configurado correctamente (ARL válido)
- Si falla el streaming, el ARL de Deezer puede estar expirado

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**Luca Ramirez** ([@lukitaz-r](https://github.com/lukitaz-r))

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🔗 Enlaces

- [Repositorio GitHub](https://github.com/lukitaz-r/sonic-bot)
- [Reportar un Bug](https://github.com/lukitaz-r/sonic-bot/issues)
- [Discord.js Documentation](https://discord.js.org/)
- [NodeLink Documentation](https://github.com/PerformanC/NodeLink)
- [Moonlink.js Documentation](https://moonlink.js.org/)

## ⚠️ Disclaimer

Este bot es un proyecto educativo. Asegúrate de cumplir con los [Términos de Servicio de Discord](https://discord.com/terms) y las políticas de uso de las plataformas de streaming integradas.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!