start-db:
	docker compose up -d

stop-db:
	docker compose down

logs-db:
	docker compose logs -f mysql
