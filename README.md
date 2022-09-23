# VodTube

this is a server of video using hls

## Adverting
Use the [api hls v2](https://github.com/luisvalverd/Api_hls_v2) 

## Dependencies

| Dependencies | Version |
| ------------ | ------- |
| NodeJs       | 14.19.x |
| Postgres     | 14.3    |

## Install Dependencies

### ffmpeg

Ubutu:

```bash
  sudo apt update

  sudo apt install ffmpeg

```

CentOS:

```bash
  sudo yum install ffmpeg ffmpeg-devel -y
```

Arch:

```bash
  sudo pacman -S ffmpeg
```

### Dependencies of project

```bash
  npm install
```

create directiory videos and uploads

```bash
  mkdir videos uploads
```

## Variables .env

use the reference exmaple.env to make .env

add port and host

```env
PORT=8000
HOST=127.0.0.1
```

Env Database

```env
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
```

Credentials Database

```env
DATABASE_PASS=pass
DATABASE_USER=user
```

## Initialization Server

**Precation:**
Sure that hls-api is work

develop server:

```bash
  npm run dev:server
```

start server:

```bash
  npm run start
```
