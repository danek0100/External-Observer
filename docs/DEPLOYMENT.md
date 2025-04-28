# Руководство по разворачиванию

## Требования

- Docker
- Docker Compose
- Node.js 18+
- Java 17+
- Maven 3.8+

## Локальная разработка

### Запуск всех сервисов

```bash
docker-compose up
```

Это запустит:
- MongoDB на порту 27017
- Backend (Spring Boot) на порту 8080
- Frontend (React) на порту 3000

### Запуск отдельных сервисов

#### Frontend

```bash
# Запуск только фронтенда
npm run docker:dev

# Сборка образа
npm run docker:build

# Остановка контейнеров
npm run docker:down
```

#### Backend

```bash
# Запуск только бэкенда
docker-compose up backend

# Сборка образа
docker-compose build backend
```

#### MongoDB

```bash
# Запуск только MongoDB
docker-compose up mongodb
```

### Доступ к сервисам

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- MongoDB: mongodb://localhost:27017

## Переменные окружения

### Frontend

- `VITE_API_URL` - URL бэкенда (по умолчанию: http://localhost:8080)

### Backend

- `SPRING_DATA_MONGODB_URI` - URI подключения к MongoDB
- `SPRING_PROFILES_ACTIVE` - активный профиль Spring (dev/prod)

## Тома Docker

- `mongodb_data` - данные MongoDB
- `~/.m2` - кэш Maven
- `./client` - исходный код фронтенда
- `./server` - исходный код бэкенда

## Отладка

### Frontend

1. Откройте http://localhost:3000 в браузере
2. Используйте DevTools для отладки

### Backend

1. Подключитесь к контейнеру:
```bash
docker-compose exec backend bash
```

2. Просмотр логов:
```bash
docker-compose logs -f backend
```

### MongoDB

1. Подключение к MongoDB:
```bash
docker-compose exec mongodb mongosh
```

## Остановка и очистка

```bash
# Остановка всех контейнеров
docker-compose down

# Остановка с удалением томов
docker-compose down -v
``` 