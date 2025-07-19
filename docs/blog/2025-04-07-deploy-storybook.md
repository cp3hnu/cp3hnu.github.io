---
pageClass: blog-page
title: 服务器部署 Storybook 文档
tags:
  - web
  - react
  - storybook
date: 2025-04-07
author: cp3hnu
location: ChangSha
summary: 上篇文章 UmiJS + Storybook 搭建组件库文档，我使用了 Storybook 生成了 UmiJS 项目的组件库文档，这篇文章我将部署 Storybook 文档到内部服务器上。
---

# 服务器部署 Storybook 文档

上篇文章 [UmiJS + Storybook 搭建组件库文档](/2025/03/15/umijs-storybook/)，我使用了 Storybook 生成了 UmiJS 项目的组件库文档，这篇文章我将部署 Storybook 文档到内部服务器上。

> 如果想要发布到外网，可以使用 Chromatic 或者 Vercel 托管服务，详情请参考我的这篇文章 [Storybook 搭建组件库文档](/2023/09/02/storybook-in-action/#%E5%8F%91%E5%B8%83)。

部署 Storybook 文档到内部服务器有多种方式，下面我将分别介绍以下几种方式：

- HTTP 静态服务
- Nginx
- Docker
- Docker 镜像

## HTTP 静态服务

`storybook build` 编译 Storybook 生成的是静态 HTML/CSS/JS 文件，可以通过 [`http-server`](https://github.com/http-party/http-server)、[`serve`](https://github.com/vercel/serve) 或者 [`live-server`](https://github.com/tapio/live-server) 等 [Node.js](https://nodejs.org/) 服务开启一个 HTTP 静态服务。

操作步骤如下：

##### 1. 构建 Storybook

```sh
$ npm run storybook-build
```

##### 2. 把 `storybook-static` 上传到服务器

```sh
$ scp -r storybook-static/* user@your-server-ip:/remote-dir
```

##### 3. 登录服务器

 ```sh
 $ ssh user@your-server-ip
 ```

##### 4. 安装 `http-server`

```sh
$ sudo npm install -g http-server
```

##### 5. 运行 `http-server`

```sh
$ cd /remote-dir
$ http-server ./ -p 60006
```

然后就可以通过 http://your-server-ip:6006/ 访问 Storybook 生成的组件库文档了。

## Nginx

[Nginx](https://nginx.org/) 是一个高性能的开源 Web 服务器，同时也可以作为**反向代理服务器**、**负载均衡器**和**HTTP 缓存**使用。它以轻量、高并发著称，是目前互联网中应用最广泛的 Web 服务器之一。

Nginx 的主要功能有：

- **静态资源服务**：高效地处理 HTML、CSS、JavaScript、图片等前端静态文件的请求，特别适合部署前端应用。
- **反向代理**：将客户端请求转发给后端服务，常用于前后端分离架构。
- **负载均衡**：将请求分发到多台服务器上，提高系统的可用性和处理能力。
- **HTTPS 支持**：可以很方便地配置 SSL，实现安全的 HTTPS 访问。

操作步骤如下：

> 前三步是一样的，构建 Storybook、上传到服务器、登录服务器

##### 1. 构建 Storybook

```sh
$ npm run storybook-build
```

##### 2. 把 `storybook-static` 上传到服务器

```sh
$ scp -r storybook-static/* user@your-server-ip:/remote-dir
```

##### 3. 登录服务器

 ```sh
$ ssh user@your-server-ip
 ```

##### 4. 安装 Nginx（如果没有）

```sh
$ sudo apt update
$ sudo apt install nginx
```

##### 5. 配置 Nginx

```sh
$ sudo vim /etc/nginx/sites-available/storybook
```

```
server {
  listen 6006;
  server_name your-server-ip;

  location / {
    root /remote-dir;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

##### 6. 启动 Nginx

```sh
$ sudo ln -s /etc/nginx/sites-available/storybook /etc/nginx/sites-enabled/
$ sudo nginx -t
$ sudo systemctl reload nginx
```

然后就可以通过 http://your-server-ip:6006/ 访问 Storybook 生成的组件库文档了。

## Docker

[Docker](https://www.docker.com/) 是一个开源的容器化平台，它能够将应用程序及其依赖打包到一个“容器”中。这种容器可以在任何支持 Docker 的环境中一致地运行，不受操作系统和环境配置的影响。

Docker 的主要功能有：

- **环境一致性**：无论是在开发、测试还是生产环境中，Docker 都能确保你的应用以相同的方式运行，避免“在我电脑上没问题”的情况。

- **快速部署**：通过镜像快速构建和部署应用，节省配置环境的时间。

- **资源隔离**：每个容器都是独立的单元，运行在隔离的环境中，不会互相干扰。

- **易于扩展和集成**：结合 Docker Compose、Kubernetes 等工具，Docker 适用于微服务架构和大规模部署场景。

操作步骤如下：

>  前三步是一样的，构建 Storybook、上传到服务器、登录服务器

##### 1. 构建 Storybook

```sh
$ npm run storybook-build
```

##### 2. 把 `storybook-static` 上传到服务器

```sh
$ scp -r storybook-static/* user@your-server-ip:/remote-dir
```

##### 3. 登录服务器

 ```sh
$ ssh user@your-server-ip
 ```

##### 4. 安装和启用 Docker（如果没有）

```sh
# 安装
$ sudo brew install docker docker-compose
# 启动 Docker 服务
$ sudo dockerd &
# 测试 Docker 是否正常运行
$ docker ps 
```

##### 5. 用 Docker 运行 Nginx 容器

```sh
docker run -d \
  -p 6006:80 \
  --name storybook \
  -v /remote-dir:/usr/share/nginx/html:ro \
  nginx
```

命令解析：

- `-p 6006:80`:  把服务器的端口 6006 映射到容器内部的端口 80 （Nginx 在这里监听）上。

- `--name storybook`:  给 Docker 容器取一个自定义名字 storybook。
- `-v /remote-dir:/usr/share/nginx/html:ro`: 把服务器上的 `/remote-dir` 文件夹，映射到容器内部的 `/usr/share/nginx/html` 目录，并设置为只读（readonly）模式。

| **部分**              | **含义**                                             |
| --------------------- | ---------------------------------------------------- |
| -v                    | Docker volume 挂载选项（volume = 共享/挂载一个目录） |
| /remote-dir           | 主机上的目录（你的 Storybook 静态文件在这里）        |
| /usr/share/nginx/html | 容器内部的目录（Nginx 默认会从这个路径读取网页内容） |
| :ro                   | 设置挂载为只读（readonly），防止容器内修改主机文件   |

然后就可以通过 http://your-server-ip:6006/ 访问 Storybook 生成的组件库文档了。

为了简便，可以写一个脚本

```sh
#!/bin/bash

# 配置项（你可以改成自己的）
SERVER_USER=root                   # 服务器用户名
SERVER_IP=xxx.xxx.xx.xx            # 你的服务器 IP 地址
REMOTE_DIR=/var/storybook/         # 服务器上存放静态文件的目录
CONTAINER_NAME=storybook           # Docker 容器名
PORT=6006                          # 暴露的端口

# Step 1: 构建 TypeDoc 
echo "📦 构建本地 TypeDoc..."
npm run docs

# Step 2: 构建 Storybook
echo "📦 构建本地 Storybook..."
npm run storybook-build

# Step 3: 上传到服务器
echo "📤 上传静态文件到服务器 ${SERVER_IP}..."
scp -r storybook-static/* ${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}

# Step 4: 在服务器上重启 Docker 容器
echo "🚀 远程重启 Docker 容器..."
ssh ${SERVER_USER}@${SERVER_IP} << EOF
  docker stop ${CONTAINER_NAME} || true
  docker rm ${CONTAINER_NAME} || true
  docker run -d \
    -p ${PORT}:80 \
    --name ${CONTAINER_NAME} \
    -v ${REMOTE_DIR}:/usr/share/nginx/html:ro \
    nginx
EOF

echo "✅ 部署完成！你现在可以访问：http://${SERVER_IP}:${PORT}"
```

## 制作 Docker 镜像

在上面的方案中，把 `storybook-static` 上传到服务器不仅麻烦，而且费时。我们都知道，Docker 可以通过镜像来部署，这种方式部署更快、更一致、更安全。

### 安装

首先需要在本机安装 Docker

```sh
$ brew install docker docker-compose docker-buildx
```

因为我是 Macbook，Docker Engine 不能直接在 macOS 上运行（macOS 不支持 dockerd），还需要额外配置 **Docker Daemon**（可以使用 [`colima`](https://github.com/abiosoft/colima) 或 [`rancher-desktop`](https://github.com/rancher-sandbox/rancher-desktop)），这里我使用 `colima` 

```sh
$ brew install colima
# 运行
$ colima start
# 检查、测试
$ docker ps
```

Colima 的配置文件路径是 `~/.colima/default/colima.yaml`

接下来制作 Docker 镜像并进行部署

### 操作步骤

##### 1. 新建 Dockerfile

```dockerfile
# Dockerfile
FROM nginx:alpine
COPY storybook-static/ /usr/share/nginx/html
```

`nginx:alpine` 和 `nginx` 的区别是 `nginx:alpine` 是基于 **Alpine Linux** 的镜像，体积小，而 `nginx` 拉取的是 `nginx:latest`，默认基于 **Debian** 的完整版镜像，体积大。对应 Storybook 生成的静态资源，使用 `nginx:alpine` 就够了。

##### 2.  构建 Storybook

```sh
$ npm run storybook-build
```

##### 3. 构建镜像

```sh
$ docker build -t storybook-app:latest .
```

##### 4. 保存为压缩文件

```sh
$ docker save storybook-app:latest | gzip > storybook-app.tar.gz
```

##### 5. 上传服务器 

```sh
$ scp storybook-app.tar.gz user@your-server-ip:~/
```

##### 6. 服务器上加载镜像并运行 

```sh
$ ssh user@your-server-ip
$ gunzip -c storybook-app.tar.gz | docker load
$ docker run -d --name storybook -p 6006:80 storybook-app:latest
```

为了简便，可以写一个脚本

```sh
#!/bin/bash

# === 可配置参数 ===
SERVER_USER=your-user              # 服务器用户名（比如 ubuntu）
SERVER_IP=xxx.xxx.xx.xx            # 服务器 IP
CONTAINER_NAME=storybook           # Docker 容器名称
PORT=6006                          # 映射到宿主机的端口
IMAGE_NAME=storybook-app           # Docker 镜像名
IMAGE_TAG=latest
TAR_FILE=${IMAGE_NAME}.tar.gz

# Step 1: 构建 TypeDoc 
echo "📦 1. 构建本地 TypeDoc..."
npm run docs || { echo "❌ TypeDoc 构建失败"; exit 1; }

# Step 2: 构建 Storybook
echo "🛠️  2. 构建 Storybook..."
npm run build-storybook || { echo "❌ Storybook 构建失败"; exit 1; }

# Step 3: 构建 Docker 镜像
echo "🐳  3. 构建 Docker 镜像..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} . || { echo "❌ Docker 构建失败"; exit 1; }

# Step 4: 打包镜像
echo "📦  4. 打包镜像..."
docker save ${IMAGE_NAME}:${IMAGE_TAG} | gzip > ${TAR_FILE}

# Step 5: 上传镜像到服务器
echo "📤  5. 上传镜像到服务器 ${SERVER_IP}..."
scp ${TAR_FILE} ${SERVER_USER}@${SERVER_IP}:~/

# Step 6: 登录服务器并加载镜像
echo "🚀  6. 登录服务器并加载镜像 + 启动容器..."
ssh ${SERVER_USER}@${SERVER_IP} << EOF
  echo "🧹 删除旧容器（如果存在）..."
  docker stop ${CONTAINER_NAME} 2>/dev/null || true
  docker rm ${CONTAINER_NAME} 2>/dev/null || true

  echo "📥 加载镜像..."
  gunzip -c ${TAR_FILE} | docker load

  echo "🚀 启动容器..."
  docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${PORT}:80 \
    ${IMAGE_NAME}:${IMAGE_TAG}

  echo "✅ 容器已启动： http://${SERVER_IP}:${PORT}"
EOF

echo "🎉 全部完成！现在你可以访问：http://${SERVER_IP}:${PORT}"
```

我们还可以添加更多功能，比如添加部署时间统计、成功/失败提示音等
```sh
#!/bin/bash

set -e

# === 配置项 ===
SERVER_USER=your-user                     # 服务器用户名
SERVER_IP=xxx.xxx.xx.xx                   # 服务器 IP
CONTAINER_NAME=storybook-app
PORT=6007                                 # 修改端口以避开已用的 6006
IMAGE_NAME=storybook-app
IMAGE_TAG=latest
TAR_FILE=${IMAGE_NAME}.tar.gz

start_time=$(date +%s)

# === 出错时提示音 ===
function on_error {
  echo "❌ 脚本执行失败！"
  if command -v afplay &>/dev/null; then
    afplay /System/Library/Sounds/Funk.aiff
  elif command -v paplay &>/dev/null; then
    paplay /usr/share/sounds/freedesktop/stereo/dialog-error.oga
  fi
  exit 1
}
trap on_error ERR

# === Step 1: 构建 TypeDoc ===
echo "📚 1. 构建本地 TypeDoc..."
npm run docs

# === Step 2: 构建 Storybook ===
echo "🛠️  构建 Storybook..."
npm run build-storybook

# === Step 3: 使用 buildx 构建 amd64 镜像 ===
echo "🐳 构建 Docker 镜像（平台 linux/amd64）..."
docker buildx build \
  --platform linux/amd64 \
  -t ${IMAGE_NAME}:${IMAGE_TAG} \
  --load .

# === Step 4: 导出镜像为 tar.gz ===
echo "📦 导出并压缩镜像..."
docker save ${IMAGE_NAME}:${IMAGE_TAG} | gzip > ${TAR_FILE}

# === Step 5: 上传压缩包到服务器 ===
echo "📤 上传压缩包到服务器 ${SERVER_IP}..."
scp ${TAR_FILE} ${SERVER_USER}@${SERVER_IP}:~/

# === Step 6: SSH 远程部署容器 ===
echo "🚀 登录服务器并部署容器..."
ssh ${SERVER_USER}@${SERVER_IP} << EOF
  docker stop ${CONTAINER_NAME} 2>/dev/null || true
  docker rm ${CONTAINER_NAME} 2>/dev/null || true
  gunzip -c ${TAR_FILE} | docker load
  docker run -d --name ${CONTAINER_NAME} -p ${PORT}:80 ${IMAGE_NAME}:${IMAGE_TAG}
EOF

end_time=$(date +%s)
duration=$((end_time - start_time))

echo "✅ 部署完成，耗时 ${duration} 秒！访问地址：http://${SERVER_IP}:${PORT}"

# === 成功提示音 ===
if command -v afplay &>/dev/null; then
  afplay /System/Library/Sounds/Glass.aiff
elif command -v paplay &>/dev/null; then
  paplay /usr/share/sounds/freedesktop/stereo/complete.oga
fi
```

## References

- [`http-party/http-server`](https://github.com/http-party/http-server)

- [`vercel/serve`](https://github.com/vercel/serve) 

- [`tapio/live-server`](https://github.com/tapio/live-server)

-  [Node.js](https://nodejs.org/)

- [Nginx](https://nginx.org/)

- [Docker](https://www.docker.com/)

- [`abiosoft/colima`](https://github.com/abiosoft/colima)

- [`rancher-sandbox/rancher-desktop`](https://github.com/rancher-sandbox/rancher-desktop)

  
