# VodTube 

this is a server of video using hls 

## Dependencies

| Dependencies  | Version   |
| ------------- | --------- |
| NodeJs        | 14.19.x   |
| Postgres      | 14.3      |


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

develop server
```bash
  npm run dev:server
```

